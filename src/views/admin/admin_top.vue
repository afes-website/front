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
    <h2>近況</h2>
    <section v-if="is_blog_writer">
      <h3>新規記事リクエスト</h3>
      <span class="sub-title">近況への新規記事リクエスト</span>
      <b-button :to="{ name: 'new_revision' }" variant="outline-theme-dark">
        新規記事リクエスト
      </b-button>
    </section>
    <section v-if="is_blog_writer">
      <h3>記事リクエスト一覧</h3>
      <span class="sub-title">自分がリクエストした記事一覧</span>
      <b-button :to="{ name: 'revision_list' }" variant="outline-theme-dark">
        記事リクエスト一覧
      </b-button>
      <section v-if="is_blog_admin">
        <h3>記事一覧･管理</h3>
        <span class="sub-title">
          投稿リクエストの承認･却下や、記事管理･削除
        </span>
        <b-button :to="{ name: 'path_list' }" variant="outline-theme-dark">
          記事一覧
        </b-button>
      </section>
    </section>
    <h2>オンライン展示</h2>
    <section v-if="can_post_draft">
      <h3>展示更新リクエスト</h3>
      <span class="sub-title">オンライン展示の更新リクエスト</span>
      <b-button :to="{ name: 'admin_draft_post' }" variant="outline-theme-dark">
        展示更新リクエスト
      </b-button>
    </section>
    <section v-if="is_exhibition">
      <h3>展示管理 @{{ user_id }}</h3>
      <span class="sub-title">自展示の管理画面</span>
      <b-button
        :to="{ name: 'admin_exh_manage', params: { id: user_id } }"
        variant="outline-theme-dark"
      >
        展示管理 @{{ user_id }}
      </b-button>
    </section>
    <section v-if="is_exhibition_admin">
      <h3>展示一覧</h3>
      <span class="sub-title">オンライン展示出展団体一覧</span>
      <b-button :to="{ name: 'admin_exh_list' }" variant="outline-theme-dark">
        展示一覧
      </b-button>
    </section>
    <section v-if="is_exhibition_admin">
      <h3>展示更新リクエスト一覧</h3>
      <span class="sub-title">展示更新リクエストの一覧</span>
      <b-button :to="{ name: 'admin_draft_list' }" variant="outline-theme-dark">
        展示リクエスト一覧
      </b-button>
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
  .sub-title {
    display: block;
    color: var(--gray);
    margin-bottom: 16px;
    margin-top: -4px;
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
  readonly page_title = "管理";
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

  get is_blog_writer() {
    return this.user?.permissions.blogWriter;
  }
  get is_exhibition() {
    return this.user?.permissions.exhibition;
  }
  get is_blog_admin() {
    return this.user?.permissions.blogAdmin;
  }
  get is_teacher() {
    return this.user?.permissions.teacher;
  }

  get can_post_draft() {
    return this.is_exhibition || this.is_exhibition_admin;
  }
  get is_exhibition_admin() {
    return this.is_blog_admin || this.is_teacher;
  }
}
</script>
