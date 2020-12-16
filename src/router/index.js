import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Signup from '@/components/auth/Signup';
import Login from '@/components/auth/Login';
import Index from '../views/Index.vue'
import firebase from 'firebase';

Vue.use(VueRouter);

const routes = [
  {
    path: '/eta',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  { 
    path: '/', 
    redirect: '/login' 
  },
  { 
    path: '/indexview', 
    name: 'TableIndex' ,
    component: Index
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((rec) => rec.meta.requiresAuth)) {
    let user = firebase.auth().currentUser;
    if (user) {
      next();
    } else {
      next({ name: 'Login' });
    }
  } else {
    next();
  }
});

export default router;
