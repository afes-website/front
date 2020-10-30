<template>
  <div id="app" v-touch:swipe.right="show" v-touch:swipe.left="hide">
    <div id="background-image" />
    <div id="left-wrapper">
      <header>
        <div id="top">
          <font-awesome-icon
            icon="bars"
            size="2x"
            id="hamburger"
            class="fa-fw"
            @click="toggle_sidebar"
          />
          <font-awesome-icon
            icon="times"
            size="2x"
            id="hamburger-closer"
            class="fa-fw"
            :class="{ open: sidebar_shown }"
            @click="toggle_sidebar"
          />
          <b-link id="brand" :to="{ name: 'Home' }">
            <img src="./assets/logo.svg" alt="logo" />
          </b-link>
          <div id="menu" :class="{ shown: sidebar_shown }">
            <hr />
            <div id="menu-icons">
              <b-link
                target="_blank"
                title="Twitter"
                href="https://twitter.com/73_Afes"
              >
                <font-awesome-icon :icon="['fab', 'twitter']" size="2x" />
              </b-link>
              <b-link
                target="_blank"
                title="Instagram"
                href="https://www.instagram.com/73_afes/"
                id="tooltip-target-instagram"
              >
                <object
                  :data="instagramIcon"
                  type="image/svg+xml"
                  width="32"
                  height="32"
                />
              </b-link>
              <b-tooltip
                target="tooltip-target-instagram"
                triggers="hover"
                placement="bottom"
              >
                &copy; Alexo88 2017
                <b-link
                  href="https://commons.wikimedia.org/wiki/File:Instagram.svg"
                  target="_blank"
                >
                  source
                </b-link>
              </b-tooltip>
              <b-link
                target="_blank"
                title="School Website"
                href="https://www.azabu-jh.ed.jp/"
              >
                <object
                  :data="azabuIcon"
                  type="image/svg+xml"
                  width="32"
                  height="32"
                />
              </b-link>
            </div>
            <hr />
            <nav id="menu-nav">
              <ul>
                <li>
                  <b-link :to="{ name: 'about' }">ごあいさつ</b-link>
                </li>
                <li>
                  <b-link :to="{ name: 'access' }">アクセス</b-link>
                </li>
                <li>
                  <b-link :to="{ name: 'exhibition_list' }">展示一覧</b-link>
                </li>
                <li>
                  <b-link disabled>タイムテーブル</b-link>
                </li>
                <li>
                  <b-link disabled>校内マップ</b-link>
                </li>
                <li>
                  <b-link :to="{ name: 'article_list' }">近況</b-link>
                  <ul class="menu-secondary">
                    <li
                      v-for="(cat_name, cat_id) of visible_categories"
                      :key="cat_id"
                    >
                      <b-link
                        :to="{
                          name: 'article_list',
                          params: { category: cat_id },
                        }"
                      >
                        {{ cat_name }}
                      </b-link>
                    </li>
                  </ul>
                </li>
                <li>
                  <b-link :to="{ name: 'admin_top' }">管理</b-link>
                  <ul class="menu-secondary" v-if="is_in_admin_route">
                    <template v-if="has_permission_blog_writer">
                      <li>
                        <b-link :to="{ name: 'new_revision' }"
                          >新規記事リクエスト</b-link
                        >
                      </li>
                      <li>
                        <b-link :to="{ name: 'revision_list' }"
                          >記事リクエスト一覧</b-link
                        >
                      </li>
                    </template>
                    <li v-if="has_permission_blog_admin">
                      <b-link :to="{ name: 'path_list' }">記事一覧</b-link>
                    </li>
                    <hr v-if="is_need_hr" />
                    <template v-if="has_permission_exhibition">
                      <li>
                        <b-link :to="{ name: 'admin_draft_post' }">
                          展示更新リクエスト
                        </b-link>
                      </li>
                      <li>
                        <b-link
                          :to="{
                            name: 'admin_exh_manage',
                            params: { id: exh_id },
                          }"
                        >
                          展示管理
                        </b-link>
                      </li>
                    </template>
                    <template v-if="has_permission_blog_admin_or_teacher">
                      <li>
                        <b-link :to="{ name: 'admin_draft_post' }">
                          展示更新リクエスト
                        </b-link>
                      </li>
                      <li>
                        <b-link :to="{ name: 'admin_exh_list' }"
                          >展示一覧</b-link
                        >
                      </li>
                      <li>
                        <b-link :to="{ name: 'admin_draft_list' }">
                          展示リクエスト一覧
                        </b-link>
                      </li>
                    </template>
                  </ul>
                </li>
                <li><b-link :to="{ name: 'document' }">文化祭資料</b-link></li>
              </ul>
            </nav>
            <UserMenu id="user-menu" />
          </div>
          <div
            id="menu-fade"
            :class="{ shown: sidebar_shown }"
            @click="hide"
          ></div>
        </div>
      </header>
    </div>
    <div id="main-wrapper" @scroll="resize">
      <div
        id="main-box"
        :class="{
          'main-box-wide': is_in_admin_route,
          'main-box-hide': is_top_page,
        }"
      >
        <main>
          <router-view
            v-if="!show_404"
            @not_found="set_not_found"
          ></router-view>
          <not-found v-else></not-found>
        </main>
        <hr />
        <footer>
          <nav>
            <ul>
              <li>
                <b-link :to="{ name: 'contact' }">お問い合わせ</b-link>
              </li>
              <li>
                <b-link :to="{ name: 'policy' }">プライバシーポリシー</b-link>
              </li>
            </ul>
          </nav>
          <small>&copy; 第73回麻布学園文化祭実行委員会 2020</small>
        </footer>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#app {
  margin: 0;
  display: flex;
}

