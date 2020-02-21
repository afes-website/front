export default class JWT {
  content: string;
  constructor(_content: string) {
    this.content = _content;
  }

  get header(): { [key: string]: string } {
    return JSON.parse(atob(this.content.split(".")[0]));
  }

  get payload(): { [key: string]: string } {
    return JSON.parse(atob(this.content.split(".")[1]));
  }

  isValidAt(now: Date = new Date()): boolean {
    const not_valid_before: Date = new Date(this.payload["iat"]);
    const expiration: Date = new Date(this.payload["exp"]);
    return not_valid_before <= now && now <= expiration;
  }

  get userId() {
    return this.payload["uid"];
  }
}
