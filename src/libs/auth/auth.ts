import Vue from "vue";
import api, { UserInfo } from "@afes-website/docs";
import axios from "@aspida/axios";
import {
  faUser,
  faUserCog,
  faUserEdit,
  faUserShield,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { token_is_valid_at } from "@/libs/auth/jwt_utils";
import auth_eventhub from "@/libs/auth/auth_eventhub";

const storage_key_users = "users";
const storage_key_current_user = "current_user";

type StorageUsers = { [user_id: string]: StorageUserInfo };

export type StorageUserInfo = {
  token: string;
} & UserInfo;

export default class Auth {
  private all_users: StorageUsers = {};
  private current_user_id: string | null = null;
  private on_change_hook?: () => void;

  constructor(_on_change_hook?: () => void) {
    this.on_change_hook = _on_change_hook;
    if (axios().baseURL) this.init();
  }

  private async init(): Promise<void> {
    this.load_all_users();
    this.load_current_user_id();
    this.reload_current_user();
  }

  private load_all_users(): void {
    this.all_users = JSON.parse(
      localStorage.getItem(storage_key_users) || "{}"
    );
  }

  private load_current_user_id(): void {
    const val = localStorage.getItem(storage_key_current_user);
    this.current_user_id = val === "" ? null : val;
  }

  private save_all_users(): void {
    localStorage.setItem(storage_key_users, JSON.stringify(this.all_users));
  }

  private save_current_user_id(): void {
    localStorage.setItem(storage_key_current_user, this.current_user_id || "");
  }

  get get_all_users(): StorageUsers {
    return this.all_users;
  }

  get get_all_user_ids(): string[] {
    return Object.keys(this.all_users);
  }

  get_user(user_id: string): StorageUserInfo | undefined {
    return this.all_users[user_id];
  }

  get get_current_user_id(): string | null {
    return this.current_user_id;
  }

  get get_current_user(): StorageUserInfo | null {
    if (this.current_user_id === null) return null;
    return this.all_users[this.current_user_id] || null;
  }

  async register_user(token: string): Promise<void> {
    const ret = await api(axios()).auth.user.$get({
      headers: { Authorization: "bearer " + token },
    });
    Vue.set(this.all_users, ret.id, { ...ret, token });
    this.save_all_users();
    if (this.on_change_hook) this.on_change_hook();
  }

  remove_user(user_id: string): void {
    Vue.delete(this.all_users, user_id);
    this.save_all_users();
    this.reload_current_user();
    if (this.on_change_hook) this.on_change_hook();
  }

  /**
   * token を Promise で返す
   * @param _permission 権限の種類文字列もしくはその配列
   * @returns token:
   *          指定された権限を有している場合・権限が指定されていない場合
   * @throws {string|undefined}
   * Error Message
   * - You are not logged in.
   * - Token has been expired.
   */
  attempt_get_JWT(
    _permission?:
      | keyof StorageUserInfo["permissions"]
      | (keyof StorageUserInfo["permissions"])[]
  ): Promise<string> {
    const perm_arr = !_permission
      ? []
      : Array.isArray(_permission)
      ? _permission
      : [_permission];

    const current_user = this.get_current_user;
    if (!current_user) return Promise.reject("You are not logged in.");
    if (!token_is_valid_at(current_user.token)) {
      auth_eventhub.emitTokenExpired();
      return Promise.reject("Token has been expired.");
    }

    if (Array.isArray(_permission) ? !_permission.length : !_permission)
      return Promise.resolve(current_user.token);
    if (perm_arr.some((val) => current_user.permissions[val]))
      return Promise.resolve(current_user.token);
    return Promise.reject();
  }

  private reload_current_user(): void {
    if (
      this.current_user_id === null ||
      !(this.current_user_id in this.all_users)
    ) {
      this.current_user_id = Object.keys(this.all_users)[0] || null;
      this.save_current_user_id();
    }
  }

  switch_user(user_id: string): void {
    if (user_id in this.all_users) {
      this.current_user_id = user_id;
      this.save_current_user_id();
    }
    if (this.on_change_hook) this.on_change_hook();
  }

  on_change(hook: () => void): void {
    this.on_change_hook = hook;
  }
}

export const get_user_icon = (
  account: StorageUserInfo | null
): IconDefinition => {
  if (account?.permissions.admin) return faUserShield;
  if (account?.permissions.blogAdmin) return faUserCog;
  if (account?.permissions.blogWriter) return faUserEdit;
  return faUser;
};
