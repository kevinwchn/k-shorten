<template>
  <v-app>
    <router-view/>
    <v-footer fixed>
      <v-spacer></v-spacer>
      <div>Kevin Wang &copy; {{ new Date().getFullYear() }}</div>
    </v-footer>
  </v-app>
</template>

<style>
</style>
