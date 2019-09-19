<template>
  <q-layout view="hHh Lpr fFf">
    <!-- (Optional) The Header -->
    <q-header elevated>
      <title-bar></title-bar>
      <q-toolbar>
        <q-btn
          dense
          flat
          round
          icon="menu"
          @click="leftDrawer = !leftDrawer"
        />
        <q-space></q-space>
        <q-btn
          dense
          flat
          icon="check"
          label="确定"
          @click="closeConfig"
        />
      </q-toolbar>
    </q-header>
    <!-- (Optional) The Footer -->
    <q-footer>
      <footer-content></footer-content>
    </q-footer>
    <q-page-container>
      <router-view></router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
import footerContent from 'components/footerContent';
import titleBar from 'components/titleBar';

export default {
  name: 'Config',
  data() {
    return {
      leftDrawer: this.$q.platform.is.desktop,
    };
  },
  components: {
    titleBar,
    footerContent,
  },
  methods: {
    closeConfig() {
      this.$router.replace('/');
    },
  },
};
</script>

<style lang="stylus"></style>
