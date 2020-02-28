<template>
  <div class="box">
    <h1>{{ title }}</h1>
    <b-button @click="load">
      reload
      <fetch-status-icon :status="fetch_status" small />
    </b-button>
    <section id="form">
      Category
      <p>
        <code>news</code>, <code>general</code>, <code>workTeam</code>,
        <code>exh</code>, <code>contrib</code> のうちどれか
      </p>
      <b-input
        v-model="category"
        @input="get_category_articles"
        :state="category != ''"
      />
      <output>this category has {{ category_article_count }} articles</output>
      <table class="table">
        <thead>
          <tr>
            <th></th>
            <th>title</th>
            <th>author</th>
            <th>created</th>
            <th>status</th>
            <th>operations</th>
            <th>preview</th>
          </tr>
        </thead>
        <tbody>
          <b-tr
            v-for="(revision, id) in revisions"
            :key="id"
            :variant="
              revision.status == 'accepted'
                ? 'success'
                : revision.status == 'rejected'
                ? 'secondary'
                : ''
            "
          >
            <th>
              <b-form-radio
                v-model.number="revision_selection"
                name="revision-selector"
                :disabled="revision.status != 'accepted'"
                :value="id"
                >{{ id }}</b-form-radio
              >
            </th>
            <td>{{ revision.title }}</td>
            <td>{{ revision.user_id }}</td>
            <td>{{ revision.timestamp }}</td>
            <td>{{ revision.status }}</td>
            <td>
              <b-button
                @click="accept_revision(id)"
                v-if="revision.status == 'waiting'"
                >Accept</b-button
              >
              <b-button
                @click="reject_revision(id)"
                v-if="revision.status == 'waiting'"
                >Reject</b-button
              >
            </td>
            <td>
              <b-link :to="{ name: 'revision_preview', params: { id: id } }">
                preview
              </b-link>
            </td>
          </b-tr>
        </tbody>
      </table>
    </section>
    <section>
      <h2>差分</h2>
      <div id="diff-view" v-html="diff_from_original"></div>
    </section>
    <b-button @click="apply_changes" variant="primary" :disabled="!can_apply">
      apply
      <fetch-status-icon :status="post_status" small />
    </b-button>
    <b-button
      v-b-modal="'delete-confirm-modal'"
      variant="danger"
      :disabled="!article_exists"
    >
      delete
      <fetch-status-icon :status="delete_status" small />
    </b-button>
    <b-modal id="delete-confirm-modal" @ok="delete_article">
      <p>削除してもよろしいですか?</p>
    </b-modal>
  </div>
</template>

<style lang="scss">
@import "~diff2html/bundles/css/diff2html.min.css";
#diff-view {
  .d2h-file-list-wrapper {
    display: none;
  }
  .d2h-wrapper {
    .d2h-file-header {
      display: none;
    }
    td {
      padding: 0;
    }
  }
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import api from "@/apis/$api";
import aspida from "@aspida/axios";
import AdminAuth from "@/libs/auth/admin_auth";
import { BlogRevision } from "@/apis/blog/revisions/@types";
import { BlogArticle } from "@/apis/blog/articles/@types";
import is_axios_error from "@/libs/is_axios_error";
import FetchStatus from "@/libs/fetch_status";
import FetchStatusIcon from "@/components/FetchStatusIcon.vue";
import DiffLib from "difflib";
import * as Diff2Html from "diff2html";

@Component({ components: { FetchStatusIcon } })
export default class ManagePath extends Vue {
  title = "ブログ 管理画面 記事管理";
  revisions: { [key: number]: BlogRevision } = {};
  client = aspida();

  revision_selection = 0;
  original_selection = 0;
  category = "";
  category_article_count = -1;

  fetch_status: FetchStatus = "idle";
  post_status: FetchStatus = "idle";
  delete_status: FetchStatus = "idle";

  article_exists = false;

  mounted() {
    this.load();
  }

  load() {
    this.fetch_status = "pending";
    this.article_exists = false;
    this.revision_selection = 0;
    this.original_selection = 0;
    AdminAuth.attempt_get_JWT()
      .then(token => {
        Promise.all([
          api(this.client)
            .blog.articles._id(this.$route.params.id)
            .$get()
            .then((data: BlogArticle) => {
              this.category = data.category;
              this.original_selection = data.revision_id;
              this.revision_selection = data.revision_id;
              this.article_exists = true;
            })
            .then(this.get_category_articles)
            .catch((e: unknown) => {
              if (is_axios_error(e) && e.response && e.response.status == 404) {
                // article may not to exist
                return;
              }
              throw e;
            }),
          api(this.client)
            .blog.revisions.$get({
              query: {
                article_id: this.$route.params.id
              },
              headers: {
                "X-ADMIN-TOKEN": token.content
              }
            })
            .then((data: BlogRevision[]) => {
              for (const revision of data) {
                this.$set(this.revisions, revision.id, revision);
              }
            })
        ])
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
  }

  accept_revision(id: number) {
    AdminAuth.attempt_get_JWT().then(token => {
      api(this.client)
        .blog.revisions._id(id)
        .accept.$patch({
          headers: {
            "X-ADMIN-TOKEN": token.content
          }
        })
        .then((data: BlogRevision) => {
          this.$set(this.revisions, id, data);
        });
    });
  }

  reject_revision(id: number) {
    AdminAuth.attempt_get_JWT().then(token => {
      api(this.client)
        .blog.revisions._id(id)
        .reject.$patch({
          headers: {
            "X-ADMIN-TOKEN": token.content
          }
        })
        .then((data: BlogRevision) => {
          this.$set(this.revisions, id, data);
        });
    });
  }

  get_category_articles() {
    api(this.client)
      .blog.articles.$get({ query: { category: this.category } })
      .then((data: BlogArticle[]) => {
        this.category_article_count = data.length;
      });
  }

  apply_changes() {
    this.post_status = "pending";
    AdminAuth.attempt_get_JWT()
      .then(token => {
        return api(this.client)
          .blog.articles._id(this.$route.params.id)
          .$patch({
            data: {
              category: this.category,
              revision_id: this.revision_selection
            },
            headers: {
              "X-ADMIN-TOKEN": token.content
            }
          });
      })
      .then(() => {
        this.post_status = "idle";
        this.load();
      })
      .catch(() => {
        this.post_status = "fail";
      });
  }

  get can_apply() {
    return this.category != "" && this.revision_selection in this.revisions;
  }

  delete_article() {
    this.delete_status = "pending";
    AdminAuth.attempt_get_JWT()
      .then(token => {
        return api(this.client)
          .blog.articles._id(this.$route.params.id)
          .delete({
            headers: { "X-ADMIN-TOKEN": token.content }
          });
      })
      .then(() => {
        this.delete_status = "idle";
        this.load();
      })
      .catch(() => {
        this.delete_status = "fail";
      });
  }

  get diff_from_original() {
    const original_content =
      this.original_selection in this.revisions
        ? this.revisions[this.original_selection].content.split("\n")
        : [];
    const current_content =
      this.revision_selection in this.revisions
        ? this.revisions[this.revision_selection].content.split("\n")
        : [];

    const diff = DiffLib.unifiedDiff(original_content, current_content, {
      fromfile: "Original",
      tofile: "Current",
      lineterm: ""
    }).join("\n");

    return Diff2Html.html(diff, {
      drawFileList: true,
      matching: "lines",
      outputFormat: "side-by-side"
    });
  }
}
</script>
