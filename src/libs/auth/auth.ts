import Cookie from "js-cookie";

import JWT from "./jwt";

import api from "@afes-website/docs";
import { AspidaClient } from "aspida";
import { AxiosRequestConfig } from "axios";
import EventHub from "./auth_eventhub";
import aspida from "@aspida/axios";

function getJWT(): JWT | null {
  const token = Cookie.get("token");
  if (!token) return null;
  const jwt = new JWT(token, "uid");
  if (!jwt.isValidAt(new Date())) return null;
  return jwt;
}

function strictValidateJWT(client: AspidaClient<AxiosRequestConfig>) {
  const jwt = getJWT();
  if (jwt === null) return Promise.resolve(false);
  return new Promise((s) => {
    api(client)
      .auth.user.$get({ headers: { Authorization: "bearer " + jwt.content } })
      .then(() => s(true))
      .catch(() => {
        Cookie.remove("token");
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
    .auth.login.$post({ body: { id, password } })
    .then((d: { token: string }) => {
      Cookie.set("token", d.token);
      return d.token;
    });
}

function logout() {
  Cookie.remove("token");
}

function change_password(
  client: AspidaClient<AxiosRequestConfig>,
  password: string
): Promise<void> {
  const token = getJWT();
  if (token == null) return Promise.reject();
  return api(client)
    .auth.change_password.$post({
      headers: { Authorization: token.content },
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
