import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(__dirname, '..', 'dist');
const index = path.join(dist, 'index.html');
const dest = path.join(dist, '404.html');

if (fs.existsSync(index)) {
  fs.copyFileSync(index, dest);
  console.log('SPA fallback: copied index.html -> 404.html');
}
