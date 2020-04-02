<template>
  <div id="admin-top" class="box wide-box">
    <breadcrumb :text="page_title" />
    <h1>{{ page_title }}</h1>
    <section class="profile">
      <h3>管理者ユーザ</h3>
      <font-awesome-icon icon="user-shield" class="fa-fw" />
      <template v-if="this.admin_user !== null">
        <span class="name">{{ this.admin_user.name }}</span>
        <span class="id">@{{ this.admin_user.id }}</span>
        <b-button
          @click="admin_password_modal_shown = true"
          size="sm"
          variant="outline-info"
        >
          パスワード変更
        </b-button>
        <b-button @click="admin_logout" size="sm" variant="outline-danger">
          <font-awesome-icon :icon="'sign-out-alt'" class="fa-fw" />
          ログアウト
        </b-button>
      </template>
      <b-button v-else @click="admin_login" size="sm" variant="primary">
        <font-awesome-icon :icon="'sign-in-alt'" class="fa-fw" />
        ログイン
      </b-button>
    </section>
    <section class="profile">
      <h3>一般ユーザ</h3>
      <font-awesome-icon icon="user-edit" class="fa-fw" />
      <template v-if="this.writer_user !== null">
        <span class="name">{{ this.writer_user.name }}</span>
        <span class="id">@{{ this.writer_user.id }}</span>
        <b-button
          @click="writer_password_modal_shown = true"
          size="sm"
          variant="outline-info"
        >
          パスワード変更
        </b-button>
        <b-button @click="writer_logout" size="sm" variant="outline-danger">
          <font-awesome-icon :icon="'sign-out-alt'" class="fa-fw" />
          ログアウト
        </b-button>
      </template>
      <b-button v-else @click="writer_login" size="sm" variant="primary">
        <font-awesome-icon :icon="'sign-in-alt'" class="fa-fw" />
        ログイン
      </b-button>
    </section>
    <template v-if="writer_logged_in">
      <section>
        <h2>新規リクエスト</h2>
        <p>投稿の新規リクエストはこちらから。</p>
        <b-button :to="{ name: 'new_revision' }" variant="outline-theme-dark"
          >新規リクエスト</b-button
        >
      </section>
      <section>
        <h2>投稿リクエスト一覧</h2>
        <p>自分がリクエストした投稿一覧はこっち。</p>
        <b-button :to="{ name: 'revision_list' }" variant="outline-theme-dark"
          >リクエスト一覧</b-button
        >
      </section>
    </template>
    <section v-if="admin_logged_in">
      <h2>記事一覧･管理</h2>
      <p>Writerからの投稿リクエストの承認･却下や、記事削除はここ。</p>
      <b-button :to="{ name: 'path_list' }" variant="outline-theme-dark"
        >リクエスト一覧</b-button
      >
    </section>
    <admin-change-password-modal v-model="admin_password_modal_shown" />
    <writer-change-password-modal v-model="writer_password_modal_shown" />
  </div>
</template>

<style lang="scss" scoped>
#admin-top {
  .profile {
    span {
      margin-left: 0.5rem;
    }

    .btn {
      margin-left: 0.5rem;
    }
  }
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import api from "@/apis/$api";
import aspida from "@aspida/axios";
import AdminAuth from "@/libs/auth/admin_auth";
import WriterAuth from "@/libs/auth/writer_auth";
import { AdminUserInfo } from "@/apis/admin/user.ts";
import { WriterUserInfo } from "@/apis/writer/user.ts";
import AdminChangePasswordModal from "@/components/AdminChangePasswordModal.vue";
import WriterChangePasswordModal from "@/components/WriterChangePasswordModal.vue";
import Breadcrumb from "@/components/Breadcrumb.vue";

@Component({
  components: {
    AdminChangePasswordModal,
    WriterChangePasswordModal,
    Breadcrumb,
  },
})
export default class AdminTop extends Vue {
  readonly page_title = "ブログ管理";

  admin_user: AdminUserInfo | null = null;
  writer_user: WriterUserInfo | null = null;

  admin_password_modal_shown = false;
  writer_password_modal_shown = false;

  mounted() {
    this.load();
  }

  load() {
    if (this.admin_logged_in()) {
      AdminAuth.attempt_get_JWT()
        .then((token) => {
          return api(aspida()).admin.user.$get({
            headers: { "X-ADMIN-TOKEN": token.content },
          });
        })
        .then((user_info) => {
          this.admin_user = user_info;
        });
    }
    if (this.writer_logged_in()) {
      WriterAuth.attempt_get_JWT()
        .then((token) => {
          return api(aspida()).writer.user.$get({
            headers: { "X-BLOG-WRITER-TOKEN": token.content },
          });
        })
        .then((user_info) => {
          this.writer_user = user_info;
        });
    }
  }

  admin_login() {
    AdminAuth.attempt_get_JWT().then(() => {
      this.load();
    });
  }

  admin_logout() {
    AdminAuth.logout();
    this.admin_user = null;
  }

  writer_login() {
    WriterAuth.attempt_get_JWT().then(() => {
      this.load();
    });
  }

  writer_logout() {
    WriterAuth.logout();
    this.writer_user = null;
  }

  admin_logged_in() {
    // to disable cache, this isn't getter
    return AdminAuth.getJWT() !== null;
  }

  writer_logged_in() {
    // same as below
    return WriterAuth.getJWT() !== null;
  }
}
</script>
