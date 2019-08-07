<template>
  <q-toolbar>
    <q-toolbar-title>
      <q-avatar
        square
        size="24px"
        color="orange"
      >H</q-avatar>
    </q-toolbar-title>
    <q-space></q-space>
    <q-btn
      v-if="canUpdate"
      color="orange"
      icon="cloud_upload"
      label="发现新版本，点击查看"
      @click="visitRelease"
    />
  </q-toolbar>
</template>

<script>
import { mapState } from 'vuex';
import semver from 'semver';

export default {
  name: 'FooterContent',
  computed: {
    ...mapState({
      currentVersion: state => state.app.currentVersion,
      latestVersion: state => state.app.latestVersion,
    }),
    canUpdate() {
      return (
        this.latestVersion !== '0.0.0'
        && semver.gt(this.latestVersion, this.currentVersion)
      );
    },
  },
  methods: {
    visitRelease() {
      const { shell } = this.$q.electron;
      shell.openExternal('https://github.com/ZyqGitHub1/h-player-v2/releases');
    },
  },
};
</script>

<style>
</style>
