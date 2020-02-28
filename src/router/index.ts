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
  },
  {
    path: "/document",
    name: "document",
    component: () =>
      import(/* webpackChunkName: "document" */ "@/views/document.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) return { selector: to.hash };
    return { x: 0, y: 0 };
  },
  routes
});

export default router;
