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
    path: "/blog/admin/post",
    name: "new_revision",
    component: () =>
      import(
        /* webpackChunkName: "new_revision" */ "@/views/blog/admin/new_revision.vue"
      )
  },
  {
    path: "/blog/articles",
    name: "article_list",
    component: () =>
      import(
        /* webpackChunkName: "article_list" */ "@/views/blog/article_list.vue"
      )
  },
  {
    path: "/blog/admin/paths",
    name: "path_list",
    component: () =>
      import(
        /* webpackChunkName: "path_list" */ "@/views/blog/admin/path_list.vue"
      )
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
