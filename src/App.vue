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
              <a href="#">ごあいさつ</a>
            </li>
            <li>
              <a href="#">アクセス</a>
            </li>
            <li>
              <a href="#">展示一覧</a>
            </li>
            <li>
              <a href="#">タイムテーブル</a>
            </li>
            <li>
              <a href="#">校内マップ</a>
            </li>
            <li>
              <a href="#">ブログ</a>
              <ul>
                <li><a href="#">お知らせ</a></li>
                <li><a href="#">活動の様子</a></li>
                <li><a href="#">在校生向け</a></li>
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
      <div class="bottom">
        <p><small>&copy;第73回文化祭実行委員会 2020</small></p>
      </div>
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
  width: 20rem;
  padding: 2rem;
  padding-bottom: 0;
  margin-right: 2rem;
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

      box-shadow: 0 0 1em rgba(0, 0, 0, 0.3);

      text-align: left;
      padding: 2rem 2.5rem;
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
        margin: 0.5rem 1rem 1rem 0;
        width: 2rem;
        height: 2rem;
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

  display: flex;
  flex-direction: column;
  main {
    flex-grow: 1;
  }
}
main {
  margin-right: 15rem;
  min-width: 500px;
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
          // width: 1.5rem;
          // height: 1.5rem;
          min-width: 29px;
          min-height: 29px;
          margin: 0.7rem;
          margin-left: 0;
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
      }
    }
  }
  .main-wrapper {
    margin-top: 5rem;
    overflow-y: visible;
    height: auto;
    .bottom {
      //z-index: 0;
      width: 100vw;
      border-top: 1px solid $site-theme;
      background-color: #fff;
      padding: 0.5rem;
      padding-top: 0;
      p {
        text-align: center;
        margin: 0;
      }
    }
  }
  main {
    margin-right: unset;
    min-width: unset;
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
