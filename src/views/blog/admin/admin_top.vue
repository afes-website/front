<template>
  <div id="admin-top" class="box wide-box">
    <breadcrumb :text="page_title" />
    <h1>{{ page_title }}</h1>
    <section class="profile">
      <font-awesome-icon :icon="user_icon" class="fa-fw" />
      <span class="name">{{ user_name }}</span>
      <span class="id">@{{ user_id }}</span>
      <b-button @click="show_password_modal" size="sm" variant="outline-info">
        パスワード変更
      </b-button>
    </section>
    <template v-if="is_writer">
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
    <section v-if="is_admin">
      <h2>記事一覧･管理</h2>
      <p>Writerからの投稿リクエストの承認･却下や、記事削除はここ。</p>
      <b-button :to="{ name: 'path_list' }" variant="outline-theme-dark"
        >リクエスト一覧</b-button
      >
    </section>
    <change-password-modal v-model="password_modal_shown" />
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
import { get_user_icon, StorageUserInfo } from "@/libs/auth/auth";
import ChangePasswordModal from "@/components/ChangePasswordModal.vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import auth_eventhub from "@/libs/auth/auth_eventhub";

@Component({
  components: {
    ChangePasswordModal,
    Breadcrumb,
  },
})
export default class AdminTop extends Vue {
  readonly page_title = "ブログ管理";
  password_modal_shown = false;

  user: StorageUserInfo | null = null;

  mounted() {
    this.load();
    auth_eventhub.onUpdateAuth(this.load);
  }

  load() {
    if (this.$auth.get_current_user_id) {
      this.user = this.$auth.get_current_user;
    } else {
      this.$router.push({ name: "login" });
    }
  }

  show_password_modal() {
    this.password_modal_shown = true;
  }

  get user_id() {
    return this.user?.id;
  }

  get user_name() {
    return this.user?.name;
  }

  get user_icon() {
    return get_user_icon(this.user);
  }

  get is_writer() {
    return this.user?.permissions.blogWriter;
  }
  get is_admin() {
    return this.user?.permissions.blogAdmin;
  }
}
</script>
