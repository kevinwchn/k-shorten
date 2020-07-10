module.exports = {
  outputDir: '/Users/kangxu/Documents/webdev/k-shorten/server/public',
  devServer: {
    proxy: {
      '/api/*': {
        target: 'http://localhost:4000'
      },
      // '/*': {
      //   target: 'http://localhost:4000',
      // },
    },
  },
  transpileDependencies: [
    'vuetify',
  ],
};
