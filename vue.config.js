const { defineConfig } = require('@vue/cli-service');
const webpack = require('webpack');
const path = require('path');

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/web-learning/'
    : '/'
}

module.exports = defineConfig({
  transpileDependencies: true,

  // 开发服务器配置
  devServer: {
    port: 8080, // 可以根据需要更改端口号
    open: true, // 自动打开浏览器
  },

  // Webpack 额外配置
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      }
    },
    plugins: [
      new webpack.DefinePlugin({
        '__VUE_OPTIONS_API__': JSON.stringify(true),
        '__VUE_PROD_DEVTOOLS__': JSON.stringify(false),
        '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': JSON.stringify(false)
      })
    ]
  },

  // 设置 publicPath
  publicPath: process.env.NODE_ENV === 'production' ? '/my-app/' : '/',

  // CSS 预处理器配置
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "@/styles/global.scss";`
      }
    }
  }
});
