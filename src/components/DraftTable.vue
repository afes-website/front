<template>
  <div class="draft-list-table">
    <b-tabs
      v-model="current_tab_number"
      fill
      justified
      active-nav-item-class="table-active-tab"
    >
      <b-tab>
        <template v-slot:title>
          <font-awesome-icon icon="list-ul" class="fa-fw" />
          All
        </template>
      </b-tab>
      <b-tab>
        <template v-slot:title>
          <font-awesome-icon icon="hourglass-half" class="fa-fw" />
          Waiting
        </template>
      </b-tab>
      <b-tab>
        <template v-slot:title>
          <font-awesome-icon icon="check-circle" class="fa-fw" />
          Accepted
        </template>
      </b-tab>
      <b-tab>
        <template v-slot:title>
          <font-awesome-icon icon="times-circle" class="fa-fw" />
          Rejected
        </template>
      </b-tab>
      <b-tab>
        <template v-slot:title>
          <font-awesome-icon icon="archive" class="fa-fw" />
          Archived
        </template>
      </b-tab>
    </b-tabs>
    <b-table
      show-empty
      small
      hover
      responsive="lg"
      :items="filteredDrafts"
      :fields="draftFields"
      :filter="draftFilter"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :busy="busy"
    >
      <template v-slot:cell(published_icon)="row">
        <template v-if="get_published(row)">
          <font-awesome-icon
            :icon="['far', 'eye']"
            :id="get_formatted_revision_icon_id(row, 'published-icon')"
          />
          <b-tooltip
            :target="get_formatted_revision_icon_id(row, 'published-icon')"
            triggers="hover"
          >
            公開中
          </b-tooltip>
        </template>
      </template>
      <template v-slot:cell(status)="row">
        <font-awesome-icon
          :icon="get_status_icon(get_status(row))"
          :id="get_formatted_revision_icon_id(row)"
          class="fa-fw"
        />
        <b-tooltip
          :target="get_formatted_revision_icon_id(row)"
          triggers="hover"
        >
          {{ get_status_message(get_status(row)) }}
        </b-tooltip>
      </template>
      <template v-slot:cell(review_status)="row">
        <font-awesome-icon
          :icon="get_status_icon(get_review_status(row))"
          :id="get_formatted_revision_icon_id(row, 'review')"
          class="fa-fw"
        />
        <b-tooltip
          :target="get_formatted_revision_icon_id(row, 'review')"
          triggers="hover"
        >
          {{ get_status_message(get_review_status(row)) }}
        </b-tooltip>
      </template>
      <template v-slot:cell(teacher_review_status)="row">
        <font-awesome-icon
          :icon="get_status_icon(get_teacher_review_status(row))"
          :id="get_formatted_revision_icon_id(row, 'teacher')"
          class="fa-fw"
        />
        <b-tooltip
          :target="get_formatted_revision_icon_id(row, 'teacher')"
          triggers="hover"
        >
          {{ get_status_message(get_teacher_review_status(row)) }}
        </b-tooltip>
      </template>
      <template v-slot:cell(comment_count)="row">
        <b-badge variant="primary">
          <font-awesome-icon icon="comment" class="fa-fw" />
          {{ get_comments_count(row) }}
        </b-badge>
      </template>
      <template v-slot:cell(archive_status)="row">
        <template v-if="get_deleted(row)">
          <font-awesome-icon
            icon="archive"
            class="fa-fw"
            :id="get_formatted_revision_icon_id(row, 'archive-status')"
          />
          <b-tooltip
            :target="get_formatted_revision_icon_id(row, 'archive-status')"
            triggers="hover"
          >
            Archived
          </b-tooltip>
        </template>
        <template v-else>
          <font-awesome-icon
            icon="inbox"
            class="fa-fw"
            :id="get_formatted_revision_icon_id(row, 'archive-status')"
          />
          <b-tooltip
            :target="get_formatted_revision_icon_id(row, 'archive-status')"
            triggers="hover"
          >
            Inbox
          </b-tooltip>
        </template>
      </template>
      <template v-slot:cell(review)="row">
        <b-button-group size="sm">
          <b-button
            @click="accept_draft(get_id(row))"
            variant="success"
            class="mb-0"
          >
            Accept
          </b-button>
          <b-button
            @click="reject_draft(get_id(row))"
            variant="danger"
            class="mb-0"
          >
            Reject
          </b-button>
        </b-button-group>
      </template>
      <template v-slot:cell(publish)="row">
        <b-button-group size="sm" v-if="get_draft_can_publish(row)">
          <b-button
            variant="theme-dark"
            @click="publish_draft(get_id(row))"
            class="mb-0"
          >
            <font-awesome-icon icon="upload" class="fa-fw" />
            Publish
          </b-button>
        </b-button-group>
      </template>
      <template v-slot:cell(manage)="row">
        <b-button-group size="sm">
          <b-button
            :to="{
              name: 'admin_draft_manage',
              params: { id: get_id(row) },
            }"
            variant="link"
          >
            <font-awesome-icon icon="wrench" class="fa-fw" />
            Manage
          </b-button>
          <b-button
            :to="{
              name: 'admin_draft_preview',
              params: { id: get_id(row) },
            }"
            variant="link"
          >
            <font-awesome-icon :icon="['far', 'file']" class="fa-fw" />
            Preview
          </b-button>
        </b-button-group>
      </template>
      <template v-slot:table-busy>
        <div class="text-center text-theme-dark my-2">
          <b-spinner class="align-middle mr-2"></b-spinner>
          <strong>Loading...</strong>
        </div>
      </template>
    </b-table>
  </div>
