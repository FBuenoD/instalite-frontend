module.exports = {
  devServer: {
    proxy: 'http://instalite-backend.herokuapp.com/',
  },
  "transpileDependencies": [
    "vuetify"
  ],
  publicPath: process.env.NODE_ENV === 'production'
    ? '/instalite-frontend/'
    : '/'
}