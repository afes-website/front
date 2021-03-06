<template>
  <b-button id="user-menu" v-if="isLoggedIn" variant="theme-dark">
    <div>
      <font-awesome-icon
        :icon="user_icon(current_user)"
        class="user-icon fa-fw"
      /><br />
      <span>
        {{ user_name(current_user) }}
      </span>
    </div>
    <b-popover
      id="user-menu-popover"
      :show.sync="is_show_popover"
      target="user-menu"
      placement="top"
      triggers="focus"
    >
      <template v-slot:default>
        <b-list-group id="user-menu-item-wrapper" hover>
          <b-list-group-item @click="switch_user(user)" action button>
            <div class="icons-wrapper">
              <font-awesome-icon
                :icon="user_icon(current_user)"
                class="fa-fw"
              />
              <font-awesome-icon
                icon="check"
                class="current-user-check fa-fw"
              />
            </div>
            {{ user_name(current_user) }}
          </b-list-group-item>
          <b-list-group-item
            v-for="user in non_current_users"
            :key="user_id(user)"
            @click="switch_user(user)"
            action
            button
          >
            <div class="icons-wrapper">
              <font-awesome-icon :icon="user_icon(user)" class="fa-fw" />
            </div>
            {{ user_name(user) }}
          </b-list-group-item>
          <b-list-group-item
            actiton
            button
            @click="to_login"
            variant="theme-dark"
          >
            <font-awesome-icon icon="plus-circle" class="fa-fw" />
            ログイン
          </b-list-group-item>
          <b-list-group-item
            actiton
            button
            v-b-modal.logoutAlertModal
            variant="danger"
          >
            <font-awesome-icon icon="minus-circle" class="fa-fw" />
            @{{ user_id(current_user) }} からログアウト
          </b-list-group-item>
        </b-list-group>
      </template>
    </b-popover>
    <b-modal id="logoutAlertModal" title="ログアウトしますか？" centered>
      <p>@{{ user_id(current_user) }} からログアウトしますか？</p>
      <p>
        ログアウト後、再び @{{ user_id(current_user) }}
        を使用するにはパスワードが必要です。
      </p>
      <template v-slot:modal-footer="{ ok, cancel }">
        <b-button variant="secondary" @click="cancel()">キャンセル</b-button>
        <b-button
          variant="theme-dark"
          @click="
            ok();
            remove_current_user();
          "
        >
          ログアウト
        </b-button>
      </template>
    </b-modal>
    <ReLoginModal />
  </b-button>
</template>

<style lang="scss" scoped>
#user-menu {
  display: block;
  border: none;
  width: 100%;
  font-size: 17px;
  padding: 8px 16px;
  border-radius: 8px;
  line-height: 30px;
  cursor: pointer;
  text-align: left;
}
</style>

<style lang="scss">
$menu-border-color: rgba(#000, 0.125);
#user-menu-popover {
  border-color: $menu-border-color;
  .popover-body {
    padding: 0;
  }
}
#user-menu-item-wrapper {
  .list-group-item {
    border: none;
    background: none;
    font-size: 15px;
    line-height: 25px;
    .icons-wrapper {
      display: flex;
      flex-direction: row;
      align-items: baseline;
      justify-content: space-between;
      margin: 5px 0;
      .current-user-check {
        height: 15px;
        color: $theme-dark;
      }
    }
  }
  .list-group-item:hover {
    background: #f8f9fa;
  }
  .list-group-item:not(:first-child) {
    border-top: 1px solid $menu-border-color;
  }
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { StorageUserInfo } from "@/libs/auth/auth";
import { get_user_icon } from "@/libs/auth/auth";
import auth_eventhub from "@/libs/auth/auth_eventhub";
import ReLoginModal from "@/components/ReLoginModal.vue";

@Component({
  components: { ReLoginModal },
})
export default class UserMenu extends Vue {
  current_user: StorageUserInfo | null = null;
  users: StorageUserInfo[] = [];
  is_show_popover = false;

  created() {
    this.load();
    auth_eventhub.onUpdateAuth(this.load);
  }

  load() {
    this.current_user = this.$auth.get_current_user;
    this.users.splice(
      0,
      this.users.length,
      ...Object.values(this.$auth.get_all_users)
    );
  }

  switch_user(user: StorageUserInfo) {
    this.$auth.switch_user(user.id);
    this.is_show_popover = false;
  }

  remove_current_user() {
    if (this.$auth.get_current_user_id)
      this.$auth.remove_user(this.$auth.get_current_user_id);
    this.is_show_popover = false;
  }

  to_login() {
    this.$router.push({ name: "login" });
    this.is_show_popover = false;
  }

  get isLoggedIn() {
    return !!this.current_user;
  }

  get non_current_users() {
    return this.users.filter((user) => {
      return user.id !== this.$auth.get_current_user_id;
    });
  }

  is_current_user(user: StorageUserInfo) {
    return this.$auth.get_current_user_id === user.id;
  }

  user_id(user: StorageUserInfo) {
    return user.id;
  }

  user_name(user: StorageUserInfo) {
    return user.name;
  }

  user_icon(user: StorageUserInfo) {
    return get_user_icon(user);
  }
}
</script>
