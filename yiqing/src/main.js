import Vue from 'vue'
import App from './App.vue'
import ElementUi from 'element-ui'
import { Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from '../router'
import VCharts from 'v-charts'
import 'v-charts/lib/pie.common'
Vue.use(VCharts)
Vue.use(ElementUi)
import axios from 'axios'
// import router from '../router'

import io from './components/socket/weapp.socket.io'
//套接字端口定义
Vue.prototype.socket = io('http://localhost:5200')

Vue.prototype.basePath = "http://localhost:3000";
// 引用vue-socket.io
import VueSocket from 'vue-socket.io'
Vue.use(new VueSocket({
  debug: false,
  connection: 'http://localhost:5200'
}))

axios.defaults.baseURL = 'http://localhost:3000';

/**
 * 
 * 封装axios方法
 * @param options
 */
let futureAxios = (options) => {
  options.data.token = window.localStorage.token;
  axios({
    url: options.url,
    method: options.method || 'POST',
    data: options.data,
    params: options.data,
  }).then(result => {
    if (options.success) {
      options.success(result.data)
    }
  }).catch(err => {
    let msg = err.response ? err.response.data : '请求异常'
    if (options.error) {
      options.error(msg)
      Message.error({ message: msg, offset: 150 });
    } else {
      Message.error({ message: msg, offset: 150 });
    }
  })
}

/**
 * //封装axios方法,为不需要登录操作时使用
 * @param options 配置
 */
let Axios = (options) => {
  axios({
    url: options.url,
    method: options.method || 'POST',
    data: options.data,
    params: options.data
  }).then(result => {
    if (options.success) options.success(result.data)
  }).catch(err => {
    let msg = err.response ? err.response.data : '请求异常'
    if (options.error) {
      options.error(msg)
      Message.error({ message: msg, offset: 150 });
    } else {
      Message.error({ message: msg, offset: 150 });
    }
  })
}


//需要添加拦截器的
Vue.prototype.$axiosjwt = futureAxios
//不拦截的(不带token)往往用在vue创建前的生命周期中
Vue.prototype.$Axios = Axios
Vue.config.productionTip = false

window.vm = new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
