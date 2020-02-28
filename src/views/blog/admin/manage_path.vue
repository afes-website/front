<template>
  <div class="box">
    <h1>{{ title }}</h1>
    <b-button @click="load">
      reload
      <fetch-status-icon :status="fetch_status" small />
    </b-button>
    <section id="form">
      Category
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
    <b-button @click="apply_changes" variant="primary" :disabled="!can_apply">
      apply
      <fetch-status-icon :status="post_status" small />
    </b-button>
  </div>
</template>

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

@Component({ components: { FetchStatusIcon } })
export default class ManagePath extends Vue {
  title = "ブログ 管理画面 記事管理";
  revisions: { [key: number]: BlogRevision } = {};
  client = aspida();

  revision_selection = 0;
  category = "";
  category_article_count = -1;

  fetch_status: FetchStatus = "idle";
  post_status: FetchStatus = "idle";

  mounted() {
    this.load();
  }

  load() {
    this.fetch_status = "pending";
    AdminAuth.attempt_get_JWT()
      .then(token => {
        Promise.all([
          api(this.client)
            .blog.articles._id(this.$route.params.id)
            .$get()
            .then((data: BlogArticle) => {
              this.category = data.category;
              this.revision_selection = data.revision_id;
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
      })
      .catch(() => {
        this.post_status = "fail";
      });
  }

  get can_apply() {
    return this.category != "" && this.revision_selection in this.revisions;
  }
}
</script>
