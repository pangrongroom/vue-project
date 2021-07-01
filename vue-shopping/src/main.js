import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//引入element-ui的样式
import 'element-ui/lib/theme-chalk/index.css'
import './plugins/element.js'
//引入全局的样式
import './assets/css/style.css'
//引入iconfont.css
// import './assets/icon/iconfont.css'
//引入全局的nprogress样式
// import 'nprogress/nprogress.css'
//引入tree-table
// import ZkTable from 'vue-table-with-tree-grid'
//Vue.use(ZkTable)
// Vue.component('tree-table', ZkTable)
//设置请求的基准路径
Vue.config.productionTip = false
//使用Vue原型对象挂载axios，在所有的vue实例中都可以使用this.axios发起请求
Vue.filter('format', function (v) {
  let date = new Date(v)
  let y = date.getFullYear()
  let M = (date.getMonth() + 1 + '').padStart(2, '0')
  let d = (date.getDate() + '').padStart(2, '0')
  let h = (date.getHours() + '').padStart(2, '0')
  let m = (date.getMinutes() + '').padStart(2, '0')
  let s = (date.getSeconds() + '').padStart(2, '0')
  return `${y}-${M}-${d} ${h}:${m}:${s}`
})

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
