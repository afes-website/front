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
            <b-td>{{ get_formatted_exh_name(exh_info) }}</b-td>
          </b-tr>
          <b-tr>
            <b-th>投稿者</b-th>
            <b-td>{{ get_formatted_author_name(author_info) }}</b-td>
          </b-tr>
          <b-tr>
            <b-th>投稿日時</b-th>
            <b-td>{{ get_formatted_time(created_at) }}</b-td>
          </b-tr>
          <b-tr :variant="get_status_variant(status)">
            <b-th>Review Status</b-th>
            <b-td>
              <font-awesome-icon
                :icon="get_status_icon(status)"
                class="fa-fw"
              />
              {{ get_status_message(status) }}
            </b-td>
          </b-tr>
          <b-tr :variant="get_status_variant(review_status)">
            <b-th>文実 Review Status</b-th>
            <b-td>
              <font-awesome-icon
                :icon="get_status_icon(review_status)"
                class="fa-fw"
              />
              {{ get_status_message(review_status) }}
            </b-td>
          </b-tr>
          <b-tr :variant="get_status_variant(teacher_review_status)">
            <b-th>教員 Review Status</b-th>
            <b-td>
              <font-awesome-icon
                :icon="get_status_icon(teacher_review_status)"
                class="fa-fw"
              />
              {{ get_status_message(teacher_review_status) }}
            </b-td>
          </b-tr>
        </b-tbody>
      </b-table-simple>
      <b-button
        :to="{ name: 'admin_draft_post', query: { draft_id: id } }"
        variant="secondary"
      >
        <font-awesome-icon icon="edit" class="fa-fw" />
        Edit and Post New Draft
      </b-button>
    </section>
    <section v-if="admin_logged_in">
      <h2>Review</h2>
      <p class="mb-2">
        Preview ボタンで確認後、Accept / Reject ボタンでレビューしてください。
      </p>
      <b-button-group>
        <b-button
          :to="{
            name: 'admin_draft_preview',
            params: { id: id },
          }"
          variant="primary"
        >
          <font-awesome-icon :icon="['far', 'file']" class="fa-fw" />
          Preview
        </b-button>
        <b-button @click="accept_draft()" variant="success">
          <font-awesome-icon icon="check-circle" class="fa-fw" />
          Accept
        </b-button>
        <b-button @click="reject_draft()" variant="danger">
          <font-awesome-icon icon="times-circle" class="fa-fw" />
          Reject
        </b-button>
      </b-button-group>
    </section>
    <section>
      <h2>コメント</h2>
      <CommentList v-model="draft" :draft-id="id" />
    </section>
    <section>
      <h2>差分</h2>
      <p>現在の展示コンテンツとの差分です。</p>
      <div class="diff-view" v-html="diff_from_latest" />
    </section>
    <section>
      <h2>Raw Markdown</h2>
      <b-form-textarea :value="content" readonly rows="20" max-rows="20" />
    </section>
  </forbidden>
</template>

<style lang="scss">
/* ==== !! be careful - NOT scoped !! ==== */

@import "~diff2html/bundles/css/diff2html.min.css";

