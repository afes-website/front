import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import(/* webpackChunkName: "Home" */ "@/views/Home.vue")
  },
  {
    path: "/about",
    name: "about",
    component: () => import(/* webpackChunkName: "about" */ "@/views/about.vue")
  },
  {
    path: "/access",
    name: "access",
    component: () =>
      import(/* webpackChunkName: "access" */ "@/views/access.vue")
  },
  {
    path: "/policy",
    name: "policy",
    component: () =>
      import(/* webpackChunkName: "policy" */ "@/views/policy.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
