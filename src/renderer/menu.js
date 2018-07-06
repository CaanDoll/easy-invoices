import Goods from './pages/menu/Goods.vue';
import DetailList from './pages/menu/DetailList.vue';

const menu = [
  {
    icon: 'cube',
    title: '物品管理',
    path: '/goods',
    component: Goods,
  },
  {
    icon: 'clipboard',
    title: '进出明细',
    path: '/detailList',
    component: DetailList,
  },
];
export default menu;
