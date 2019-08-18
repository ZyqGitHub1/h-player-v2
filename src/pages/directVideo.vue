<template>
  <q-page
    class="video-warp"
    padding
  >
    <hls-player
      :source="normalizeUrl(videoUrl)"
      :options="options"
      @hls-error="errorHandler"
      ref="player"
    ></hls-player>
  </q-page>
</template>

<script>
import HlsPlayer from 'components/HlsPlayer';
import normalizeUrl from 'normalize-url';
import isAbsoluteUrl from 'is-absolute-url';

export default {
  name: 'MiniVideo',
  data() {
    return {
      options: {
        controls: [
          'play-large',
          'play',
          'progress',
          'current-time',
          'mute',
          'volume',
          'captions',
          'settings',
          'airplay',
          'fullscreen',
        ],
      },
      videoUrl: '',
    };
  },
  components: {
    HlsPlayer,
  },
  mounted() {
    const videoInfo = JSON.parse(this.$route.query.video);
    this.videoUrl = videoInfo.url;
    document.querySelector('title').text = videoInfo.url;
  },
  methods: {
    normalizeUrl(url) {
      if (isAbsoluteUrl(url)) {
        const pureUrl = url.replace(/(.*?)\$/, '').replace(/\$(.*)/, '');
        return normalizeUrl(pureUrl);
      }

      return '';
    },
    errorHandler(event, data) {
      if (data.details && data.details === 'manifestLoadError') {
        this.$q.dialog({
          title: '错误',
          message: '播放失败，点击关闭窗口',
          persistent: true,
        }).onOk(() => {
          const { getCurrentWindow } = this.$q.electron.remote;
          const window = getCurrentWindow();
          window.close();
        });
      }
    },
  },
};
</script>

<style>
.video-warp {
  height: 100vh;
}
</style>