</template>

<style lang="scss">
.draft-list-table {
  .table-active-tab {
    background: $theme-dark !important;
    color: #fff !important;
    border-color: $theme-dark !important;
  }
}
</style>

<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator";
import api, {
  Draft,
  ExhibitionSummary,
  ReviewStatus,
  UserInfo,
} from "@afes-website/docs";
import aspida from "@aspida/axios";
import { getStringTime } from "@/libs/string_date";
import auth_eventhub from "@/libs/auth/auth_eventhub";
import { BvTableField } from "bootstrap-vue";

type DraftOnTable = {
  _rowVariant?: string;
} & Draft;

@Component
export default class DraftTable extends Vue {
  @Prop({ required: true, default: [] })
  readonly value?: Draft[];

  @Prop({ required: false, default: null })
  readonly exh_id?: string;

  @Prop({ required: false, default: false })
  readonly busy?: boolean;

  currentUser: UserInfo | null = null;
  draftFields: BvTableField[] = [];

  current_tab_number = 0;

  draftFilter = "";
  sortBy = "id";
  sortDesc = false;

  get generateDraftFields() {
    const fields = [];

    // 共通
    fields.push(
      { key: "published_icon", label: "" },
      { key: "id", label: "ID", sortable: true },
      { key: "status", label: "" },
      { key: "comment_count", label: "" },
      { key: "review_status", label: "文実" },
      { key: "teacher_review_status", label: "教員" },
      { key: "archive_status", label: "" },
      {
        key: "exhibition",
        label: "展示名",
        formatter: this.get_formatted_exh_name,
      },
      {
        key: "author",
        label: "投稿者",
        formatter: this.get_formatted_author_name,
      },
      {
        key: "created_at",
        label: "投稿日時",
        formatter: this.get_formatted_time,
        sortable: true,
      }
    );

    // review button
    if (
      this.currentUser?.permissions.blogAdmin ||
      this.currentUser?.permissions.teacher
    )
      fields.push({ key: "review", label: "Review" });

    // publish button
    if (this.currentUser?.permissions.blogAdmin)
      fields.push({ key: "publish", label: "Publish" });

    // manage & preview link
    fields.push({ key: "manage", label: "" });

    return fields;
  }

