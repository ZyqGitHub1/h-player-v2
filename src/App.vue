<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    this.$store.dispatch('getLatestVersion');
    this.$store.dispatch('loadSiteList').then((storeSiteList) => {
      if (!storeSiteList || storeSiteList.length === 0) {
        this.$router.push('/import');
      }
    });
  },
};
</script>

<style>
</style>
