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
    </section>
    <section>
      <h2>Review</h2>
      <p>
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
      <h2>差分</h2>
      <p>現在の展示コンテンツとの差分です。</p>
      <!-- // TODO: diff  -->
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
import api, {
  Draft,
  ExhibitionSummary,
  ReviewStatus,
  UserInfo,
} from "@afes-website/docs";
import aspida from "@aspida/axios";
import { getStringTime } from "@/libs/string_date";

@Component({
  components: {
    Breadcrumb,
    Forbidden,
  },
})
export default class DraftManage extends Vue {
  page_title = "展示リクエスト管理";
  forbidden = false;
  draft: Draft | null = null;

  mounted() {
    this.load();
    auth_eventhub.onUpdateAuth(this.load);
  }

  load() {
    this.$auth
      .attempt_get_JWT(["blogAdmin", "teacher"])
      .then((token) => {
        this.forbidden = false;
        api(aspida())
          .online.exhibition.drafts._id(Number(this.$route.params.id))
          .$get({
            headers: { Authorization: "bearer " + token },
          })
          .then((res) => {
            this.draft = res;
          });
      })
      .catch(() => {
        this.forbidden = true;
      });
  }

  accept_draft() {
    this.$auth.attempt_get_JWT("blogAdmin").then((token) => {
      api(aspida())
        .online.exhibition.drafts._id(Number(this.$route.params.id))
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
        .online.exhibition.drafts._id(Number(this.$route.params.id))
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
    return this.draft?.id;
  }

  get content() {
    return this.draft?.content;
  }

  get exh_info() {
    return this.draft?.exhibition;
  }

  get author_info() {
    return this.draft?.author;
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

  /* ==== formatter ==== */

  get_formatted_exh_name(exh: ExhibitionSummary) {
    return `${exh.name} @${exh.id}`;
  }

  get_formatted_author_name(author: UserInfo) {
    return `${author.name} @${author.id}`;
  }

  get_formatted_time(timestamp: string | undefined) {
    return timestamp ? getStringTime(timestamp) : "-";
  }

  get_formatted_revision_icon_id(row: { item: Draft }, prefix = "") {
    return row.item.id + (prefix ? `-${prefix}` : "") + "-status-icon";
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