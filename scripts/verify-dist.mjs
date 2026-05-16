import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(__dirname, '..', 'dist');
const indexPath = path.join(dist, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error('verify-dist: dist/index.html not found — run npm run build first');
  process.exit(1);
}

const basePathRaw = process.env.VITE_BASE_PATH || '/';
const publicPath = basePathRaw.endsWith('/') ? basePathRaw : `${basePathRaw}/`;
const html = fs.readFileSync(indexPath, 'utf8');

const scriptMatch = html.match(/<script[^>]+src="([^"]+)"/);
if (!scriptMatch) {
  console.error('verify-dist: no <script src> in index.html');
  process.exit(1);
}

const scriptSrc = scriptMatch[1];
if (publicPath !== '/' && !scriptSrc.startsWith(publicPath)) {
  console.error(
    `verify-dist: script src="${scriptSrc}" does not use publicPath="${publicPath}" (GitHub Pages will show a white screen)`
  );
  process.exit(1);
}

if (!fs.existsSync(path.join(dist, '404.html'))) {
  console.error('verify-dist: dist/404.html missing — SPA deep links will fail on GitHub Pages');
  process.exit(1);
}

console.log(`verify-dist: OK (publicPath=${publicPath}, script=${scriptSrc})`);
