import Vue from 'vue'
import VueRouter from 'vue-router'
let Home = () => import('../components/Home.vue')
let Welcome = () => import('../components/Welcome.vue')
let Login = () => import('../components/Login.vue')

// 重写push函数，解决两次访问同一个路径报错
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch((error) => error)
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        name: 'Welcome',
        component: Welcome,
      },
    ],
  },
  {
    path: '/',
    name: 'Login',
    component: Login,
  },
]

const router = new VueRouter({ routes })

// 全局路由前置守卫
router.beforeEach((to, from, next) => {
  let toPath = to.path
  let fromPath = from.path
  console.log(fromPath)
  if (toPath === '/') {
    return next()
  }
  // 判断是否登录
  let token = getToken()
  if (!token) {
    return next('/')
  }
  next()
})

// 路由的后置守卫
router.afterEach((to) => {
  let path = to.path
  // 设置文档标题名称
  document.title = getTitle(path)
})

// 根据请求路径获得文档标题名称
function getTitle(path) {
  if (path === '/') {
    return '登录'
  } else if (path === '/home') {
    return '首页'
  } else if (path === '/welcome') {
    return '欢迎页'
  } else {
    return '404'
  }
}

// 获得sessionStorage中的token函数
function getToken() {
  let str = sessionStorage.getItem('user-login')
  if (!str) {
    return ''
  }
  let object = JSON.parse(str)
  console.log(object)
  return object.data.data.token
}

export default router
