import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
      themes: {
          light: {
          primary: '#d4a494',
          secondary: '#e5d5ca',
          accent: '#777',
          error: '#b71c1c',
          },
          dark: {
            primary: '#fff',
            secondary: '#fff',
            accent: '#fff',
            error: '#b71c1c',
          },
      },
  },
});

