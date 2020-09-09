<template>
  <div id="home">
    <div id="pc">
      <div id="first-view">
        <div>
          <b-alert
            show
            variant="danger"
            class="top-page-alert mt-3"
            style="line-height: 1.7; font-size: 0.95rem"
          >
            新型コロナウイルス感染症の流行を考慮し、開催を<b>２学期以降への無期限延期</b>といたします。<br />
            最終的な決定は、文実内、或いは全校によって行う予定です。
            <b-link to="/blog/news/re-reschedule" class="alert-link">
              詳細はこちら
            </b-link>
          </b-alert>
        </div>
        <div id="center-box">
          <img id="logo" src="../assets/logo_white.svg" alt="logo" />
        </div>
        <b-link v-scroll-to="'#main-content'">
          <font-awesome-icon id="down-angle" icon="chevron-down" size="3x" />
        </b-link>
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
          2020年6月12日から14日での開催を予定していましたが、新型コロナウイルス感染症（COVID-19）の流行状況により、２学期以降への無期限延期となりました。
          最終的な決定は、文実内、或いは全校によって行います。(場合によっては教員による決定となる可能性もあります）<br />
          <b-link to="/blog/news/re-reschedule"> 詳細はこちら </b-link>
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
        <b-table-simple small hover>
          <b-tbody>
            <b-tr
              v-for="article in shown_articles"
              :key="get_article_id(article)"
              @click="linkToArticle(article)"
            >
              <b-td class="mobile-none">
                <font-awesome-icon :icon="'clock'" class="fa-fw" />
                {{ formatUpdatedDate(article) }}
              </b-td>
              <b-td class="table-nowrap">
                <font-awesome-icon :icon="'folder'" class="fa-fw" />
                {{ getCategoryName(article) }}
              </b-td>
              <b-td class="mobile-none">
                <font-awesome-icon :icon="'user'" class="fa-fw" />
                {{ getAuthorName(article) }}
              </b-td>
              <b-td>
                {{ getArticleTitle(article) }}
              </b-td>
            </b-tr>
          </b-tbody>
        </b-table-simple>
        <font-awesome-icon icon="angle-right" class="fa-fw" />
        <b-link :to="{ name: 'article_list' }">近況 記事一覧</b-link>
      </div>
    </div>
    <div id="footer">
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

          background: rgba($theme-dark, 0.8);

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
          color: #beffff;
          filter: drop-shadow(0 4px 3px rgba(#222, 0.6));
        }
      }
    }

    #smartphone {
      display: none;
    }

    #main-box {
      background: rgba($theme-dark, 0.8);
      width: 100%;
      display: flex;
      justify-content: center;

      #main-content {
        padding: 2rem 1.5rem 1rem 1.5rem;
        max-width: 1000px;

        * {
          color: #fff;
        }
        h1,
        h2 {
          border-color: darken($theme-light, 10%);
        }
        a {
          color: $theme-light;
          text-decoration: underline;
        }
        tr {
          cursor: pointer;
        }
      }
    }
    #footer {
      text-align: center;
      background: rgba($theme-dark, 0.8);
      border-top: 2px solid rgba(#bdf, 0.8);
      padding: 0.5rem 0 1rem 0;

      * {
        color: #fff;
      }
      a {
        color: $theme-light;
        text-decoration: underline;
      }
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
        padding-bottom: 1rem;

        table {
          .table-nowrap {
            white-space: nowrap;
          }
          .mobile-none {
            display: none;
          }
        }
      }
    }
    #footer {
      text-align: center;
      border-top: 1px solid $theme-dark;
      padding: 0.5rem 0 1rem 0;
      width: 100vw;
      margin-left: calc((100vw - 100%) / 2 * -1);
      margin-bottom: -2rem;

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

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import api from "@/apis/$api";
import aspida from "@aspida/axios";
import { BlogArticle } from "@/apis/blog/articles/@types";
import { Categories } from "@/apis/blog/categories/@types";
import getCategories from "@/libs/categories";
import TopPageButton from "@/components/TopPageButton.vue";
import { getStringDate } from "@/libs/string_date";

import VueScrollTo from "vue-scrollto";
Vue.use(VueScrollTo, {
  container: "#main-wrapper",
});

@Component({
  components: {
    TopPageButton,
  },
})
export default class Home extends Vue {
  readonly page_title = "";
  articles: BlogArticle[] = [];
  client = aspida();
  categories: Categories = {};

  mounted() {
    getCategories()
      .then((data) => {
        this.categories = data;
      })
      .then(() => {
        this.load();
      });
  }
  load() {
    api(this.client)
      .blog.articles.$get()
      .then((data) => {
        this.articles = data;
        if (!this.$route.params.category) {
          this.articles = this.articles.reduce(
            (v: BlogArticle[], article: BlogArticle) => {
              if (
                !(article.category in this.categories) ||
                this.categories[article.category].visible
              )
                v.push(article);
              return v;
            },
            []
          );
        }
      });
  }

  get shown_articles(): BlogArticle[] {
    let ret_articles = this.articles.concat(); // copy
    ret_articles = ret_articles.sort((a, b) => {
      return a.updated_at < b.updated_at ? 1 : -1; // compare in string
    });
    return ret_articles.slice(0, 10);
  }

  linkToArticle(article: BlogArticle) {
    this.$router.push({
      name: "show_article",
      params: { category: article.category, id: article.id },
    });
  }

  get_article_id(article: BlogArticle) {
    return article.id;
  }

  formatUpdatedDate(article: BlogArticle) {
    return getStringDate(article.updated_at);
  }

  getCategoryName(article: BlogArticle) {
    return this.categories[article.category].name;
  }

  getAuthorName(article: BlogArticle) {
    return article.handle_name || article.author.name;
  }

  getArticleTitle(article: BlogArticle) {
    return article.title;
  }
}
</script>
