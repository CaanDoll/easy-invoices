import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import db from './utils/service';
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import routes from './route';
import store from './store';
import filters from './utils/filter';

Vue.prototype.$db = db;

Vue.use(VueRouter);

Vue.use(iView);

Object.keys(filters).forEach(k => Vue.filter(k, filters[ k ]));

const router = new VueRouter({
  routes,
});

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
});