#background-image {
  background-image: url("assets/back.jpg");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 120vh;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: -2;

  &::before {
    content: "";
    background-color: rgba(#fff, 0.1);
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: -1;
  }
}

#left-wrapper {
  height: var(--vh);
  overflow-y: auto;
  padding: 1.5rem 3rem 0 3rem;
  position: fixed;
  z-index: 1003;

  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  header {
    width: 13rem;
    min-width: 13rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;

    #top {
      flex-grow: 1;

      #hamburger,
      #hamburger-closer {
        display: none;
      }

      #brand {
        img {
          margin-left: -1rem;
          width: calc(100% + 30px);
          filter: drop-shadow(2px 2px 1px #fff) drop-shadow(-2px 2px 1px #fff)
            drop-shadow(2px -2px 1px #fff) drop-shadow(-2px -2px 1px #fff);
        }
      }

      #menu {
        hr {
          display: none;
        }

        #menu-icons {
          display: flex;
          flex-direction: row;
          justify-content: space-around;
          margin-bottom: 8px;
          filter: drop-shadow(2px 2px 1px #fff) drop-shadow(-2px 2px 1px #fff)
            drop-shadow(2px -2px 1px #fff) drop-shadow(-2px -2px 1px #fff);

          a {
            display: block;
            margin: 8px;
            height: min-content;
            width: min-content;
          }

          svg {
            width: 32px;
            height: 32px;
          }

          object {
            pointer-events: none;
          }

          .fa-twitter {
            color: #1da1f2;
          }
        }

        #menu-nav {
          pointer-events: auto;
          background: $theme-dark;
          color: #fff;
          font-weight: 500;
          font-size: 1.1rem;
          width: 100%;

          box-shadow: 0 0 1em rgba(0, 0, 0, 0.3);

          text-align: left;
          padding: 1rem 0;
          //border: 1px solid #eee;
          border-radius: 0.5rem;

          hr {
            display: block;
            border-bottom: 1px solid #fff;
            margin: 0.25rem 0;
          }

          & > ul {
            padding-left: 0;
            margin: 0;

            li {
              margin: 0;
              list-style-type: none;
              width: 100%;

              a {
                display: block;
                padding: 0.25rem 1.5rem;
                width: 100%;

                &:hover {
                  background: darken($theme-dark, 6%);
                }
              }

              & > ul {
                padding: 0;
                font-size: 1rem;

                hr {
                  margin-left: 2.5rem;
                  width: calc(100% - 2.5rem - 1rem);
                }

                & > li > a {
                  padding: 0.25rem 0;
                  padding-left: 2.5rem;
                }
              }
            }
          }

          a {
            color: inherit;
            text-decoration: none;

            &.disabled {
              opacity: 0.65;
            }
          }
        }

        #user-menu {
          margin: 16px 0;
          box-shadow: 0 0 1em rgba(0, 0, 0, 0.3);
        }
      }
    }
  }
}

