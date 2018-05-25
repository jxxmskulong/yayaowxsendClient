import Vue from 'vue'
import iView from 'iview'
import VueRouter from 'vue-router'
import router from './router'

import App from './app.vue'
import 'iview/dist/styles/iview.css'
import axios from 'axios'
import vueaxios from 'vue-axios'
import Qs from 'qs'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
//axios.defaults.baseURL = 'http://localhost:8011'
axios.defaults.baseURL = 'http://118.190.133.146:8091'
Vue.use(vueaxios,axios);
Vue.use(VueRouter);
Vue.use(iView);
Vue.prototype.$ajax = axios
Vue.prototype.Qs = Qs

// 路由配置
// const RouterConfig = {
//     mode: 'history',
//     routes: Routers
// };
//const router = new VueRouter(RouterConfig);

new Vue({
    el: '#app',
    router: router,
    render: h => h(App)
});
