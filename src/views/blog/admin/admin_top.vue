<template>
  <div id="admin-top" class="box">
    <h1>{{ title }}</h1>
    <div id="profile">
      <font-awesome-icon
        :icon="isAdmin ? 'user-shield' : 'user-edit'"
        class="fa-fw"
      />
      <span class="name">{{ this.name }}</span>
      <span class="id">@{{ this.id }}</span>
    </div>
    <section>
      <h2>新規リクエスト</h2>
      <p>投稿の新規リクエストはこちらから。</p>
      <b-button :to="{ name: 'new_revision' }" variant="outline-site-theme"
        >新規リクエスト</b-button
      >
    </section>
    <section>
      <h2>投稿リクエスト一覧</h2>
      <p>自分がリクエストした投稿一覧はこっち。</p>
      <b-button :to="{ name: 'revision_list' }" variant="outline-site-theme"
        >リクエスト一覧</b-button
      >
    </section>
    <section v-if="isAdmin">
      <h2>記事一覧･管理</h2>
      <p>Writerからの投稿リクエストの承認･却下や、記事削除はここ。</p>
      <b-button :to="{ name: 'path_list' }" variant="outline-site-theme"
        >リクエスト一覧</b-button
      >
    </section>
  </div>
</template>

<style lang="scss" scoped>
#admin-top {
  #profile {
    text-align: right;

    span {
      margin-left: 0.5rem;
    }
  }
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import api from "@/apis/$api";
import aspida from "@aspida/axios";
import WriterAuth from "@/libs/auth/writer_auth";
import { WriterUserInfo } from "@/apis/writer/user.ts";

@Component
export default class AdminTop extends Vue {
  title = "ブログ管理ページ";
  name = "";
  id = "";
  isAdmin = false;

  beforeMount() {
    WriterAuth.attempt_get_JWT().then(token => {
      api(aspida())
        .writer.user.$get({
          headers: {
            "X-BLOG-WRITER-TOKEN": token.content
          }
        })
        .then((data: WriterUserInfo) => {
          this.id = data.id;
          this.name = data.name;
        });
    });
  }
}
</script>
