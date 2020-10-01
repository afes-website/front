<template>
  <forbidden :is-forbidden="forbidden" class="box wide-box">
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
        </b-tbody>
      </b-table-simple>
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

<style lang="scss"></style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import auth_eventhub from "@/libs/auth/auth_eventhub";
import Breadcrumb from "@/components/Breadcrumb.vue";
import Forbidden from "@/components/Forbidden.vue";
import DraftTable from "@/components/DraftTable.vue";
import api, { Draft, Exhibition } from "@afes-website/docs";
import aspida from "@aspida/axios";
import { getStringTime } from "@/libs/string_date";

@Component({
  components: {
    Breadcrumb,
    Forbidden,
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
    this.load();
    auth_eventhub.onUpdateAuth(this.load);
  }

  async load() {
    this.exh_id = this.$route.params.id;
    this.$auth
      .attempt_get_JWT(["blogAdmin", "teacher", "exhibition"])
      .then((token) => {
        this.forbidden = false;
        api(aspida())
          .online.exhibition._id(this.exh_id)
          .$get()
          .then((res) => {
            this.exhibition = res;
          });
        api(aspida())
          .online.exhibition.drafts.$get({
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
      })
      .catch(() => {
        this.forbidden = true;
      });
  }

  accept_draft(draft_id: number) {
    this.$auth.attempt_get_JWT("blogAdmin").then((token) => {
      api(aspida())
        .online.exhibition.drafts._id(draft_id)
        .accept.$patch({
          headers: {
            Authorization: "bearer " + token,
          },
        })
        .then((res) => {
          this.drafts.splice(
            0,
            this.drafts.length,
            ...this.drafts.map((draft) => {
              if (draft.id === res.id) return res;
              return draft;
            })
          );
        });
    });
  }

  reject_draft(draft_id: number) {
    this.$auth.attempt_get_JWT("blogAdmin").then((token) => {
      api(aspida())
        .online.exhibition.drafts._id(draft_id)
        .reject.$patch({
          headers: {
            Authorization: "bearer " + token,
          },
        })
        .then((res) => {
          this.drafts.splice(
            0,
            this.drafts.length,
            ...this.drafts.map((draft) => {
              if (draft.id === res.id) return res;
              return draft;
            })
          );
        });
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

  /* ==== formatter ==== */

  get_formatted_time(timestamp: string | undefined) {
    return timestamp ? getStringTime(timestamp) : "-";
  }
}
</script>