  mounted() {
    this.loadUserInfo();
    auth_eventhub.onUpdateAuth(this.loadUserInfo);
  }

  loadUserInfo() {
    this.currentUser = this.$auth.get_current_user;
    this.draftFields = this.generateDraftFields;
  }

  accept_draft(draft_id: number) {
    this.$auth.attempt_get_JWT(["blogAdmin", "teacher"]).then((token) => {
      api(aspida())
        .online.drafts._id(draft_id)
        .accept.$patch({
          headers: {
            Authorization: "bearer " + token,
          },
        })
        .then((res) => {
          this.$emit(
            "input",
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.value!.map((draft) => {
              if (draft.id === res.id) draft = res;
              return draft;
            })
          );
        });
    });
  }

  reject_draft(draft_id: number) {
    this.$auth.attempt_get_JWT(["blogAdmin", "teacher"]).then((token) => {
      api(aspida())
        .online.drafts._id(draft_id)
        .reject.$patch({
          headers: {
            Authorization: "bearer " + token,
          },
        })
        .then((res) => {
          this.$emit(
            "input",
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.value!.map((draft) => {
              if (draft.id === res.id) draft = res;
              return draft;
            })
          );
        });
    });
  }

  publish_draft(draft_id: number) {
    this.$auth.attempt_get_JWT("blogAdmin").then((token) => {
      api(aspida())
        .online.drafts._id(draft_id)
        .publish.$patch({ headers: { Authorization: "bearer " + token } })
        .then(() => {
          api(aspida())
            .online.drafts.$get({
              headers: { Authorization: "bearer " + token },
            })
            .then((res) => {
              // all drafts refresh
              this.$emit("input", res);
            });
        });
    });
  }

  get filteredDrafts(): DraftOnTable[] {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const draftsOnTable: DraftOnTable[] = this.value!.filter((draft) => {
      if (this.exh_id) draft.exhibition.id === this.exh_id;
      return true;
    }).map((draft) => {
      return { _rowVariant: this.get_status_variant(draft.status), ...draft };
    });

    switch (this.current_tab_number) {
      case 0:
        return draftsOnTable;
      case 1:
        return draftsOnTable.filter((draft) => draft.status === "waiting");
      case 2:
        return draftsOnTable.filter(
          (draft) => draft.status === "accepted" && !draft.deleted
        );
      case 3:
        return draftsOnTable.filter((draft) => draft.status === "rejected");
      case 4:
        return draftsOnTable.filter((draft) => draft.deleted);
      default:
        return draftsOnTable.filter((draft) => !draft.deleted);
    }
  }

  get canCurrentUserPublish(): boolean {
    if (this.$auth.get_current_user)
      return this.$auth.get_current_user.permissions.blogAdmin;
    else return false;
  }

  /* ==== Draft getter ==== */

  get_id(row: { item: Draft }) {
    return row.item.id;
  }

  get_exh_name(row: { item: Draft }) {
    return row.item.exhibition.name;
  }

  get_content(row: { item: Draft }) {
    return row.item.content;
  }

  get_status(row: { item: Draft }) {
    return row.item.status;
  }

  get_review_status(row: { item: Draft }) {
    return row.item.review_status;
  }

  get_teacher_review_status(row: { item: Draft }) {
    return row.item.teacher_review_status;
  }

  get_published(row: { item: Draft }) {
    return row.item.published && !row.item.deleted;
  }

  get_deleted(row: { item: Draft }) {
    return row.item.deleted;
  }

  get_comments_count(row: { item: Draft }) {
    return row.item.comments.length;
  }

  get_draft_status_is_accepted(row: { item: Draft }) {
    return row.item.status === "accepted";
  }

  get_draft_can_publish(row: { item: Draft }) {
    return (
      this.get_draft_status_is_accepted(row) &&
      this.canCurrentUserPublish &&
      !this.get_published(row)
    );
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
