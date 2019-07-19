<template>
  <q-page
    class="video-warp"
    padding
  >
    <hls-player
      :source="normalizeUrl(currentVideo.dl.dd._)"
      :options="options"
      ref="player"
    ></hls-player>
    <q-page-sticky
      position="top-left"
      :offset="[5, 5]"
    >
      <q-btn
        round
        color="accent"
        icon="arrow_back"
        @click="goback"
      />
    </q-page-sticky>
    <q-page-sticky
      position="top-right"
      :offset="[5, 5]"
    >
      <q-btn
        round
        color="accent"
        icon="layers"
        @click="minimize"
      />
    </q-page-sticky>
  </q-page>
</template>

<script>
import HlsPlayer from 'components/HlsPlayer';
import normalizeUrl from 'normalize-url';
import { mapState } from 'vuex';
import { stringify } from 'query-string';
import Positioner from 'electron-positioner';

const { BrowserWindow, getCurrentWindow } = require('electron').remote;

export default {
  name: 'Videop',
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
    };
  },
  components: {
    HlsPlayer,
  },
  methods: {
    normalizeUrl(url) {
      const pureUrl = url.replace(/(.*?)\$/, '').replace(/\$(.*)/, '');
      return normalizeUrl(pureUrl);
    },
    goback() {
      this.$router.go(-1);
    },
    minimize() {
      const { player } = this.$refs.player;
      player.pause();
      const videoInfo = JSON.stringify(this.currentVideo);
      const encodeUrl = stringify({ video: videoInfo });
      const parentWindow = getCurrentWindow();
      const win = new BrowserWindow({
        width: 800,
        height: 600,
        useContentSize: true,
        webPreferences: {
          nodeIntegration: true,
          webSecurity: false,
        },
        parent: parentWindow,
      });
      win.removeMenu();
      const positioner = new Positioner(win);
      positioner.move('bottomRight');
      win.loadURL(`${process.env.APP_URL}#/mini-video?${encodeUrl}`);
    },
  },
  computed: {
    ...mapState({
      currentVideo: state => state.video.currentVideo,
    }),
  },
};
</script>

<style>
.video-warp {
  height: calc(100vh - 148px);
}
</style>
