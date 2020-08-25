import Cookie from "js-cookie";

import JWT from "./jwt";

import api from "@/apis/$api";
import { AspidaClient } from "aspida";
import { AxiosRequestConfig } from "axios";
import EventHub from "./admin_auth_eventhub";
import aspida from "@aspida/axios";

function getJWT(): JWT | null {
  const admin_token = Cookie.get("admin_token");
  if (!admin_token) return null;
  const jwt = new JWT(admin_token, "admin_uid");
  if (!jwt.isValidAt(new Date())) return null;
  return jwt;
}

function strictValidateJWT(client: AspidaClient<AxiosRequestConfig>) {
  const jwt = getJWT();
  if (jwt === null) return Promise.resolve(false);
  return new Promise((s) => {
    api(client)
      .admin.user.$get({ headers: { "X-ADMIN-TOKEN": jwt.content } })
      .then(() => s(true))
      .catch(() => {
        Cookie.remove("admin_token");
        s(false);
      });
  });
}

function attempt_get_JWT(): Promise<JWT> {
  return strictValidateJWT(aspida()).then((r) => {
    if (r) {
      const ret = getJWT();
      if (ret) {
        return ret;
      }
    }

    return new Promise((s, r) => {
      EventHub.emitOpenModal();
      EventHub.onLoginSuccess(() => {
        return attempt_get_JWT().then(s); // login success
      });
      EventHub.onLoginFail(r);
    });
  });
}

function login(
  client: AspidaClient<AxiosRequestConfig>,
  id: string,
  password: string
): Promise<string> {
  return api(client)
    .admin.login.$post({ body: { id, password } })
    .then((d: { token: string }) => {
      Cookie.set("admin_token", d.token);
      return d.token;
    });
}

function logout() {
  Cookie.remove("admin_token");
}

function change_password(
  client: AspidaClient<AxiosRequestConfig>,
  password: string
): Promise<void> {
  const token = getJWT();
  if (token == null) return Promise.reject();
  return api(client)
    .admin.change_password.$post({
      headers: { "X-ADMIN-TOKEN": token.content },
      body: { password },
    })
    .then(() => {
      return;
    });
}

export default {
  getJWT,
  strictValidateJWT,
  login,
  logout,
  change_password,
  attempt_get_JWT,
};
