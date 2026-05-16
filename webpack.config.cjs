const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

function loadEnv(mode) {
  const root = __dirname;
  const isProd = mode === 'production';
  const files = isProd
    ? ['.env.production.local', '.env.local', '.env.production', '.env']
    : ['.env.development.local', '.env.local', '.env.development', '.env'];
  const dotenv = require('dotenv');
  for (const file of files) {
    const full = path.join(root, file);
    if (fs.existsSync(full)) {
      dotenv.config({ path: full, override: true });
    }
  }
}

/**
 * @param {Record<string, string | undefined>} env
 * @param {{ mode?: string }} argv
 */
module.exports = (_env, argv) => {
  const mode = argv.mode === 'production' ? 'production' : 'development';
  const isProd = mode === 'production';
  loadEnv(mode);

  const basePathRaw = process.env.VITE_BASE_PATH || '/';
  const publicPath = basePathRaw.endsWith('/') ? basePathRaw : `${basePathRaw}/`;

  return {
    mode,
    context: __dirname,
    entry: path.resolve(__dirname, 'src/main.tsx'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProd ? 'assets/[name].[contenthash:8].js' : 'assets/[name].js',
      chunkFilename: isProd ? 'assets/[name].[contenthash:8].js' : 'assets/[name].js',
      publicPath,
      clean: isProd,
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: { cacheDirectory: true, envName: mode },
          },
        },
        {
          test: /\.module\.css$/,
          use: [
            isProd ? MiniCssExtractPlugin.loader : 'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: isProd ? '[hash:base64:6]' : '[path][name]__[local]',
                  namedExport: false,
                  /** Как в Vite: имена классов в JS — как в CSS (`.home__header` → `styles.home__header`). */
                  exportLocalsConvention: 'as-is',
                },
              },
            },
          ],
        },
        {
          test: /\.css$/,
          exclude: /\.module\.css$/,
          use: [isProd ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader'],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.BASE_URL': JSON.stringify(publicPath),
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
      new webpack.EnvironmentPlugin({
        VITE_API_URL: '/api',
        VITE_ENABLE_MSW: 'false',
        VITE_BASE_PATH: publicPath,
        VITE_THEMEALDB_BASE_URL: '',
        VITE_THEMEALDB_REFRESH_MS: '',
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'index.html'),
        templateParameters: { BASE_URL: publicPath },
        inject: 'body',
        minify: isProd
          ? {
              collapseWhitespace: true,
              removeComments: true,
            }
          : false,
      }),
      new CopyWebpackPlugin({
        patterns: [{ from: path.resolve(__dirname, 'public'), to: '.', noErrorOnMissing: true }],
      }),
      ...(isProd
        ? [
            new MiniCssExtractPlugin({
              filename: 'assets/[name].[contenthash:8].css',
              chunkFilename: 'assets/[name].[contenthash:8].css',
            }),
          ]
        : [new ReactRefreshWebpackPlugin()]),
    ],
    devtool: isProd ? 'source-map' : 'eval-cheap-module-source-map',
    devServer: {
      host: '127.0.0.1',
      port: 5173,
      hot: true,
      historyApiFallback: { index: `${publicPath}index.html` },
      static: [path.resolve(__dirname, 'public')],
    },
    optimization: {},
  };
};
