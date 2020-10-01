<template>
  <div class="draft-list-table">
    <b-tabs v-model="current_tab_number" fill justified>
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
    >
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
      <template v-slot:cell(show)="row">
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
    </b-table>
  </div>
</template>

<script lang="ts">
import { Vue, Watch, Prop, Component } from "vue-property-decorator";
import api, {
  Draft,
  ExhibitionSummary,
  ReviewStatus,
  UserInfo,
} from "@afes-website/docs";
import aspida from "@aspida/axios";
import { getStringTime } from "@/libs/string_date";

@Component
export default class DraftTable extends Vue {
  @Prop({ required: true, default: [] })
  readonly value?: Draft[];

  @Prop({ required: false, default: null })
  readonly exh_id?: string;

  current_tab_number = 0;

  readonly draftFields = [
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
    },
    { key: "review", label: "Review" },
    { key: "show", label: "" },
  ];
  draftFilter = "";
  sortBy = "id";
  sortDesc = false;

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
    this.$auth.attempt_get_JWT("blogAdmin").then((token) => {
      api(aspida())
        .online.exhibition.drafts._id(draft_id)
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

  @Watch("current_tab_number")
  tab_change() {
    switch (this.current_tab_number) {
      case 0:
        this.draftFilter = "";
        break;
      case 1:
        this.draftFilter = "waiting";
        break;
      case 2:
        this.draftFilter = "accepted";
        break;
      case 3:
        this.draftFilter = "rejected";
        break;
      case 4:
        this.draftFilter = "";
    }
  }

  get filteredDrafts(): Draft[] {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const drafts_filtered_by_exh_id = this.value!.filter((draft) => {
      if (this.exh_id) draft.exhibition.id === this.exh_id;
      return true;
    });
    switch (this.current_tab_number) {
      case 0:
        return drafts_filtered_by_exh_id;
      case 4:
        return drafts_filtered_by_exh_id.filter((draft) => draft.deleted);
      default:
        return drafts_filtered_by_exh_id.filter((draft) => !draft.deleted);
    }
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
    return row.item.published;
  }

  get_deleted(row: { item: Draft }) {
    return row.item.deleted;
  }

  get_comments_count(row: { item: Draft }) {
    return row.item.comments.length;
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
