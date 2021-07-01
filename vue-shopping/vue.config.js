module.exports = {
  //开发服务器的配置
  runtimeCompiler: true,

  //所有资源使用相对路径

  publicPath: './',

  //打包后资源存放的目录

  outputDir: 'dist',

  //设置所有标签属性有双引号

  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].title = 'web22'

      args[0].minify = false

      return args
    })
  },
  devServer: {
    host: '127.0.0.1',

    port: 9999,

    https: false,

    open: true,
    proxy: {
      '/api': {
        target: 'https://www.sheli.net.cn:3009/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
}
