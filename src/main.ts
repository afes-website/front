import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";

import BootstrapVue from "bootstrap-vue";
Vue.use(BootstrapVue);
import "@/assets/sass/main.scss";
import "@/assets/sass/style.scss";

import titleMixin from "@/titleMixin";
Vue.mixin(titleMixin);

import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fas);
Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
