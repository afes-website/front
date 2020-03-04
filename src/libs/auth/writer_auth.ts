import Cookie from "js-cookie";

import JWT from "./jwt";

import api from "@/apis/$api";
import { AspidaClient } from "aspida";
import { AxiosRequestConfig } from "axios";
import EventHub from "./writer_auth_eventhub";

function getJWT(): JWT | null {
  const writer_token = Cookie.get("writer_token");
  if (!writer_token) return null;
  const jwt = new JWT(writer_token);
  if (!jwt.isValidAt(new Date())) return null;
  return jwt;
}

function attempt_get_JWT(): Promise<JWT> {
  return new Promise((s, r) => {
    const ret = getJWT();
    if (ret) {
      s(ret);
      return;
    }

    EventHub.emitOpenModal();
    EventHub.onLoginSuccess(() => {
      attempt_get_JWT().then(s); // login success
    });
    EventHub.onLoginFail(() => {
      r();
    });
  });
}

function login(
  client: AspidaClient<AxiosRequestConfig>,
  id: string,
  password: string
): Promise<string> {
  return api(client)
    .writer.login.$post({ data: { id, password } })
    .then((d: { token: string }) => {
      Cookie.set("writer_token", d.token);
      return d.token;
    });
}

function logout() {
  Cookie.remove("writer_token");
}

function change_password(
  client: AspidaClient<AxiosRequestConfig>,
  password: string
): Promise<void> {
  const token = getJWT();
  if (token == null) return Promise.reject();
  return api(client)
    .writer.change_password.$post({
      headers: { "X-BLOG-WRITER-TOKEN": token.content },
      data: { password }
    })
    .then(() => {
      return;
    });
}

export default { getJWT, login, logout, change_password, attempt_get_JWT };
