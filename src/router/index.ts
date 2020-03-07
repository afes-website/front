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
  },
  {
    path: "/blog/admin",
    name: "admin_top",
    component: () =>
      import(
        /* webpackChunkName: "admin_top" */ "@/views/blog/admin/admin_top.vue"
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
    path: "/blog/admin/revisions/:id(\\d+)",
    name: "revision_preview",
    component: () =>
      import(
        /* webpackChunkName: "revision_preview" */ "@/views/blog/admin/revision_preview.vue"
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
  },
  {
    // fallback
    path: "*",
    name: "not_found",
    component: () =>
      import(/* webpackChunkName: "not_found" */ "@/views/NotFound.vue")
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
