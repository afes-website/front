import MarkdownIt from "markdown-it";
import type ParserInline from "markdown-it/lib/parser_inline";
import type Renderer from "markdown-it/lib/renderer";

const parse_embed: ParserInline.RuleInline = (state) => {
  let pos = state.pos;

  if (state.src[pos] !== "{") {
    return false;
  }

  const start = pos;
  pos++;

  const open_pos = start + 1;
  const close_pos = state.src.indexOf("}", open_pos);

  if (close_pos == -1) return false;

  const marker = state.src.slice(start, close_pos + 1);

  const inner = marker.slice(1, -1);

  const space_pos = inner.indexOf(" ");
  if (space_pos == -1) return false;

  const embed_type = inner.slice(0, space_pos);
  const embed_content = inner.slice(space_pos + 1);

  const token = state.push("blog_embed", "", 0);
  token.tag = embed_type;
  token.markup = marker;
  token.content = embed_content;

  state.pos = close_pos + 1;
  return true;
};

const render_embed: Renderer.RenderRule = (tokens, idx) => {
  const type = tokens[idx].tag;
  const id = tokens[idx].content;

  switch (type) {
    case "tweet":
      return `<blockquote class="twitter-tweet"><a href="https://twitter.com/_/status/${id}?ref_src=twsrc%5Etfw"></a></blockquote>`;
    case "twitter_timeline":
      return `<a class="twitter-timeline" href="https://twitter.com/${id}"></a>`;
    case "instagram":
      return `<iframe src="//instagram.com/p/${id}/embed/" width="612" height="710" frameborder="0" scrolling="no" allowtransparency="true"></iframe>`;
    case "youtube":
      return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${id}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
  }
  return "";
};

export default function embed_plugin(md: MarkdownIt) {
  md.inline.ruler.before("emphasis", "blog_embed", parse_embed);
  md.renderer.rules["blog_embed"] = render_embed;
}

export function post_render() {
  window.twttr.widgets.load();
}
