import Vue from 'vue'
import Router from 'vue-router'
import KfcHome from '@/components/KfcHome'
const detailPage = () => import('@/components/DetailedPage')

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'KfcHome',
      component: KfcHome,
      meta: { keepAlive: true }
    },{
      path: '/detail',
      name: 'detailPage',
      component: detailPage
    }
  ]
})
