export function get_payload(_token: string) {
  return JSON.parse(atob(_token.split(".")[1]));
}

export function token_is_valid_at(
  _token: string,
  _date: Date = new Date()
): boolean {
  const not_valid_before: Date = new Date(
    Number(get_payload(_token)["iat"]) * 1000
  );
  const expiration: Date = new Date(Number(get_payload(_token)["exp"]) * 1000);
  return not_valid_before <= _date && _date <= expiration;
}
