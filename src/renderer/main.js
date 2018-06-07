import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';

Vue.use(VueRouter);

import iView from 'iview';
import 'iview/dist/styles/iview.css';

import routes from './route';
import store from './store';

Vue.use(iView);
import filters from './utils/filter';

Object.keys(filters).forEach(k => Vue.filter(k, filters[ k ]));

const router = new VueRouter({
  routes,
});

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.config.productionTip = false;
import Loki from 'lokijs';
import path from 'path';
Vue.prototype.$db = new Loki(path.resolve(__dirname, '../../db.json'));

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
});
