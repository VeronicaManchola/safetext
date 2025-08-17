module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@app': './app',
            '@components': './src/components',
            '@constants': './src/constants',
            '@utils': './src/utils',
            '@providers': './src/providers',
            '@domain': './src/domain',
            '@domain/entities': './src/domain/entities',
            '@domain/repositories': './src/domain/repositories',
            '@domain/usecases': './src/domain/usecases',
            '@data': './src/data',
            '@data/repositories': './src/data/repositories',
            '@data/services': './src/data/services',
            '@data/sources': './src/data/sources',
            '@viewmodels': './src/viewmodels',
            '@hooks': './src/hooks',
          },
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        },
      ],
    ],
  };
};
