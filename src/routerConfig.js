// 以下文件格式为描述路由的协议格式
// 你可以调整 routerConfig 里的内容
// 变量名 routerConfig 为 iceworks 检测关键字，请不要修改名称

import BlankLayout from './layouts/BlankLayout';
import Home from './pages/Home';
import ShopList from './pages/ShopList';
import HeaderAsideFooterResponsiveLayout from './layouts/HeaderAsideFooterResponsiveLayout';
import Goods from './pages/Goods';
import Buy from './pages/Buy';
import CreateGood from './pages/CreateGood';
import CreateShop from './pages/CreateShop';
import NotFound from './pages/NotFound';

const routerConfig = [
  {
    path: '/',
    layout: BlankLayout,
    component: Home,
  },
  {
    path: '/shopList',
    layout: HeaderAsideFooterResponsiveLayout,
    component: ShopList,
  },
  {
    path: '/goods',
    layout: HeaderAsideFooterResponsiveLayout,
    component: Goods,
  },
  {
    path: '/buy',
    layout: HeaderAsideFooterResponsiveLayout,
    component: Buy,
  },
  {
    path: '/createGood',
    layout: HeaderAsideFooterResponsiveLayout,
    component: CreateGood,
  },
  {
    path: '/createShop',
    layout: HeaderAsideFooterResponsiveLayout,
    component: CreateShop,
  },
  {
    path: '*',
    layout: BlankLayout,
    component: NotFound,
  },
];

export default routerConfig;