.diff-view {
  .d2h-file-list-wrapper {
    display: none;
  }

  .d2h-wrapper {
    .d2h-file-header {
      display: none;
    }

    td {
      padding: 0;
      position: unset;
    }
  }
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import auth_eventhub from "@/libs/auth/auth_eventhub";
import Breadcrumb from "@/components/Breadcrumb.vue";
import Forbidden from "@/components/Forbidden.vue";
import CommentList from "@/components/CommentList.vue";
import api, {
  Draft,
  DraftComment,
  Exhibition,
  ExhibitionSummary,
  ReviewStatus,
  UserInfo,
} from "@afes-website/docs";
import aspida from "@aspida/axios";
import { getStringTime } from "@/libs/string_date";
import DiffLib from "difflib";
import * as Diff2Html from "diff2html";

@Component({
  components: {
    Breadcrumb,
    Forbidden,
    CommentList,
  },
})
export default class DraftManage extends Vue {
  page_title = "展示リクエスト管理";
  forbidden = false;
  draft: Draft | null = null;
  exhibition: Exhibition | null = null;

  admin_logged_in = false;

  mounted() {
    this.load();
    auth_eventhub.onUpdateAuth(this.load);
  }

  load() {
    this.admin_logged_in = false;
    this.$auth
      .attempt_get_JWT(["blogAdmin", "teacher"])
      .then((token) => {
        this.forbidden = false;
        this.fetchData(token);
        this.admin_logged_in = true;
      })
      .catch(() => {
        this.$auth
          .attempt_get_JWT("exhibition")
          .then((token) => {
            this.forbidden = false;
            this.fetchData(token);
          })
          .catch(() => {
            this.forbidden = true;
          });
      });
  }

  fetchData(token: string) {
    api(aspida())
      .online.drafts._id(Number(this.$route.params.id))
      .$get({
        headers: { Authorization: "bearer " + token },
      })
      .then((draft) => {
        this.draft = draft;

        api(aspida())
          .online.exhibition._id(this.draft.exhibition.id)
          .$get()
          .then((exh) => {
            this.exhibition = exh;
          });
      });
  }

  accept_draft() {
    this.$auth.attempt_get_JWT("blogAdmin").then((token) => {
      api(aspida())
        .online.drafts._id(Number(this.$route.params.id))
        .accept.$patch({
          headers: {
            Authorization: "bearer " + token,
          },
        })
        .then((res) => {
          this.draft = res;
        });
    });
  }

  reject_draft() {
    this.$auth.attempt_get_JWT("blogAdmin").then((token) => {
      api(aspida())
        .online.drafts._id(Number(this.$route.params.id))
        .reject.$patch({
          headers: {
            Authorization: "bearer " + token,
          },
        })
        .then((res) => {
          this.draft = res;
        });
    });
  }

  /* ==== Draft getter ==== */

  get id() {
    return this.draft?.id || "";
  }

  get content() {
    return this.draft?.content || "";
  }

  get exh_info(): ExhibitionSummary | null {
    return this.draft?.exhibition || null;
  }

  get author_info(): UserInfo | null {
    return this.draft?.author || null;
  }

  get status() {
    return this.draft?.status;
  }

  get review_status() {
    return this.draft?.review_status;
  }

  get teacher_review_status() {
    return this.draft?.teacher_review_status;
  }

  get is_archived() {
    return !!this.draft?.deleted;
  }

  get created_at() {
    return this.draft?.created_at;
  }

  get comments(): DraftComment[] {
    return this.draft?.comments || [];
  }

  get diff_from_latest(): string {
    if (!this.exhibition || !this.draft) return "";
    const diff = DiffLib.unifiedDiff(
      this.exhibition.content.split("\n"), // old
      this.draft.content.split("\n"), // new
      {
        fromfile: "Original",
        tofile: "Current",
        lineterm: "",
      }
    ).join("\n");
    return Diff2Html.html(diff, {
      drawFileList: true,
      matching: "lines",
      outputFormat: "side-by-side",
    });
  }

  /* ==== formatter ==== */

  get_formatted_exh_name(exh: ExhibitionSummary | null) {
    if (exh) return `${exh.name} @${exh.id}`;
    return "";
  }

  get_formatted_author_name(author: UserInfo | null) {
    if (author) return `${author.name} @${author.id}`;
    return "";
  }

  get_formatted_time(timestamp: string | undefined) {
    return timestamp ? getStringTime(timestamp) : "-";
  }

  /* ==== status ==== */

  get_status_icon(status: ReviewStatus) {
    switch (status) {
      case "accepted":
        return "check-circle";
      case "rejected":
        return "times-circle";
      case "waiting":
        return "hourglass-half";
    }
  }

  get_status_message(status: ReviewStatus) {
    switch (status) {
      case "accepted":
        return "Accepted";
      case "rejected":
        return "Rejected";
      case "waiting":
        return "Waiting";
    }
  }

  get_status_variant(status: "waiting" | "accepted" | "rejected") {
    switch (status) {
      case "accepted":
        return "success";
      case "rejected":
        return "secondary";
      case "waiting":
        return "warning";
    }
  }
}
</script>
