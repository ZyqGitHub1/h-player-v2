<template>
  <q-page
    class="video-warp"
    padding
  >
    <hls-player
      :source="normalizeUrl(currentVideo.dl.dd._)"
      :options="options"
    ></hls-player>
  </q-page>
</template>

<script>
import HlsPlayer from 'components/HlsPlayer';
import normalizeUrl from 'normalize-url';
import { mapState } from 'vuex';

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
