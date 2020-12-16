import Vue from 'vue';
import App from './App.vue';
import router from './router';
import firebase from 'firebase';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

let app = null;

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    new Vue({
      router,
      vuetify,
      render: (h) => h(App)
    }).$mount('#app');
  }
});
