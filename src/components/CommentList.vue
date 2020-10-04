<template>
  <div class="comment-list">
    <div class="comment-item-wrapper">
      <div class="comment-item" v-for="(comment, i) in comments" :key="i">
        <div class="info-wrapper">
          <div class="author-icon-wrapper">
            <font-awesome-icon
              :icon="get_user_icon(get_comment_author(comment))"
              class="author-icon"
            />
          </div>
          <div class="property-wrapper">
            <span class="author-name">
              {{ get_author_name(get_comment_author(comment)) }}
            </span>
            <div class="property-lower">
              <span class="author-id">
                {{ get_author_id(get_comment_author(comment)) }}
              </span>
              <span
                class="created-at"
                v-b-tooltip.v-theme-dark
                :title="get_formatted_time(get_comment_created_at(comment))"
              >
                {{ get_formatted_from_now(get_comment_created_at(comment)) }}
              </span>
            </div>
          </div>
        </div>
        <div class="content" v-html="get_html(get_comment_content(comment))" />
      </div>
    </div>
    <div class="add-comment">
      <div class="author-icon-wrapper">
        <font-awesome-icon
          :icon="get_user_icon(currentUser)"
          class="author-icon"
        />
      </div>
      <div class="new-comment-area-wrapper">
        <b-form-textarea
          rows="1"
          max-rows="100"
          class="new-comment"
          v-model="newComment"
          placeholder="新しいコメントを追加"
          no-resize
        />
        <b-button
          @click="postComment"
          variant="theme-dark"
          class="post-button"
          :disabled="!newComment"
        >
          投稿
        </b-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.comment-list {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  max-width: 800px;

  .comment-item-wrapper {
    position: relative;

    &::before {
      content: "";
      position: absolute;
      top: 20px;
      bottom: 10px;
      width: 3px;
      left: 24px;
      border-radius: 2px;
      background: #ccc;
    }

    .comment-item {
      margin: 0 0 20px 0;

      .info-wrapper {
        display: flex;
      }

      .property-wrapper {
        display: inline-flex;
        flex-direction: column;
        justify-content: space-between;
        height: 44px;

        .author-name {
          display: inline-block;
          height: 22px;
          font-size: 0.95rem;
          font-weight: 700;
        }

        .property-lower {
          height: 20px;
          font-size: 0.8rem;
          font-weight: 500;
          color: #666;

          span {
            &:not(:last-of-type)::after {
              content: " ･ ";
            }
          }
        }
      }
    }
    .content {
      display: inline-block;
      margin: 0 0 0 60px;
    }
  }
  .add-comment {
    position: relative;
    margin: 0;
    display: flex;

    .new-comment-area-wrapper {
      display: inline-flex;
      width: calc(100% - 60px);

      .new-comment {
        background: none;
      }

      .post-button {
        margin-left: 10px;
        white-space: nowrap;
        width: min-content;
      }
    }
  }
}

.author-icon-wrapper {
  display: inline-block;
  position: relative;
  height: 50px;
  width: 50px;
  background: $theme-light;
  color: $theme-dark;
  border-radius: 50%;
  font-size: 22px;
  margin-right: 10px;

  .author-icon {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
  }
}
</style>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { api, Draft, DraftComment, UserInfo } from "@afes-website/docs";
import { get_user_icon, StorageUserInfo } from "@/libs/auth/auth";
import aspida from "@aspida/axios";
import { getStringTime, getStringFromNow } from "@/libs/string_date";
import auth_eventhub from "@/libs/auth/auth_eventhub";
import Markdown from "@/libs/markdown";

@Component
export default class CommentList extends Vue {
  @Prop({ required: true, default: [] })
  value?: Draft;

  get comments(): DraftComment[] {
    if (this.value) return this.value.comments || [];
    return [];
  }

  @Prop({ required: true })
  draftId?: number;

  newComment = "";

  currentUser: StorageUserInfo | null = null;

  mounted() {
    this.loadUser();
    auth_eventhub.onUpdateAuth(this.loadUser);
  }

  loadUser() {
    this.currentUser = this.$auth.get_current_user;
  }

  postComment() {
    this.$auth
      .attempt_get_JWT(["exhibition", "blogAdmin", "teacher"])
      .then((token) => {
        api(aspida())
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          .online.drafts._id(this.draftId!)
          .comment.$post({
            headers: { Authorization: "bearer " + token },
            body: { comment: this.newComment },
          })
          .then((draft) => {
            this.$emit("input", draft);
            this.newComment = "";
          });
      });
  }

  get_comment_author(comment: DraftComment) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return comment.author!;
  }
  get_comment_content(comment: DraftComment) {
    return comment.message;
  }
  get_comment_created_at(comment: DraftComment) {
    return comment.created_at;
  }

  get_author_name(author: UserInfo) {
    return author.name;
  }
  get_author_id(author: UserInfo) {
    return "@" + author.id;
  }

  get_formatted_time(timestamp: string | undefined) {
    return timestamp ? getStringTime(timestamp) : "-";
  }
  get_formatted_from_now(timestamp: string | undefined) {
    return timestamp ? getStringFromNow(timestamp) : "-";
  }
  get_user_icon(author: StorageUserInfo | UserInfo) {
    return get_user_icon(author);
  }

  get_html(markdown: string) {
    return Markdown.render(markdown);
  }
}
</script>
