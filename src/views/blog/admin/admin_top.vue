<template>
  <div id="admin-top" class="box wide-box">
    <breadcrumb :text="page_title" />
    <h1>{{ page_title }}</h1>
    <section class="profile">
      <h3>管理者ユーザ</h3>
      <font-awesome-icon icon="user-shield" class="fa-fw" />
      <template v-if="logged_in()">
        <span class="name">{{ user_name }}</span>
        <span class="id">@{{ user_id }}</span>
        <b-button @click="show_password_modal" size="sm" variant="outline-info">
          パスワード変更
        </b-button>
        <b-button @click="logout" size="sm" variant="outline-danger">
          <font-awesome-icon :icon="'sign-out-alt'" class="fa-fw" />
          ログアウト
        </b-button>
      </template>
      <b-button v-else @click="login" size="sm" variant="theme-dark">
        <font-awesome-icon :icon="'sign-in-alt'" class="fa-fw" />
        ログイン
      </b-button>
    </section>
    <section class="profile">
      <h3>一般ユーザ</h3>
      <font-awesome-icon icon="user-edit" class="fa-fw" />
      <template v-if="writer_logged_in()">
        <span class="name">{{ writer_user_name }}</span>
        <span class="id">@{{ writer_user_id }}</span>
        <b-button
          @click="show_writer_password_modal"
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
      <b-button v-else @click="writer_login" size="sm" variant="theme-dark">
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
    <section v-if="logged_in">
      <h2>記事一覧･管理</h2>
      <p>Writerからの投稿リクエストの承認･却下や、記事削除はここ。</p>
      <b-button :to="{ name: 'path_list' }" variant="outline-theme-dark"
        >リクエスト一覧</b-button
      >
    </section>
    <admin-change-password-modal v-model="password_modal_shown" />
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
import api from "@afes-website/docs";
import aspida from "@aspida/axios";
import Auth from "@/libs/auth/auth";
import { UserInfo } from "@afes-website/docs";
import ChangePasswordModal from "@/components/ChangePasswordModal.vue";
import Breadcrumb from "@/components/Breadcrumb.vue";

@Component({
  components: {
    AdminChangePasswordModal: ChangePasswordModal,
    Breadcrumb,
  },
})
export default class AdminTop extends Vue {
  readonly page_title = "ブログ管理";

  user: UserInfo | null = null;

  password_modal_shown = false;

  mounted() {
    this.load();
  }

  load() {
    if (this.logged_in()) {
      Auth.attempt_get_JWT()
        .then((token) => {
          return api(aspida()).auth.user.$get({
            headers: { Authorization: "bearer " + token.content },
          });
        })
        .then((user_info) => {
          this.user = user_info;
        });
    }
  }

  login() {
    Auth.strictValidateJWT(aspida()).then((is_valid) => {
      if (!is_valid) {
        Auth.attempt_get_JWT().then(() => {
          this.load();
        });
      }
    });
  }

  logout() {
    Auth.logout();
    this.user = null;
  }

  logged_in() {
    // to disable cache, this isn't getter
    return Auth.getJWT() !== null;
  }

  show_password_modal() {
    this.password_modal_shown = true;
  }

  get user_name() {
    return this.user?.name;
  }

  get user_id() {
    return this.user?.id;
  }
}
</script>
