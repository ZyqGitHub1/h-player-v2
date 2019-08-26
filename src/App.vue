<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'App',
  created() {
    const ipc = this.$q.electron.ipcRenderer;
    ipc.on('from-mini', (event, message) => {
      this.gotoPlayer(message);
    });
    this.$store.dispatch('getLatestVersion');
    this.$store.dispatch('loadSiteList').then((storeSiteList) => {
      if (!storeSiteList || storeSiteList.length === 0) {
        this.$router.push('/import');
      }
    });
    this.$store.dispatch('loadSettings');
  },
  methods: {
    ...mapMutations(['setCurrentVideo']),
    gotoPlayer(video) {
      this.setCurrentVideo(video);
      this.$router.push('/video');
    },
  },
};
</script>

<style>
</style>
