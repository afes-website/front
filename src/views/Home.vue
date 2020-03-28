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
        <b-table-simple small hover>
          <b-tbody>
            <b-tr
              v-for="article in sorted_articles.slice(0, 10)"
              :key="article.id"
              @click="linkToArticle(article.category, article.id)"
            >
              <b-td class="mobile-none">
                <font-awesome-icon :icon="'clock'" class="fa-fw" />
                {{ getStringTime(article.updated_at) }}
              </b-td>
              <b-td class="table-nowrap">
                <font-awesome-icon :icon="'folder'" class="fa-fw" />
                {{ getCategory(article.category) }}
              </b-td>
              <b-td class="mobile-none">
                <font-awesome-icon :icon="'user'" class="fa-fw" />
                {{ article.author.name }}
              </b-td>
              <b-td>
                {{ article.title }}
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
        max-width: 1000px;

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
    #footer {
      text-align: center;
      background: rgba($site-theme, 0.6);
      border-top: 2px solid rgba(#bdf, 0.6);
      padding: 0.5rem 0 1rem 0;

      * {
        color: #fff;
      }
      a {
        color: #def;
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
      border-top: 1px solid $site-theme;
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
import { Component, Vue, Watch } from "vue-property-decorator";
import api from "@/apis/$api";
import aspida from "@aspida/axios";
import { BlogArticle } from "@/apis/blog/articles/@types";
import { categories, getCategory } from "@/libs/categories";
import TopPageButton from "@/components/TopPageButton.vue";

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
  readonly getCategory = getCategory;

  mounted() {
    this.load();
  }
  @Watch("$route")
  route_changed() {
    this.load();
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
                !(article.category in categories) ||
                categories[article.category].visible
              )
                v.push(article);
              return v;
            },
            []
          );
        }
      });
  }

  getStringTime(laravel_time: string): string {
    const date = new Date(Date.parse(laravel_time));
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return year + "/" + month + "/" + day;
  }

  get sorted_articles(): BlogArticle[] {
    let ret_articles = this.articles.concat(); // copy
    ret_articles = ret_articles.sort((a, b) => {
      return a.updated_at < b.updated_at ? 1 : -1; // compare in string
    });
    return ret_articles;
  }

  linkToArticle(category: string, id: string) {
    this.$router.push({
      name: "show_article",
      params: { category: category, id: id },
    });
  }
}
</script>
