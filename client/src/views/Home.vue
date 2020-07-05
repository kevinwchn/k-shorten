<template>
  <div class="home">
    <v-row>
      <v-col>
        <p class="header">Shorten your URL</p>
      </v-col>
    </v-row>
    <v-row no-gutters class="pt-3">
      <v-col cols="12" sm="8" offset-sm="2" md="4" offset-md="4">
        <v-form
          v-model="valid"
        >
          <v-text-field
            label="Url"
            outlined
            v-model="url"
            :rules="[v => !!v || 'Url is required']"
          >
          Url
          </v-text-field>

          <v-text-field
            label="Slug"
            outlined
            v-model="slug"
            :rules="[v => !!v || 'Slug is required']"
          >
          Slug
          </v-text-field>

          <v-btn color="success" @click="submitRequest()" :disabled="!valid">
            Shorten
          </v-btn>
          <p v-if="shortUrl">Your short Url: <a :href="shortUrl">{{ shortUrl }}</a></p>
          <v-alert
            v-if="errMessage"
            type="warning"
            dense
            class="mt-5"
            border="top"
            colored-border
            elevation="1"
            tile>
            {{ errMessage }}
          </v-alert>
        </v-form>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Walter+Turncoat&display=swap');

.home {
  text-align: center;
  padding: 30px;
}

.header {
  font-family: 'Walter Turncoat', cursive;
  font-size: 32px;
}
</style>

<script>
export default {
  name: 'Home',
  data() {
    return {
      url: null,
      slug: null,
      valid: false,
      shortUrl: null,
      errMessage: '',
    };
  },
  methods: {
    async submitRequest() {
      console.log(this.url, this.slug);
      this.shortUrl = null;
      this.errMessage = null;
      try {
        const response = await fetch('/api/url', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            url: this.url,
            slug: this.slug,
          }),
        });
        if (response.ok) {
          this.shortUrl = this.addhttpToUrl(`${window.location.host}/${this.slug}`);
        } else {
          this.errMessage = await response.text();
        }
      } catch (err) {
        this.errMessage = 'Error occurred! Please try again later';
      }
    },
    addhttpToUrl(url) {
      if (!/^https?:\/\//i.test(url)) {
        return `http://${url}`;
      }
      return url;
    },
  },
};
</script>
