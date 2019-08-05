<template>
  <div class="hls-plyr-player">
    <video
      preload="none"
      ref="video"
    ></video>
  </div>
</template>

<script>
import Hls from 'hls.js';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

export default {
  name: 'HlsPlayer',
  props: {
    source: {
      type: String,
      required: true,
    },
    emit: {
      type: Array,
      required: false,
      default() {
        return [];
      },
    },
    options: {
      type: Object,
      required: false,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      hls: {},
      player: {},
    };
  },
  mounted() {
    this.player = new Plyr(this.video, this.options);
    this.$emit('player', this.player);
    this.emit.forEach((element) => {
      this.player.on(element, this.emitPlayerEvent);
    });
    if (!Hls.isSupported()) {
      this.video.src = this.source;
    } else {
      const hls = new Hls();
      this.hls = hls;
      hls.on(Hls.Events.ERROR, (event, data) => {
        this.$emit('hls-error', event, data);
      });
      hls.loadSource(this.source);
      hls.attachMedia(this.video);
      this.$once('hook:beforeDestroy', () => {
        this.player.destroy();
        hls.stopLoad();
        hls.destroy();
      });
    }
  },
  computed: {
    video() {
      return this.$refs.video;
    },
  },
  watch: {
    source() {
      if (!Hls.isSupported()) {
        this.video.src = this.source;
      } else {
        const hls = new Hls();
        this.hls = hls;
        hls.loadSource(this.source);
        hls.attachMedia(this.video);
        this.$once('hook:beforeDestroy', () => {
          try {
            this.player.destroy();
          } catch (e) {
            if (
              !(
                this.opts.hideYouTubeDOMError
                && e.message === 'The YouTube player is not attached to the DOM.'
              )
            ) {
              console.error(e);
            }
          }
          hls.stopLoad();
          hls.destroy();
        });
      }
    },
  },
};
</script>

<style lang="stylus">
.hls-plyr-player {
  width: 100%;
  height: 100%;

  .plyr {
    width: 100%;
    height: 100%;
  }

  .plyr__video-wrapper {
    width: 100%;
    height: 100%;

    video {
      width: 100% !important;
      height: 100% !important;
    }
  }
}
</style>
