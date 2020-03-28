<template>
  <div id="home">
    <div id="pc">
      <div id="first-view">
        <div>
          <b-alert
            show
            variant="danger"
            class="top-page-alert mt-3"
            style="line-height: 1.7; font-size: 0.95rem;"
          >
            新型コロナウイルス感染症の流行を考慮し、開催を<b>2020年6月12-14日に延期</b>いたします。<br />
            なお、状況によりさらなる変更の可能性があります。予めご了承ください。
            <b-link to="/blog/news/covid-19-reschedule" class="alert-link">
              詳細はこちら
            </b-link>
          </b-alert>
        </div>
        <div id="center-box">
          <img id="logo" src="../assets/logo_white.svg" alt="logo" />
        </div>
        <font-awesome-icon id="down-angle" icon="chevron-down" size="3x" />
      </div>
    </div>
    <div id="smartphone">
      <img id="top-img" src="../assets/back.jpg" alt="img" />
      <div id="buttons">
        <top-page-button
          icon-name="map-marker-alt"
          button-name="アクセス"
          link-address="access"
        />
        <top-page-button
          icon-name="list"
          button-name="展示一覧"
          link-address="exhibition"
          disabled
        />
        <top-page-button
          icon-name="user-tie"
          button-name="ご挨拶"
          link-address="about"
        />
        <top-page-button
          icon-name="book"
          button-name="ブログ"
          link-address="article_list"
        />
      </div>
    </div>
    <div id="main-box">
      <div id="main-content">
        <h1>第73回 麻布中学校･高等学校 文化祭</h1>
        <p>第73回 麻布学園文化祭 公式ウェブサイトです。</p>
        <p>
          <time datetime="2020-06-12+09:00">2020年6月12日</time>
          から
          <time datetime="2020-06-14+09:00">14日</time>
          での開催を予定していますが、新型コロナウイルス感染症（COVID-19）の流行状況により、さらなる変更の可能性もあります。
          予めご了承ください。
        </p>
        <p>
          当日の展示に関する情報や、日々の活動の様子（近況）などを掲載しています。
        </p>
        <p>
          このウェブサイトは生徒自治団体である文化祭実行委員会が製作したものであり、教職員は関係していません。
          なにかございましたら
          <b-link :to="{ name: 'contact' }">お問い合わせフォーム</b-link>
          よりお問い合わせください。
        </p>
        <h2>更新情報</h2>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@media screen and (min-width: 900.1px) {
  #home {
    #pc {
      width: 100%;

      #first-view {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;

        height: 100vh;

        #center-box {
          display: flex;
          flex-direction: column;
          align-items: center;

          width: max-content;
          padding: 0.5rem;

          background: rgba($site-theme, 0.6);

          #logo {
            width: 600px;
            margin-top: 10px;
          }

          #date-warning {
            font-weight: 400;
            font-size: 0.9rem;
            margin: 0 1.5rem;
            color: #fff;
          }
        }

        #down-angle {
          margin-bottom: 1rem;
          color: #def;
        }
      }
    }

    #smartphone {
      display: none;
    }

    #main-box {
      background: rgba($site-theme, 0.6);
      width: 100%;
      display: flex;
      justify-content: center;

      #main-content {
        padding: 2rem 1.5rem 1rem 1.5rem;
        width: 1000px;

        * {
          color: #fff;
        }
        h1,
        h2 {
          border-color: #bdf;
        }
        a {
          color: #def;
          text-decoration: underline;
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
@media screen and (max-width: 900px) {
  #home {
    #pc {
      display: none;
    }

    #smartphone {
      display: unset;
      font-size: 1.1rem;

      #top-img {
        width: 100vw;
        margin-left: calc((100vw - 100%) / 2 * -1);
        margin-top: -12.8px;
      }
      #buttons {
        width: 100vw;
        margin-left: calc((100vw - 100%) / 2 * -1);
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 8px;
        .top-page-button {
          width: calc((100% - 1.5rem) / 2);
        }
      }
    }

    #main-box {
      #main-content {
        width: 100%;
      }
    }
  }
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TopPageButton from "@/components/TopPageButton.vue";
import ArticleList from "@/views/blog/article_list.vue";

@Component({
  components: {
    TopPageButton,
    ArticleList,
  },
})
export default class Home extends Vue {
  readonly page_title = "";
}
</script>
