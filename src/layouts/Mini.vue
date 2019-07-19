<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'Mini',
};
</script>

<style lang="stylus">
.q-layout, .q-page {
  min-height: inherit !important;
}
</style>
