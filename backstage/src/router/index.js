import Vue from 'vue'
import VueRouter from 'vue-router'
import Changepwd from '../components/Changepwd.vue'
import Foopwd from '../components/Foopwd.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Changepwd',
    component: Changepwd,
  },
  {
    path: '/foopwd',
    name: 'Foopwd',
    component: Foopwd,
  },
]

const router = new VueRouter({
  routes,
})

export default router
