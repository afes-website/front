import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";

import BootstrapVue from "bootstrap-vue";
Vue.use(BootstrapVue);
import "@/assets/sass/main.scss";

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
