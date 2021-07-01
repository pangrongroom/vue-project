import Vue from 'vue'
import App from './App.vue'
import router from './router'


import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

//导入全局样式表
import './assets/css/global.css'
//导入表格插件
import TreeTable from 'vue-table-with-tree-grid'
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
//导入富文本编辑的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme


import axios from 'axios'
//配置请求的根路径
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
//拦截器
axios.interceptors.request.use(config => {
  // console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem('token')
  //在最后必须把config传出去
  return config
})
//挂载到vue的原型上 可以直接用 this.$http调用发送请求
Vue.prototype.$http = axios


Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)
//j将富文本编辑器，注册为全局可用的组件
Vue.use(VueQuillEditor)
//时间过滤器 //格式化时间戳 函数
Vue.filter('dateFormate',function(originVal){
   const dt = new Date(originVal)
   const y=  dt.getFullYear()
   const m = (dt.getMonth() +1 + '').padStart(2,'0')
  const d = (dt.getDate() + '').padStart(2,'0')
  const hh = (dt.getHours() + '').padStart(2,'0')
  const mm = (dt.getMinutes() + '').padStart(2,'0')
  const ss = (dt.getSeconds() + '').padStart(2,'0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
