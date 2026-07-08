module.exports = function (api) {
  api.cache(true)
  return {
    presets: [['babel-preset-expo', {jsxImportSource: 'nativewind'}], 'nativewind/babel'],
    plugins: [
      'react-native-worklets/plugin',
    ],
    overrides: [
      {
        test: (filename) =>
          Boolean(filename && /src\/shared\/database\/models\/.*\.ts$/.test(filename)),
        plugins: [
          ['@babel/plugin-proposal-decorators', {legacy: true}],
          ['@babel/plugin-transform-class-properties', {loose: true}],
        ],
      },
    ],
  }
}
