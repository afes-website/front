import MarkdownIt from "markdown-it";
import MarkdownIt_Imsize from "markdown-it-imsize";
import MarkdownIt_Checkbox from "markdown-it-checkbox";
import MarkdownIt_Mark from "markdown-it-mark";
import MarkdownIt_Ins from "markdown-it-ins";
import MarkdownIt_Container from "markdown-it-container";
import MarkdownIt_CjkBreaks from "markdown-it-cjk-breaks";

import MarkdownIt_Embed, {
  get_plaintext,
  post_render as embed_post,
} from "@/libs/markdown_embed";

import Token from "markdown-it/lib/token";

export const Markdown = MarkdownIt({ linkify: true, html: true })
  .use(MarkdownIt_Imsize)
  .use(MarkdownIt_Checkbox)
  .use(MarkdownIt_Mark)
  .use(MarkdownIt_Ins)
  .use(MarkdownIt_Container, "alert-success")
  .use(MarkdownIt_Container, "alert-info")
  .use(MarkdownIt_Container, "alert-warning")
  .use(MarkdownIt_Container, "alert-danger")
  .use(MarkdownIt_CjkBreaks)
  .use(MarkdownIt_Embed);

export function render(md: string) {
  return Markdown.render(md);
}

export function get_first_image(md: string) {
  const tokens = Markdown.parse(md, {});
  const get_first_img = (tokens: Token[]): string | null => {
    return tokens.reduce((cur: string | null, token: Token): string | null => {
      if (cur !== null) return cur;
      if (token.type === "image" && token.attrs !== null) {
        return token.attrs.reduce((cur: string | null, attr: string[]) => {
          if (cur !== null) return cur;
          if (attr[0] == "src") return attr[1];
          return null;
        }, null);
      }
      if (token.children !== null) return get_first_img(token.children);
      return null;
    }, null);
  };
  const first_img_uri = get_first_img(tokens);
  if (first_img_uri === null) return null;
  if (first_img_uri.startsWith(process.env.VUE_APP_API_BASE_URL + "/images"))
    return first_img_uri + "?h=150&w=150"; // out images support server-side-resizing
  return first_img_uri;
}

export function render_plaintext(md: string) {
  const tokens = Markdown.parse(md, {});
  const tokens2txt = (tokens: Token[]) => {
    return tokens
      .map((token: Token): string => {
        if (token.block) {
          if (token.children !== null)
            // children may be null despite the type definition
            return tokens2txt(token.children) + " ";
          else return "";
        }
        if (token.type === "blog_embed") return get_plaintext(token.tag);
        return token.content;
      })
      .join("");
  };
  return tokens2txt(tokens);
}

// return minute to read
export function time_to_read(md: string) {
  return Math.ceil(render_plaintext(md).length / 400);
}

export function post_render(el?: Element) {
  embed_post(el);
}

export default {
  Markdown,
  render,
  get_first_image,
  render_plaintext,
  time_to_read,
  post_render,
};
