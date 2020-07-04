module.exports = {
  outputDir: '/Users/kangxu/Documents/webdev/k-shorten/server/public',
  devServer: {
    proxy: {
      '/*': {
        target: 'http://localhost:4000',
      },
    },
  },
  transpileDependencies: [
    'vuetify',
  ],
};
