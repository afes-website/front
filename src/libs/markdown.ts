import MarkdownIt from "markdown-it";
import MarkdownIt_Sanitizer from "markdown-it-sanitizer";
import MarkdownIt_Imsize from "markdown-it-imsize";
import MarkdownIt_Checkbox from "markdown-it-checkbox";
import MarkdownIt_Mark from "markdown-it-mark";
import MarkdownIt_Emoji from "markdown-it-emoji";
import MarkdownIt_Ins from "markdown-it-ins";
import MarkdownIt_Container from "markdown-it-container";
import MarkdownIt_Sub from "markdown-it-sub";
import MarkdownIt_CjkBreaks from "markdown-it-cjk-breaks";

const md = MarkdownIt({ linkify: true })
  .use(MarkdownIt_Sanitizer)
  .use(MarkdownIt_Imsize)
  .use(MarkdownIt_Checkbox)
  .use(MarkdownIt_Mark)
  .use(MarkdownIt_Emoji)
  .use(MarkdownIt_Ins)
  .use(MarkdownIt_Container, "alert-success")
  .use(MarkdownIt_Container, "alert-info")
  .use(MarkdownIt_Container, "alert-warning")
  .use(MarkdownIt_Container, "alert-danger")
  .use(MarkdownIt_Sub)
  .use(MarkdownIt_CjkBreaks);

export default md;
