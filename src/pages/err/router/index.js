import Vue from 'vue'
import Router from 'vue-router'
import err from '@/components/err'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'err',
      component: err
    }
  ],
})
