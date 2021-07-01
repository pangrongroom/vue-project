import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('../components/Login.vue')
const Home = () => import('../components/Home.vue')
const Welcome = () => import('../components/Welcome.vue')
const User = () => import('../components/user/User.vue')
const Rights = () => import('../components/power/Rights.vue')
const Roles = () => import('../components/power/Roles.vue')
const Cate = () => import('../components/goods/Cate.vue')
const Params = () => import('../components/goods/Params.vue')
const List = () => import('../components/goods/List.vue')
const Add = () => import('../components/goods/Add.vue')
const Order = () => import('../components/order/Order.vue')
const Report = () => import('../components/report/Report.vue')

Vue.use(VueRouter)

const routes = [
  { 
    path: '/',
    redirect: '/login',
  },

  { path: '/login',
   component: Login 
  },
  {
    path: '/home',
    component: Home,
    redirect:'/welcome',
    children:[
      {path:'/welcome',
        component: Welcome
      },
        {
          path:'/users',
          component: User
        },
        {
          path:'/rights',
          component: Rights

        },
        {
          path:'/roles',
          component: Roles

        },
        {
          path:'/categories',
          component: Cate
        },
        {
          path:'/params',
          component: Params
        },
        {
          path:'/goods',
          component:List,
          // children:[
          //   {
          //     path: '/add',
          //     component: Add
          //   }
          // ]
        },
        {
          path:'/goods/add',
          component:Add
        },
        {
          path:'/orders',
          component: Order
        },
        {
          path:'/reports',
          component: Report
        }
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

//挂载路由导航守卫
//控制home的访问权限
router.beforeEach((to, from, next) => {
  //to 将要访问的路径
  //from 代表从那个路径跳转而来
  //next 是一个函数，表示放行
  // next() 放行 next ('/login') 登陆界面直接放行
  if (to.path === '/login') return next()
  //获取 token
  const tokenStr = window.sessionStorage.getItem('token')
  //判断 if token为false 就说明没有登陆 不让next到home 强制到/loggin
  if (!tokenStr) return next('/login')
  //否则有token 说明登陆成功 然后放行next到home
  next()
})
export default router
