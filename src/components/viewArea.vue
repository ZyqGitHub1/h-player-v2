<template>
  <div :style="style">
    <slot></slot>
  </div>
</template>

<script>
import { dom, throttle } from 'quasar';

const { height } = dom;
export default {
  name: 'viewArea',
  data() {
    return {
      style: {
        height: '0',
      },
    };
  },
  mounted() {
    this.setViewAreaHeight();
    this.$nextTick(() => {
      const config = {
        attributes: true,
      };
      this.observer = new MutationObserver(throttle(this.setViewAreaHeight, 500));
      this.observer.observe(document.querySelector('.q-page'), config);
    });
  },
  methods: {
    setViewAreaHeight() {
      const scrollWarpElement = document.querySelector('.scroll-warp');
      const viewAreaHeight = height(scrollWarpElement);
      this.style.height = `${viewAreaHeight}px`;
    },
  },
};
</script>

<style>
</style>
