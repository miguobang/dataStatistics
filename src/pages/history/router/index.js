import Vue from 'vue'
import Router from 'vue-router'
import history from '@/components/history'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'history',
      component: history
    }
  ],
})
