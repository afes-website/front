<template>
  <div class="box wide-box">
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
          :key="revision.id"
          :variant="
            revision.status == 'accepted'
              ? 'success'
              : revision.status == 'rejected'
              ? 'secondary'
              : ''
          "
          @click="open_revision(revision)"
        >
          <b-th>{{ revision.id }}</b-th>
          <b-td>
            <font-awesome-icon
              :icon="
                revision.status === 'accepted'
                  ? 'check-circle'
                  : revision.status === 'rejected'
                  ? 'times-circle'
                  : 'hourglass-half'
              "
              :id="[revision.id + '-status-icon']"
              class="fa-fw"
            />
            <b-tooltip :target="revision.id + '-status-icon'" triggers="hover">
              {{ revision.status }}
            </b-tooltip>
          </b-td>
          <b-td>{{ revision.title }}</b-td>
          <b-td>{{ revision.article_id }}</b-td>
          <b-td class="td-time">{{ getStringTime(revision.timestamp) }}</b-td>
          <b-td>
            <b-link
              v-if="
                revision.article !== null &&
                revision.article.revision_id == revision.id
              "
              :to="{
                name: 'show_article',
                params: {
                  category: revision.article.category,
                  id: revision.article_id,
                },
              }"
            >
              <font-awesome-icon :icon="'file'" class="fa-fw" />
              published
            </b-link>
            <b-link
              v-else
              :to="{ name: 'revision_preview', params: { id: revision.id } }"
            >
              <font-awesome-icon :icon="['far', 'file']" class="fa-fw" />
              preview
            </b-link>
          </b-td>
        </b-tr>
      </b-tbody>
    </b-table-simple>
  </div>
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
import api from "@/apis/$api";
import aspida from "@aspida/axios";
import WriterAuth from "@/libs/auth/writer_auth";
import { BlogRevision } from "@/apis/blog/revisions/@types";
import { BlogArticle } from "@/apis/blog/articles/@types";
import is_axios_error from "@/libs/is_axios_error";
import FetchStatus from "@/libs/fetch_status";
import FetchStatusIcon from "@/components/FetchStatusIcon.vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import { getStringTime } from "@/libs/string_date";

interface BlogRevisionWithArticle extends BlogRevision {
  article: BlogArticle | null;
}

@Component({ components: { FetchStatusIcon, Breadcrumb } })
export default class RevisionList extends Vue {
  readonly page_title = "あなたの記事リクエスト一覧";
  revisions: BlogRevisionWithArticle[] = [];
  client = aspida();
  readonly getStringTime = getStringTime;

  fetch_status: FetchStatus = "idle";

  mounted() {
    this.load();
  }

  load() {
    if (this.fetch_status == "pending") return;
    this.fetch_status = "pending";
    this.revisions = [];
    WriterAuth.attempt_get_JWT()
      .then((token) => {
        api(this.client)
          .blog.revisions.$get({
            headers: {
              "X-BLOG-WRITER-TOKEN": token.content,
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
}
</script>
