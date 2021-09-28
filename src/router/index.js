import Vue from 'vue'
import VueRouter from 'vue-router'
import StarshipsListPage from '../views/StartshipsListPage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'StarshipsListPage',
    component: StarshipsListPage,
  },
  {
    path: '/starships/:id',
    name: 'StarshipsItemPage',
    component: () => import(/* webpackChunkName: "StarshipsItemPage" */ '../views/StarshipsItemPage.vue'),
    props: true,
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
