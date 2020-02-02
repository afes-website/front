<template>
  <div id="app">
    <div class="header">
      <div class="top">
        <div class="hamburger" @click="toggle_sidebar">
          🍔
        </div>
        <h2>73rd afes</h2>
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
            <li class="li-expand">
              ▼
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
      <div class="bottom">
        <div class="icons">
          <!-- TODO:icons
          <img src="" />
          <img src="" />
          <img src="" />
          -->
        </div>
        <p><small>&copy;第73回文化祭実行委員会 2020</small></p>
      </div>
    </div>
    <div class="main-wrapper">
      <main>
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<style lang="scss">
html,
body,
#app {
  height: 100vh;
  margin: 0;
}

#app {
  display: flex;
}

.header {
  width: 15%;
  min-width: 20rem;
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
    .hamburger {
      display: none;
    }
    .menu {
      pointer-events: auto;
      background: $site-theme;
      color: #fff;

      box-shadow: 0 0 1em rgba(0, 0, 0, 0.3);

      text-align: left;
      padding: 2rem;
      //border: 1px solid #eee;
      border-radius: 1rem;
      & > ul {
        padding-left: 0;
      }
      a {
        color: inherit;
      }
    }
  }

  .bottom {
    .icons {
      display: flex;

      img {
        margin-right: 1rem;
        margin-bottom: 1rem;

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
    display: block;
  }
  .header {
    display: block;
    padding: 0;
    height: auto;
    position: fixed;
    top: 0;
  }
  .top {
    width: 100vw;
    border-bottom: 1px solid $site-theme;
    background-color: #fff;
    display: flex;
    padding: 0.5rem;
    .hamburger {
      display: block;
      z-index: 1501;
      padding: 5px;
    }
    h2 {
      margin-bottom: 0;
      line-height: 1;
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
    padding-top: 3rem !important;
    position: fixed;
    width: 80%;
    max-width: 300px;
    left: -80%;
    height: 100vh;
    border-radius: 0 !important;
    overflow-y: auto;
    top: 0;
    &.shown {
      left: 0;
    }
  }
  .bottom {
    position: fixed;
    z-index: 0;
    bottom: 0;
    width: 100vw;
    border-top: 1px solid $site-theme;
    background-color: #fff;
    padding: 0.5rem;
    .icons {
      justify-content: center;
      img {
        width: 1.4rem;
        height: 1.4rem;
        margin: 0.7rem;
        margin-left: 0;
      }
    }
    p {
      text-align: center;
      margin: 0;
    }
  }
  .main-wrapper {
    margin-top: 5rem;
    margin-bottom: 5rem;
    overflow-y: visible;
    height: auto;
  }
  main {
    margin-right: unset;
    min-width: unset;
  }
}
</style>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";
import JQuery from "jquery";
import sidebar from "@/components/sidebar.vue";

@Component
export default class Layout extends Vue {
  sidebar_shown: Boolean = false;

  hide() {
    this.sidebar_shown = false;
  }

  toggle_sidebar() {
    this.sidebar_shown = !this.sidebar_shown;
  }
}
</script>
