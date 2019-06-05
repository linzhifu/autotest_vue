// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import './assets/css/main.css'
import './assets/icon/iconfont.css'
import VCharts from 'v-charts'

Vue.use(ElementUI)
Vue.use(VCharts)

Vue.config.productionTip = false
// Vue.prototype.url = 'http://172.16.9.88/'
Vue.prototype.url = 'http://127.0.0.1:8000/'
// Vue.prototype.url = 'http://47.106.111.62/'
Vue.prototype.axios = axios
Vue.prototype.storage = window.localStorage
Vue.prototype.path = ''
// axios.defaults.withCredentials = true

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
