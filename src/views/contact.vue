<template>
  <div id="contact" class="box">
    <h1>{{ page_title }}</h1>
    <b-form @submit="send" v-show="!submitted">
      <b-form-group label="該当するものを選択してください:">
        <b-form-select v-model="data.type" :options="typeOptions" required />
      </b-form-group>
      <b-form-group description="返信が必要な場合はご記入ください">
        <b-form-input
          type="email"
          v-model="data.email"
          placeholder="email (example@afes.info)"
        />
      </b-form-group>
      <b-form-group>
        <b-form-input v-model="data.title" placeholder="件名" required />
      </b-form-group>
      <b-form-group>
        <b-form-textarea
          v-model="data.message"
          placeholder="お問い合わせ内容"
          rows="3"
          required
        />
      </b-form-group>
      <b-button type="submit" variant="primary">送信</b-button>
    </b-form>
    <div v-show="submitted">
      <p>送信しました。</p>
      <p>返信まで少々お時間を頂く場合があります。ご了承ください。</p>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Contact extends Vue {
  readonly page_title = "お問い合わせ";
  submitted = false;

  data = {
    type: "",
    email: "",
    title: "",
    message: ""
  };

  readonly typeOptions = [
    "麻布に受験する事を考えている小学生とそのご家族",
    "麻布生でない中学生・高校生・高専生",
    "麻布OB",
    "麻布生の保護者",
    "麻布生",
    "その他"
  ];

  send() {
    const form = document.createElement("form");
    form.setAttribute("target", "hidden_iframe");
    const type = document.createElement("input");
    const mail = document.createElement("input");
    const title = document.createElement("input");
    const message = document.createElement("input");

    const iframe = document.createElement("iframe");
    iframe.setAttribute("name", "hidden_iframe");
    iframe.setAttribute("style", "display: none");
    document.body.appendChild(iframe);

    form.method = "POST";
    form.action =
      "https://docs.google.com/forms/d/e/1FAIpQLSeybI3QIuf-TLja1ecYN40oDIwqdstN_CGROwknPl8xfu3Uyw/formResponse";

    type.type = "hidden";
    type.name = "entry.1122193291";
    type.value = this.data.type;

    mail.type = "hidden";
    mail.name = "entry.866765801";
    mail.value = this.data.email;

    title.type = "hidden";
    title.name = "entry.661091479";
    title.value = this.data.title;

    message.type = "hidden";
    message.name = "entry.1526564238";
    message.value = this.data.message;

    form.appendChild(type);
    form.appendChild(mail);
    form.appendChild(title);
    form.appendChild(message);
    document.body.appendChild(form);

    form.submit();

    this.submitted = true;
  }
}
</script>
