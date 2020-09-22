<template>
  <forbidden :is-forbidden="forbidden" class="box wide-box">
    <breadcrumb :text="page_title" />
    <h1>{{ page_title }}</h1>
    <b-button @click="load">
      Reload
      <fetch-status-icon :status="fetch_status" small />
    </b-button>
    <b-table-simple responsive hover class="table">
      <b-thead>
        <b-tr>
          <b-th>id</b-th>
          <b-th>stat</b-th>
          <b-th>title</b-th>
          <b-th>path</b-th>
          <b-th>time</b-th>
          <b-th>show</b-th>
        </b-tr>
      </b-thead>
      <b-tbody>
        <b-tr
          v-for="revision in sorted_revisions"
          :key="get_revision_id(revision)"
          :variant="get_status_color(revision)"
          @click="open_revision(revision)"
        >
          <b-th>{{ get_revision_id(revision) }}</b-th>
          <b-td>
            <font-awesome-icon
              :icon="get_status_icon(revision)"
              :id="format_status_icon_id(revision)"
              class="fa-fw"
            />
            <b-tooltip
              :target="format_status_icon_id(revision)"
              triggers="hover"
            >
              {{ get_revision_status(revision) }}
            </b-tooltip>
          </b-td>
          <b-td>{{ get_revision_title(revision) }}</b-td>
          <b-td>{{ get_article_id(revision) }}</b-td>
          <b-td class="td-time">{{ get_revision_timestamp(revision) }}</b-td>
          <b-td>
            <b-link
              v-if="is_used_for_article(revision)"
              :to="{
                name: 'show_article',
                params: {
                  category: get_article_category(revision),
                  id: get_article_id(revision),
                },
              }"
            >
              <font-awesome-icon :icon="'file'" class="fa-fw" />
              published
            </b-link>
            <b-link
              v-else
              :to="{
                name: 'revision_preview',
                params: { id: get_revision_id(revision) },
              }"
            >
              <font-awesome-icon :icon="['far', 'file']" class="fa-fw" />
              preview
            </b-link>
          </b-td>
        </b-tr>
      </b-tbody>
    </b-table-simple>
  </forbidden>
</template>

<style lang="scss" scoped>
.btn {
  margin-bottom: 0.5rem;
}

.table {
  white-space: nowrap;

  td,
  th {
    vertical-align: middle;
  }
}

.td-time {
  white-space: pre-wrap;
}

.td-icon {
  text-align: center;
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import api from "@afes-website/docs";
import aspida from "@aspida/axios";
import { BlogRevision } from "@afes-website/docs";
import { BlogArticle } from "@afes-website/docs";
import is_axios_error from "@/libs/is_axios_error";
import FetchStatus from "@/libs/fetch_status";
import FetchStatusIcon from "@/components/FetchStatusIcon.vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import { getStringTime } from "@/libs/string_date";
import Forbidden from "@/components/Forbidden.vue";
import auth_eventhub from "@/libs/auth_eventhub";

interface BlogRevisionWithArticle extends BlogRevision {
  article: BlogArticle | null;
}

@Component({ components: { FetchStatusIcon, Breadcrumb, Forbidden } })
export default class RevisionList extends Vue {
  readonly page_title = "あなたの記事リクエスト一覧";
  revisions: BlogRevisionWithArticle[] = [];
  client = aspida();

  fetch_status: FetchStatus = "idle";
  forbidden = false;

  mounted() {
    this.load();
    auth_eventhub.onUpdateAuth(this.load);
  }

  load() {
    this.forbidden = false;
    if (this.fetch_status == "pending") return;
    this.fetch_status = "pending";
    this.revisions = [];
    this.$auth
      .attempt_get_JWT("blogWriter")
      .then((token) => {
        api(this.client)
          .blog.revisions.$get({
            headers: {
              Authorization: "bearer " + token,
            },
          })
          .then((data: BlogRevision[]) => {
            const promises: Promise<void>[] = [];
            for (const revision of data) {
              promises.push(
                api(this.client)
                  .blog.articles._id(revision.article_id)
                  .$get()
                  .then((article: BlogArticle) => {
                    this.revisions.push({
                      ...revision,
                      article: article,
                    });
                  })
                  .catch((e: unknown) => {
                    if (
                      is_axios_error(e) &&
                      e.response &&
                      e.response.status == 404
                    ) {
                      this.revisions.push({
                        ...revision,
                        article: null,
                      });
                      return;
                    }
                    throw e;
                  })
              );
            }
            Promise.all(promises)
              .then(() => {
                this.fetch_status = "idle";
              })
              .catch(() => {
                this.fetch_status = "fail";
              });
          })
          .catch(() => {
            this.fetch_status = "fail";
          });
      })
      .catch(() => {
        this.forbidden = true;
        this.fetch_status = "fail";
      });
  }

  get sorted_revisions() {
    let ret_revisions = this.revisions.concat(); // copy
    ret_revisions = ret_revisions.sort((a, b) => {
      return a.id - b.id;
    });
    return ret_revisions;
  }

  open_revision(revision: BlogRevisionWithArticle) {
    if (
      revision.article !== null &&
      revision.article.revision_id == revision.id
    )
      this.$router.push({
        name: "show_article",
        params: {
          category: revision.article.category,
          id: revision.article_id,
        },
      });
    else
      this.$router.push({
        name: "revision_preview",
        params: { id: revision.id.toString() },
      });
  }

  get_revision_id(revision: BlogRevisionWithArticle) {
    return revision.id;
  }

  get_revision_status(revision: BlogRevisionWithArticle) {
    return revision.status;
  }

  get_revision_title(revision: BlogRevisionWithArticle) {
    return revision.title;
  }

  get_revision_timestamp(revision: BlogRevisionWithArticle) {
    return getStringTime(revision.timestamp);
  }

  get_status_color(revision: BlogRevisionWithArticle) {
    switch (revision.status) {
      case "accepted":
        return "success";
      case "rejected":
        return "secondary";
      default:
        return "";
    }
  }

  get_status_icon(revision: BlogRevisionWithArticle) {
    switch (revision.status) {
      case "accepted":
        return "check-circle";
      case "rejected":
        return "times-circle";
      case "waiting":
        return "hourglass-half";
    }
  }

  format_status_icon_id(revision: BlogRevisionWithArticle) {
    return revision.id + "-status-icon";
  }

  is_used_for_article(revision: BlogRevisionWithArticle) {
    return (
      revision.article !== null && revision.article.revision_id == revision.id
    );
  }

  get_article_category(revision: BlogRevisionWithArticle) {
    if (revision.article === null) return null;
    return revision.article.category;
  }

  get_article_id(revision: BlogRevisionWithArticle) {
    return revision.article_id;
  }
}
</script>
