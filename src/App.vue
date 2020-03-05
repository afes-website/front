<template>
  <div id="app" v-touch:swipe.right="show" v-touch:swipe.left="hide">
    <div id="background-image" />
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
          <img src="./assets/logo.png" alt="logo" />
        </b-link>
        <div id="menu" :class="{ shown: sidebar_shown }">
          <hr />
          <div id="menu-icons">
            <b-link
              target="_blank"
              title="Twitter"
              href="https://twitter.com/73_Afes"
            >
              <img src="@/assets/sns/twitter.svg" alt="Twitter Icon" />
            </b-link>
            <b-link
              target="_blank"
              title="Instagram"
              href="https://www.instagram.com/73_afes/"
            >
              <img src="@/assets/sns/instagram.png" alt="Instagram Icon" />
            </b-link>
            <b-link
              target="_blank"
              title="School Website"
              href="https://www.azabu-jh.ed.jp/"
            >
              <img src="@/assets/sns/azabu.svg" alt="School Icon" />
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
                <b-link disabled>展示一覧</b-link>
              </li>
              <li>
                <b-link disabled>タイムテーブル</b-link>
              </li>
              <li>
                <b-link disabled>校内マップ</b-link>
              </li>
              <li>
                <b-link :to="{ name: 'blog_top' }">近況</b-link>
                <ul class="menu-secondary">
                  <li
                    v-for="(cat_name, cat_id) of visible_categories"
                    :key="cat_id"
                  >
                    <b-link
                      :to="{
                        name: 'article_list',
                        params: { category: cat_id }
                      }"
                    >
                      {{ cat_name }}
                    </b-link>
                  </li>
                </ul>
              </li>
              <li>
                <b-link :to="{ name: 'admin_top' }">ブログ管理</b-link>
                <ul
                  class="menu-secondary"
                  v-if="this.$route.path.startsWith('/blog/admin')"
                >
                  <li>
                    <b-link :to="{ name: 'new_revision' }"
                      >新規リクエスト</b-link
                    >
                  </li>
                  <li>
                    <b-link :to="{ name: 'revision_list' }"
                      >リクエスト一覧</b-link
                    >
                  </li>
                  <li>
                    <b-link :to="{ name: 'path_list' }">記事一覧</b-link>
                  </li>
                </ul>
              </li>
              <li><b-link :to="{ name: 'document' }">文化祭資料</b-link></li>
            </ul>
          </nav>
        </div>
        <div
          id="menu-fade"
          :class="{ shown: sidebar_shown }"
          @click="hide"
        ></div>
      </div>
    </header>
    <div id="main-wrapper">
      <main>
        <router-view></router-view>
      </main>
      <footer class="box">
        <nav>
          <ul>
            <li>
              <b-link disabled>お問い合わせ</b-link>
            </li>
            <li>
              <b-link :to="{ name: 'policy' }">プライバシーポリシー</b-link>
            </li>
          </ul>
        </nav>
        <small>&copy; 第73回文化祭実行委員会 2020</small>
      </footer>
    </div>
    <admin-login-modal />
    <writer-login-modal />
  </div>
</template>

<style lang="scss" scoped>
html,
body,
#app {
  height: 100vh;
  margin: 0;
  display: flex;
}

#background-image {
  background-image: url("assets/back.jpg");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  filter: blur(2px);
  height: 120vh;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: -2;

  &::before {
    content: "";
    background-color: rgba(#fff, 0.7);
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: -1;
  }
}

header {
  width: 16rem;
  padding: 2rem 0 0 2rem;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  z-index: 1003;
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

        img {
          margin: 8px;
          width: 32px;
          height: 32px;
        }
      }

      #menu-nav {
        pointer-events: auto;
        background: $site-theme;
        color: #fff;
        font-weight: 500;
        font-size: 1.1rem;
        width: 14rem;

        box-shadow: 0 0 1em rgba(0, 0, 0, 0.3);

        text-align: left;
        padding: 1rem 2rem;
        //border: 1px solid #eee;
        border-radius: 1rem;

        & > ul {
          padding-left: 0;
          line-height: 2;
        }

        li {
          margin: 0;
          list-style-type: none;
          margin-bottom: 0.5rem;

          & > ul {
            padding-left: 2rem;
          }
        }

        .menu-secondary {
          margin-top: 0.5rem;
        }

        a {
          color: inherit;
          text-decoration: none;

          &.disabled {
            opacity: 0.65;
          }
        }
      }
    }
  }
}

#main-wrapper {
  flex-grow: 1;
  height: 100vh;
  overflow-y: auto;
  padding-top: 2rem;

  display: flex;
  flex-direction: column;

  main {
    flex-grow: 1;
    max-width: 900px;
    padding: 0 1rem 0 2rem;
  }
  footer {
    text-align: center;
    padding: 0;
    padding-bottom: 0.25rem;
    max-width: calc(900px - 3rem);
    margin: 1rem 1rem 1rem 2rem;

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

  header {
    display: block;
    padding: 0;
    height: auto;
    position: fixed;
    top: 0;
    #top {
      height: 4rem;
      width: 100vw;
      border-bottom: 1px solid $site-theme;
      background-color: #fff;
      display: flex;
      align-items: center;
      padding: 0.5rem;
      #hamburger {
        display: inline-block;
        position: absolute;
        top: 0.7rem;
        left: 1rem;
        color: $site-theme;
        height: 2.5rem;
      }
      #hamburger-closer {
        display: block;
        color: $site-theme;
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
          margin: 0;
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
          height: 100vh;
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
        }
        background-color: #fff;
        color: $site-theme;
        font-weight: 700;
        padding: calc(3.5rem - 1px) 1.6rem 0 1.6rem !important;
        font-size: 1.3rem;
        position: fixed;
        width: 60%;
        max-width: 300px;
        left: -60%;
        height: 100vh;
        border-radius: 0 !important;
        overflow-y: auto;
        top: 0;
        box-shadow: none;

        hr {
          display: block;
          position: relative;
          width: 60vw;
          left: -1.6rem;
          margin: 0.5rem 0;
          border: none;
          border-top: 1px solid #87acce;
        }
        ul > li {
          line-height: 1.5;
        }
        &.shown {
          left: 0;
          box-shadow: 0 0 1em rgba(0, 0, 0, 0.3);
        }
      }
    }
  }
  #main-wrapper {
    margin-top: 4rem;
    padding-top: 0;
    overflow-y: visible;
    height: auto;
    max-width: unset;

    main {
      padding: 0.8rem 1rem 0 1rem;
    }

    footer {
      //z-index: 0;
      width: 100vw;
      border-top: 1px solid $site-theme;
      border-radius: 0;
      margin: 0;

      small {
        display: inline-block;
        margin: 0.25rem 0;
        padding: 0;
      }
    }
  }
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Vue2TouchEvents from "vue2-touch-events";
import AdminLoginModal from "./components/AdminLoginModal.vue";
import WriterLoginModal from "./components/WriterLoginModal.vue";
import categories from "@/libs/categories";

Vue.use(Vue2TouchEvents);

@Component({ components: { AdminLoginModal, WriterLoginModal } })
export default class Layout extends Vue {
  sidebar_shown = false;

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
    for (const k in categories) {
      if (categories[k].visible) ret[k] = categories[k].name;
    }
    return ret;
  }
}
</script>
