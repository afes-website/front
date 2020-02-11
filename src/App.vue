<template>
  <div id="app" v-touch:swipe.right="show" v-touch:swipe.left="hide">
    <div class="header">
      <div class="top">
        <font-awesome-icon
          icon="bars"
          size="2x"
          class="hamburger fa-fw"
          @click="toggle_sidebar"
        />
        <font-awesome-icon
          icon="times"
          size="2x"
          class="hamburger-closer fa-fw"
          :class="{ open: sidebar_shown }"
          @click="toggle_sidebar"
        />
        <h2>73rd afes</h2>
        <div class="icons">
          <img src="/img/Twitter_Logo_Blue.svg" />
          <img src="/img/instagram.png" />
          <img src="/img/azabu_icon.svg" />
        </div>
        <nav class="menu" :class="{ shown: sidebar_shown }">
          <ul>
            <li>
              <b-link to="about">ごあいさつ</b-link>
            </li>
            <li>
              <b-link to="access">アクセス</b-link>
            </li>
            <li>
              <b-link to="" disabled>展示一覧</b-link>
            </li>
            <li>
              <b-link to="" disabled>タイムテーブル</b-link>
            </li>
            <li>
              <b-link to="" disabled>校内マップ</b-link>
            </li>
            <li>
              <b-link to="" disabled>ブログ</b-link>
              <ul>
                <li><b-link to="" disabled>お知らせ</b-link></li>
                <li><b-link to="" disabled>活動の様子</b-link></li>
                <li><b-link to="" disabled>在校生向け</b-link></li>
              </ul>
            </li>
          </ul>
        </nav>
        <div
          class="menu-fade"
          :class="{ shown: sidebar_shown }"
          @click="hide"
        ></div>
      </div>
    </div>
    <div class="main-wrapper">
      <main>
        <router-view></router-view>
      </main>
      <footer>
        <address>&copy; 第73回文化祭実行委員会 2020</address>
        <b-link to="policy">プライバシーポリシー</b-link>
      </footer>
    </div>
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

.header {
  width: 16rem;
  padding: 2rem 0 0 2rem;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  .top {
    flex-grow: 1;
    .hamburger,
    .hamburger-closer {
      display: none;
    }
    .menu {
      pointer-events: auto;
      background: $site-theme;
      color: #fff;
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
        & > ul {
          padding-left: 2rem;
        }
      }
      a {
        color: inherit;
      }
    }
    .icons {
      img {
        margin: 8px 16px 16px 0;
        width: 32px;
        height: 32px;
      }
    }
  }
}

li {
  list-style-type: none;
  margin-bottom: 0.5rem;
}

a {
  color: inherit; // extend parent
}

.main-wrapper {
  flex-grow: 1;
  height: 100vh;
  overflow-y: auto;
  padding-top: 2rem;
  max-width: 500px;

  display: flex;
  flex-direction: column;

  main {
    flex-grow: 1;
  }
  footer {
    padding: 0 1rem 0 2rem;
    display: flex;
    justify-content: space-between;
    address {
      text-align: center;
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
  .header {
    display: block;
    padding: 0;
    height: auto;
    position: fixed;
    top: 0;
    .top {
      height: 4rem;
      width: 100vw;
      border-bottom: 1px solid $site-theme;
      background-color: #fff;
      display: flex;
      align-items: center;
      padding: 0.5rem;
      .hamburger {
        display: inline-block;
        color: $site-theme;
        margin: 0.7rem;
      }
      .hamburger-closer {
        display: block;
        color: #fff;
        transition: opacity 0.3s;
        z-index: 1501;
        opacity: 0;
        position: fixed;
        top: calc(0.5rem + 0.7rem);
        left: calc(0.5rem + 0.7rem);
        &.open {
          opacity: 1;
        }
      }
      h2 {
        margin-bottom: 0;
        line-height: 1;
      }
      .icons {
        display: flex;
        flex-grow: 1;
        justify-content: flex-end;
        align-items: center;
        margin: 0;
        padding: 0;
        img {
          margin-bottom: 8px;
        }
      }
      .menu {
        &,
        &-fade {
          transition: opacity, left 0.3s;
        }
        z-index: 1500;
        &-fade {
          z-index: 1499;
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
        //display: none;
        padding: 4rem 1.6rem !important;
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
        &.shown {
          left: 0;
          box-shadow: 0 0 1em rgba(0, 0, 0, 0.3);
        }
        a {
          text-decoration: none;
          &.disabled {
            opacity: 0.65;
          }
        }
      }
    }
  }
  .main-wrapper {
    margin-top: 4rem;
    padding-top: 0;
    overflow-y: visible;
    height: auto;
    max-width: unset;

    main {
      padding: 0 1rem;
    }

    footer {
      //z-index: 0;
      width: 100vw;
      border-top: 1px solid $site-theme;
      background-color: #fff;
      padding: 0.5rem;
      padding-top: 0;
      display: unset;
      text-align: center;

      address {
        margin: 0.25rem 0;
      }
    }
  }
}
</style>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";
import Vue2TouchEvents from "vue2-touch-events";
import JQuery from "jquery";
import sidebar from "@/components/sidebar.vue";

Vue.use(Vue2TouchEvents);

@Component
export default class Layout extends Vue {
  sidebar_shown: Boolean = false;

  show() {
    this.sidebar_shown = true;
  }

  hide() {
    this.sidebar_shown = false;
  }

  toggle_sidebar() {
    this.sidebar_shown = !this.sidebar_shown;
  }
}
</script>