#main-wrapper {
  flex-grow: 1;
  padding: 0;
  margin-left: 19rem;
  z-index: 0;

  #main-box {
    max-width: 1000px;
    padding: 1rem 1.5rem;
    margin: 0 auto 0 0;
    background: rgba(#fff, 0.9);
    min-height: var(--vh);
    height: max-content;

    display: flex;
    flex-direction: column;

    &.main-box-wide {
      max-width: unset;
      width: 100%;
      background: rgba(#fafafa, 0.9);
      @media screen and (max-width: 900px) {
        width: 100%;
      }
    }
    &.main-box-hide {
      max-width: unset;
      width: 100%;
      background: none;
      padding: 0;
      @media screen and (max-width: 900px) {
        width: 100%;
      }
      hr,
      footer {
        display: none;
      }
    }

    main {
      flex-grow: 1;
    }
    hr {
      width: calc(100% + 3rem);
      margin-left: -1.5rem;
    }
    footer {
      text-align: center;

      & > nav > ul {
        margin: 0.25rem 0;
        padding: 0;
        li {
          list-style-type: none;
          display: inline;

          &:not(:last-of-type)::after {
            content: " ･ ";
          }
        }
      }
      small {
        font-size: 1rem;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
@media screen and (max-width: 900px) {
  // smartphone
  #app {
    height: auto;
    display: block;
  }

  #background-image {
    display: none;
  }

  #left-wrapper {
    height: auto;
    padding: 0;
    position: static; // remove position sticky

    header {
      display: block;
      height: auto;
      position: fixed; // bug
      top: 0;
      z-index: 1003;

      #top {
        height: 4rem;
        width: 100vw;
        border-bottom: 1px solid $theme-dark;
        background-color: #fff;
        display: flex;
        align-items: center;
        padding: 0.5rem;

        #hamburger {
          display: inline-block;
          position: absolute;
          top: 0.7rem;
          left: 1rem;
          color: $theme-dark;
          height: 2.5rem;
        }

        #hamburger-closer {
          display: block;
          color: $theme-dark;
          transition: opacity 0.3s;
          z-index: 1002;
          opacity: 0;
          position: absolute;
          top: 0.7rem;
          left: 1rem;
          height: 2.5rem;

          &.open {
            opacity: 1;
          }
        }

        #brand {
          display: block;
          text-align: center;
          width: 100%;

          img {
            margin: 0 auto;
            margin-top: 5px;
            height: 64px;
            width: auto;
          }
        }

        #menu {
          &,
          &-fade {
            transition: opacity, left 0.3s;
          }

          z-index: 1001;

          &-fade {
            z-index: 1000;
            position: fixed;
            left: 0;
            top: 0;
            height: var(--vh);
            width: 100vw;
            background-color: #000;
            opacity: 0;
            pointer-events: none;

            &.shown {
              pointer-events: auto;
              opacity: 0.3;
            }
          }

          #menu-icons {
            margin: 0;
            padding: 0;

            img {
              margin-bottom: 8px;
            }
          }

          #menu-nav {
            background-color: inherit;
            color: inherit;
            font-weight: inherit;
            font-size: inherit;
            width: unset;
            margin: 0;
            padding: 0;
            box-shadow: none;

            ul li {
              a {
                line-height: 1.5;
                padding: 0.25rem 0;

                &:hover {
                  background: unset;
                }
              }

              ul li a {
                font-size: 1.3rem;
                padding-left: 1em;
              }
            }
          }

          background-color: #fff;
          color: $theme-dark;
          font-weight: 700;
          padding: calc(3.5rem - 1px) 1.6rem 0 1.6rem;
          font-size: 1.3rem;
          position: fixed;
          width: 70%;
          max-width: 300px;
          left: -70%;
          height: var(--vh);
          border-radius: 0;
          overflow-y: auto;
          top: 0;
          box-shadow: none;

          hr {
            display: block;
            position: relative;
            width: 70vw;
            left: -1.6rem;
            margin: 0.5rem 0;
            border: none;
            border-top: 1px solid #87acce;
          }

          &.shown {
            left: 0;
            box-shadow: 0 0 1em rgba(0, 0, 0, 0.3);
          }
        }
      }
    }
  }
  #main-wrapper {
    margin: 0;

    #main-box {
      margin: 4rem 0 0 0;
      overflow-y: visible;
      height: auto;
      max-width: unset;
      padding: 0;

      main {
        padding: 0.8rem 1rem 1rem 1rem;
      }

      hr {
        display: none;
      }

      footer {
        //z-index: 0;
        width: 100vw;
        max-width: unset;
        border-top: 1px solid $theme-dark;
        border-radius: 0;
        padding: 0 0 0.25rem 0;

        small {
          display: inline-block;
          margin: 0.25rem 0;
          padding: 0;
        }
      }
    }
  }
}
</style>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import Vue2TouchEvents from "vue2-touch-events";
import { Categories } from "@afes-website/docs";
import getCategories from "@/libs/categories";
import NotFound from "@/views/NotFound.vue";
import UserMenu from "@/components/UserMenu.vue";
import auth_eventhub from "@/libs/auth/auth_eventhub";
import { StorageUserInfo } from "@/libs/auth/auth";

