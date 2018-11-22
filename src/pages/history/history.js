import Vue from 'vue'
import history from './history.vue'
import router from './router/index'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import echarts from "echarts";
import 'jquery'
import VueResource from 'vue-resource'


Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(VueResource);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(history),
})
