import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import routes from './route';
import store from './store';
import filters from './utils/filter';
import db from './utils/db';
import logger from './utils/logger';

Vue.use(VueRouter);

Vue.use(iView);

Object.keys(filters).forEach(k => Vue.filter(k, filters[ k ]));

const router = new VueRouter({
  routes,
});

Vue.prototype.$db = db;

Vue.prototype.$logger = logger;

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
});
