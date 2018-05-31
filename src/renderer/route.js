import Home from './pages/Home';
import menus from './utils/menu';

const childrenRoutes = [];

for (const menu of menus) {
  childrenRoutes.push(menu);
}

const routes = [
  {
    path: '/',
    component: Home,
    redirect: '/welcome',
    children: childrenRoutes,
  },
];

export default routes;
