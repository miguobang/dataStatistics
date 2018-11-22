import Vue from 'vue'
import Router from 'vue-router'
import Main1 from '@/components/index/Main1'
import Main2 from '@/components/index/Main2'
import Main3 from '@/components/index/Main3'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Main1
    },
    {
      path: '/nav1',
      name: 'Main1',
      component: Main1
    },
    {
      path: '/nav2',
      name: 'Main2',
      component: Main2
    },
    {
      path: '/nav3',
      name: 'Main3',
      component: Main3
    }
  ]
})
