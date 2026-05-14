/** @type {import('@babel/core').TransformOptions} */
module.exports = function babelConfig(api) {
  const isDev = api.env('development');
  return {
    presets: [
      ['@babel/preset-env', { targets: 'defaults', modules: false }],
      ['@babel/preset-react', { runtime: 'automatic' }],
      '@babel/preset-typescript',
    ],
    plugins: [...(isDev ? ['react-refresh/babel'] : [])],
  };
};
