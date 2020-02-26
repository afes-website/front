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
    path: "/blog",
    name: "blog_top",
    component: () =>
      import(
        /* webpackChunkName: "category_list" */ "@/views/blog/category_list.vue"
      )
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
    path: "/blog/admin/paths",
    name: "path_list",
    component: () =>
      import(
        /* webpackChunkName: "path_list" */ "@/views/blog/admin/path_list.vue"
      )
  },
  {
    path: "/blog/admin/paths/:id",
    name: "manage_path",
    component: () =>
      import(
        /* webpackChunkName: "manage_path" */ "@/views/blog/admin/manage_path.vue"
      )
  },
  {
    path: "/blog/admin/revisions",
    name: "revision_list",
    component: () =>
      import(
        /* webpackChunkName: "revision_list" */ "@/views/blog/admin/revision_list.vue"
      )
  },
  {
    path: "/blog/:category?",
    name: "article_list",
    component: () =>
      import(
        /* webpackChunkName: "article_list" */ "@/views/blog/article_list.vue"
      )
  },
  {
    path: "/blog/:category/:id",
    name: "show_article",
    component: () =>
      import(
        /* webpackChunkName: "show_article" */ "@/views/blog/show_article.vue"
      )
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
