<template>
  <div class="box">
    <h1>{{ title }}</h1>
    <b-button @click="load">reload</b-button>
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
          </b-tr>
        </tbody>
      </table>
    </section>
    <section id="content_preview">
      <h2>記事のプレビュー</h2>
      <pre
        v-if="revision_selection in revisions"
        id="preview_pre"
        class="border rounded"
      ><code>{{revisions[revision_selection].content}}</code></pre>
    </section>
    <b-button @click="apply_changes" variant="primary" :disabled="!can_apply"
      >apply</b-button
    >
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import api from "@/apis/$api";
import aspida from "@aspida/axios";
import AdminAuth from "@/libs/auth/admin_auth";
import { BlogRevision } from "@/apis/blog/revisions/@types";
import { BlogArticle } from "@/apis/blog/articles/@types";

@Component
export default class ManagePath extends Vue {
  title = "ブログ 管理画面 記事管理";
  revisions: { [key: number]: BlogRevision } = {};
  client = aspida();

  revision_selection = 0;
  category = "";
  category_article_count = -1;

  mounted() {
    this.load();
  }

  load() {
    AdminAuth.attempt_get_JWT().then(token => {
      api(this.client)
        .blog.articles._id(this.$route.params.id)
        .$get()
        .then((data: BlogArticle) => {
          this.category = data.category;
          this.revision_selection = data.revision_id;
        })
        .then(this.get_category_articles);
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
        });
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
    AdminAuth.attempt_get_JWT().then(token => {
      api(this.client)
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
    });
  }

  get can_apply() {
    return this.category != "" && this.revision_selection in this.revisions;
  }
}
</script>
