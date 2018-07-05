import Goods from './pages/menu/Goods.vue';

const menu = [
  {
    icon: 'cube',
    title: '物品',
    path: '/goods',
    component: Goods,
  },
  {
    icon: 'clipboard',
    title: '进出明细',
    path: '/record',
    component: Goods,
  },
];
export default menu;
