<template>
  <q-page
    class="video-warp"
    padding
  >
    <hls-player
      :source="normalizeUrl(videoUrl)"
      :options="options"
      ref="player"
    ></hls-player>
     <q-page-sticky
      position="top-right"
      :offset="[5, 5]"
    >
      <q-btn
        round
        color="accent"
        icon="crop_square"
        @click="maximize"
      />
    </q-page-sticky>
  </q-page>
</template>

<script>
import isAbsoluteUrl from 'is-absolute-url';
import HlsPlayer from 'components/HlsPlayer';
import normalizeUrl from 'normalize-url';
import _get from 'lodash/get';

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
    const episodeInfo = JSON.parse(this.$route.query.episode);
    this.videoUrl = _get(episodeInfo, 'url', '');
    document.querySelector('title').text = `${videoInfo.name[0]}-${episodeInfo.episode}`;
  },
  methods: {
    normalizeUrl(url) {
      if (isAbsoluteUrl(url)) {
        const pureUrl = url.replace(/(.*?)\$/, '').replace(/\$(.*)/, '');
        return normalizeUrl(pureUrl);
      }

      return '';
    },
    maximize() {
      const ipc = this.$q.electron.ipcRenderer;
      const { getCurrentWindow } = this.$q.electron.remote;
      const { player } = this.$refs.player;
      const { playing } = player;
      if (playing) {
        player.pause();
      }
      player.pause();
      this.$q.dialog({
        title: '还原',
        message: '此操作将在主窗口中打开视频并关闭当前窗口，是否继续',
        cancel: true,
        persistent: true,
      }).onOk(() => {
        ipc.send('from-mini', JSON.parse(this.$route.query.video));
        const window = getCurrentWindow();
        window.close();
      }).onCancel(() => {
        if (playing) {
          player.play();
        }
      });
    },
  },
};
</script>

<style>
.video-warp {
  height: 100vh;
}
</style>