Vue.use(Vue2TouchEvents);

@Component({
  components: { NotFound, UserMenu },
})
export default class Layout extends Vue {
  sidebar_shown = false;
  show_404 = false;
  categories: Categories = {};
  exh_id = "";

  currentUser: StorageUserInfo | null = null;

  get has_permission_blog_admin(): boolean {
    return !!this.currentUser?.permissions.blogAdmin;
  }
  get has_permission_blog_writer(): boolean {
    return !!this.currentUser?.permissions.blogWriter;
  }
  get has_permission_exhibition(): boolean {
    return !!this.currentUser?.permissions.exhibition;
  }
  get has_permission_teacher(): boolean {
    return !!this.currentUser?.permissions.teacher;
  }
  get has_permission_blog_admin_or_teacher(): boolean {
    return this.has_permission_blog_admin || this.has_permission_teacher;
  }

  readonly instagramIcon = require("@/assets/sns/instagram.svg");
  readonly azabuIcon = require("@/assets/sns/azabu.svg");

  created() {
    auth_eventhub.onUpdateAuth(this.reload_login_status);
  }
  mounted() {
    this.resize();
    window.addEventListener("resize", this.resize);

    this.reload_login_status();
    getCategories().then((data) => {
      this.categories = data;
    });
  }
  destroyed() {
    window.removeEventListener("resize", this.resize);
  }

  @Watch("$route")
  route_changed() {
    this.sidebar_shown = false;
    this.show_404 = false;

    if (this.is_need_auth && !this.$auth.get_current_user_id)
      this.$router.push({ name: "login" });
  }

  resize() {
    const height = window.innerHeight;
    document.documentElement.style.setProperty("--vh", `${height}px`);
  }

  show() {
    this.sidebar_shown = true;
  }

  hide() {
    this.sidebar_shown = false;
  }

  toggle_sidebar() {
    this.sidebar_shown = !this.sidebar_shown;
  }

  get visible_categories() {
    const ret: { [key: string]: string } = {};
    for (const k in this.categories) {
      if (this.categories[k].visible) ret[k] = this.categories[k].name;
    }
    return ret;
  }

  reload_login_status() {
    this.currentUser = this.$auth.get_current_user;

    this.exh_id = this.has_permission_exhibition
      ? this.$auth.get_current_user?.id || ""
      : "";
  }

  get is_need_hr() {
    return (
      ((this.has_permission_blog_writer || this.has_permission_blog_admin) &&
        this.has_permission_exhibition) ||
      this.has_permission_blog_admin
    );
  }

  get is_in_admin_route() {
    return this.$route.path.startsWith("/admin");
  }

  get is_need_auth() {
    return (
      this.$route.path.startsWith("/blog/admin") &&
      !this.$route.path.startsWith("/blog/admin/login")
    );
  }

  get is_top_page() {
    return this.$route.path === "/";
  }

  set_not_found() {
    this.show_404 = true;
  }
}
</script>
