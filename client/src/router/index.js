import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Kenan from '../views/Kenan.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Shorten URL',
    },
  },
  {
    path: '/k',
    name: 'Kenan',
    component: Kenan,
    meta: {
      title: '柯南-多瑙',
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  next();
});

export default router;
