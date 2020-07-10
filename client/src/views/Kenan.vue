<template>
  <div>
    <h1>柯南</h1>
    <div>
      <v-text-field
        label="Episode"
        outlined
        v-model="episode"
        @keyup.enter="submitRequest()"
      >
      Episode
      </v-text-field>
      <v-btn @click="submitRequest()" width="100%">
        Go
      </v-btn>
      <p v-if="errMessage">{{ errMessage }}</p>
    </div>
  </div>
</template>

<style scoped>

</style>

<script>
export default {
  name: 'Kenan',
  data() {
    return {
      episode: 1,
      errMessage: undefined,
    };
  },
  methods: {
    async submitRequest() {
      try {
        const response = await fetch(`/api/kenan/${this.episode}`, {
          method: 'GET',
          headers: {
            'content-type': 'application/json',
          },
        });
        window.location.href = ((await response.json()).url);
      } catch (err) {
        console.log(err);
        this.errMessage = 'Error occurred! Please try again later';
      }
    },
  },
};
</script>
