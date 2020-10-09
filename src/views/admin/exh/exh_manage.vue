<template>
  <forbidden :is-forbidden="forbidden" :title="page_title" class="box wide-box">
    <breadcrumb :text="page_title" />
    <h1>{{ page_title }}</h1>
    <section>
      <h2>情報</h2>
      <b-table-simple stacked="sm" small hover responsive="lg">
        <b-tbody>
          <b-tr>
            <b-th>ID</b-th>
            <b-td>{{ id }}</b-td>
          </b-tr>
          <b-tr>
            <b-th>展示名</b-th>
            <b-td>{{ name }}</b-td>
          </b-tr>
          <b-tr>
            <b-th>更新日時</b-th>
            <b-td>{{ get_formatted_time(updated_at) }}</b-td>
          </b-tr>
          <b-tr>
            <b-th>サムネイル画像 ID</b-th>
            <b-td>
              <code>{{ image_id }}</code>
            </b-td>
          </b-tr>
        </b-tbody>
      </b-table-simple>
      <b-button
        :to="{ name: 'admin_draft_post', query: { exh_id: id } }"
        variant="secondary"
      >
        <font-awesome-icon icon="edit" class="fa-fw" />
        Edit and Post New Draft
      </b-button>
    </section>
    <section>
      <h2>プレビュー</h2>
      <exhibition-card
        :title="name"
        :image-url="get_formatted_image_id(image_id)"
      />
    </section>
    <section>
      <h2>リクエスト一覧</h2>
      <DraftTable v-model="drafts" :exh_id="exh_id" />
    </section>
    <section>
      <h2>Raw Markdown</h2>
      <b-form-textarea :value="content" readonly rows="20" max-rows="20" />
    </section>
  </forbidden>
</template>

<style lang="scss" scoped>
.exh_thumbnail {
  width: 400px;
  max-width: 100%;
  border: 12px solid #999;
  margin: 0 auto 0 0;
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import auth_eventhub from "@/libs/auth/auth_eventhub";
import Breadcrumb from "@/components/Breadcrumb.vue";
import Forbidden from "@/components/Forbidden.vue";
import ExhibitionCard from "@/components/ExhibitionCard.vue";
import DraftTable from "@/components/DraftTable.vue";
import api, { Draft, Exhibition } from "@afes-website/docs";
import aspida from "@aspida/axios";
import { getStringTime } from "@/libs/string_date";

@Component({
  components: {
    Breadcrumb,
    Forbidden,
    ExhibitionCard,
    DraftTable,
  },
})
export default class ExhManage extends Vue {
  page_title = "展示管理";
  forbidden = false;
  exhibition: Exhibition | null = null;
  drafts: Draft[] = [];
  exh_id = "";

  mounted() {
    this.confirmPermission();
    auth_eventhub.onUpdateAuth(this.confirmPermission);
    this.$watch("$route", this.confirmPermission);
  }

  confirmPermission() {
    this.exh_id = this.$route.params.id;
    this.$auth
      .attempt_get_JWT(["teacher", "blogAdmin"])
      .then((token) => {
        // load as admin
        this.fetchData(token);
      })
      .catch(() => {
        this.$auth
          .attempt_get_JWT("exhibition")
          .then((token) => {
            if (
              this.exh_id === this.$auth.get_current_user_id &&
              this.$auth.get_current_user_id
            ) {
              // load as exhibition
              this.fetchData(token);
            } else {
              // push to top
              this.$router.push({
                name: "admin_top",
              });
            }
          })
          .catch(() => {
            this.forbidden = true;
          });
      });
  }

  fetchData(token: string) {
    this.forbidden = false;
    // TODO: 404, 500, etc...
    api(aspida())
      .online.exhibition._id(this.exh_id)
      .$get()
      .then((res) => {
        this.exhibition = res;
      });
    api(aspida())
      .online.drafts.$get({
        headers: { Authorization: "bearer " + token },
      })
      .then((res) => {
        // TODO: query 化 (docs 対応・back 実装)
        this.drafts.splice(
          0,
          this.drafts.length,
          ...res.filter((draft) => draft.exhibition.id === this.exh_id)
        );
      });
  }

  /* ==== Draft getter ==== */

  get id() {
    return this.exhibition?.id;
  }

  get name() {
    return this.exhibition?.name;
  }

  get content() {
    return this.exhibition?.content;
  }

  get updated_at() {
    return this.exhibition?.updated_at;
  }

  get image_id() {
    return this.exhibition?.thumbnail_image_id;
  }

  /* ==== formatter ==== */

  get_formatted_time(timestamp: string | undefined) {
    return timestamp ? getStringTime(timestamp) : "-";
  }

  get_formatted_image_id(image_id: string | undefined) {
    return image_id
      ? api(aspida())
          .images._id(image_id)
          .$path({ query: { w: 400, h: 400 } })
      : "";
  }
}
</script>
