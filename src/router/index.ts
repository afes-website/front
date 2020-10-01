import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import(/* webpackChunkName: "Home" */ "@/views/Home.vue"),
  },
  {
    path: "/about",
    name: "about",
    component: () =>
      import(/* webpackChunkName: "about" */ "@/views/about.vue"),
  },
  {
    path: "/access",
    name: "access",
    component: () =>
      import(/* webpackChunkName: "access" */ "@/views/access.vue"),
  },
  {
    path: "/contact",
    name: "contact",
    component: () =>
      import(/* webpackChunkName: "contact" */ "@/views/contact.vue"),
  },
  {
    path: "/policy",
    name: "policy",
    component: () =>
      import(/* webpackChunkName: "policy" */ "@/views/policy.vue"),
  },
  {
    path: "/document",
    name: "document",
    component: () =>
      import(/* webpackChunkName: "document" */ "@/views/document.vue"),
  },
  {
    path: "/blog/newContrib",
    name: "new_contrib",
    component: () =>
      import(
        /* webpackChunkName: "new_contrib" */ "@/views/blog/new_contrib.vue"
      ),
  },
  {
    path: "/admin",
    name: "admin_top",
    component: () =>
      import(/* webpackChunkName: "admin_top" */ "@/views/admin/admin_top.vue"),
  },
  {
    path: "/admin/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "login" */ "@/views/admin/login.vue"),
  },
  {
    path: "/admin/blog/post",
    name: "new_revision",
    component: () =>
      import(
        /* webpackChunkName: "new_revision" */ "@/views/admin/blog/new_revision.vue"
      ),
  },
  {
    path: "/admin/blog/paths",
    name: "path_list",
    component: () =>
      import(
        /* webpackChunkName: "path_list" */ "@/views/admin/blog/path_list.vue"
      ),
  },
  {
    path: "/admin/blog/paths/:id",
    name: "manage_path",
    component: () =>
      import(
        /* webpackChunkName: "manage_path" */ "@/views/admin/blog/manage_path.vue"
      ),
  },
  {
    path: "/admin/blog/revisions",
    name: "revision_list",
    component: () =>
      import(
        /* webpackChunkName: "revision_list" */ "@/views/admin/blog/revision_list.vue"
      ),
  },
  {
    path: "/admin/blog/revisions/:id(\\d+)",
    name: "revision_preview",
    component: () =>
      import(
        /* webpackChunkName: "revision_preview" */ "@/views/admin/blog/revision_preview.vue"
      ),
  },
  {
    path: "/admin/exh",
    name: "admin_exh_list",
    component: () =>
      import(
        /* webpackChunkName: "admin_exh_list" */ "@/views/admin/exh/exh_list.vue"
      ),
  },
  {
    path: "/admin/exh/:id",
    name: "admin_exh_manage",
    component: () =>
      import(
        /* webpackChunkName: "admin_exh_manage" */ "@/views/admin/exh/exh_manage.vue"
      ),
  },
  {
    path: "/admin/draft",
    name: "admin_draft_list",
    component: () =>
      import(
        /* webpackChunkName: "admin_draft_list" */ "@/views/admin/draft/draft_list.vue"
      ),
  },
  {
    path: "/admin/draft/:id(\\d+)",
    name: "admin_draft_manage",
    component: () =>
      import(
        /* webpackChunkName: "admin_draft_manage" */ "@/views/admin/draft/draft_manage.vue"
      ),
  },
  {
    path: "/admin/draft/:id(\\d+)/preview",
    name: "admin_draft_preview",
    component: () =>
      import(
        /* webpackChunkName: "admin_draft_preview" */ "@/views/admin/draft/draft_preview.vue"
      ),
  },
  {
    path: "/blog/:category?",
    name: "article_list",
    component: () =>
      import(
        /* webpackChunkName: "article_list" */ "@/views/blog/article_list.vue"
      ),
  },
  {
    path: "/blog/:category/:id",
    name: "show_article",
    component: () =>
      import(
        /* webpackChunkName: "show_article" */ "@/views/blog/show_article.vue"
      ),
  },
  {
    // fallback
    path: "*",
    name: "not_found",
    component: () =>
      import(/* webpackChunkName: "not_found" */ "@/views/NotFound.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) return { selector: to.hash };
    return { x: 0, y: 0 };
  },
  routes,
});

export default router;
