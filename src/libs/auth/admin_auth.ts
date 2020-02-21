import Cookie from "js-cookie";

import JWT from "./jwt";

import api from "@/apis/$api";
import { AspidaClient } from "aspida";

export function getJWT(): JWT | null {
  const admin_token = Cookie.get("admin_token");
  if (!admin_token) return null;
  const jwt = new JWT(admin_token);
  if (!jwt.isValidAt(new Date())) return null;
  return jwt;
}

export function login(
  client: AspidaClient<unknown>,
  id: string,
  password: string
): Promise<string> {
  return api(client)
    .admin.login.$post({ data: { id, password } })
    .then((d: { token: string }) => {
      Cookie.set("admin_token", d.token);
      return d.token;
    });
}

export default { getJWT, login };
