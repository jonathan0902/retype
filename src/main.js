import Vue from 'vue';
import App from './App.vue';
import router from './router';
import VModal from 'vue-js-modal';
import { ValidationProvider } from 'vee-validate';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCog, faPlus, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faCog, faPlus, faEdit);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.component('ValidationProvider', ValidationProvider);

Vue.use(VModal);
Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
