<template>
  <q-page
    padding
    class="flex"
  >
    <scrollWarp>
      <q-scroll-area
        :thumb-style="thumbStyle"
        class="fit"
      >
        <viewArea>
          <hls-player
            :source="normalizeUrl(currentEpisode.url)"
            :options="options"
            @hls-error="errorHandler"
            ref="player"
          ></hls-player>
        </viewArea>
        <q-expansion-item
          icon="info"
          :label="`${currentVideo.name[0]}-${currentEpisode.episode}`"
          header-class="bg-primary text-white"
          expand-icon-class="text-white"
        >
          <q-card>
            <q-card-section>
              <div class="text-h6">演员: {{currentVideo.actor[0]}}</div>
              <div class="text-h6">地区: {{currentVideo.area[0]}}</div>
              <div class="text-h6">简介: {{currentVideo.des[0]}}</div>
              <div class="text-h6">导演: {{currentVideo.director[0]}}</div>
              <div class="text-h6">语言: {{currentVideo.lang[0]}}</div>
              <div class="text-h6">时间: {{currentVideo.last[0]}}</div>
              <div class="text-h6">备注: {{currentVideo.note[0]}}</div>
              <div class="text-h6">
                图片:
                <q-img
                  :src="currentVideo.pic[0]"
                  spinner-color="white"
                  style="height: 140px; max-width: 150px"
                />
              </div>
              <div class="text-h6">评分: {{currentVideo.state[0]}}</div>
              <div class="text-h6">类型: {{currentVideo.type[0]}}</div>
              <div class="text-h6">年份: {{currentVideo.year[0]}}</div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-table
          title="分集信息"
          :data="episodeInfo"
          :columns="columns"
          row-key="name"
        >
          <q-td
            slot="body-cell-actions"
            slot-scope="props"
            :props="props"
          >
            <q-chip
              v-if="currentEpisode.url === props.row.url"
              icon="play_arrow"
              size="10px"
            >正在播放</q-chip>
            <q-btn
              v-else
              round
              color="primary"
              icon="play_arrow"
              @click="setCurrentEpisode(props)"
            />
          </q-td>
        </q-table>
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
      </q-scroll-area>
    </scrollWarp>
  </q-page>
</template>

<script>
import scrollWarp from 'components/scrollWarp';
import viewArea from 'components/viewArea';
import HlsPlayer from 'components/HlsPlayer';
import normalizeUrl from 'normalize-url';
import isAbsoluteUrl from 'is-absolute-url';
import { mapState } from 'vuex';
import { stringify } from 'query-string';
import Positioner from 'electron-positioner';
import _find from 'lodash/find';
import _get from 'lodash/get';

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
      columns: [
        {
          name: 'episode',
          label: '分集',
          field: 'episode',
          sortable: true,
        },
        {
          name: 'url',
          label: '链接',
          field: 'url',
          sortable: true,
        },
        {
          name: 'player',
          label: '播放器类型',
          field: 'player',
          sortable: true,
        },
        {
          name: 'actions',
          label: '操作',
        },
      ],
      episodeInfo: [],
      currentEpisode: {
        episode: '无',
        url: '',
        player: '无',
      },
    };
  },
  components: {
    HlsPlayer,
    scrollWarp,
    viewArea,
  },
  mounted() {
    const uris = _get(this.currentVideo, 'dl[0].dd[0]._', '');
    this.initUrl(uris);
    [this.currentEpisode] = this.episodeInfo;
  },
  watch: {
    currentVideo(currentVideo) {
      console.log('watch');
      const uris = _get(currentVideo, 'dl[0].dd[0]._', '');
      this.initUrl(uris);
      [this.currentEpisode] = this.episodeInfo;
    },
  },
  methods: {
    sliceUrl(str) {
      return str.split('#');
    },
    getUrlInfo(str) {
      const splitStr = str.split('$');
      const url = _find(splitStr, isAbsoluteUrl);
      if (splitStr.length === 3) {
        return {
          episode: splitStr[0],
          url,
          player: splitStr[2],
        };
      }
      return {
        episode: splitStr[0],
        url,
        player: '无',
      };
    },

    initUrl(str) {
      const slicedUrl = this.sliceUrl(str);
      const episodeInfo = slicedUrl.map(element => this.getUrlInfo(element));
      this.episodeInfo = episodeInfo;
    },
    normalizeUrl(url) {
      if (isAbsoluteUrl(url)) {
        return normalizeUrl(url);
      }
      return '';
    },
    setCurrentEpisode(props) {
      this.currentEpisode = props.row;
    },
    pause() {
      const { player } = this.$refs.player;
      player.pause();
    },
    goback() {
      this.$router.go(-1);
    },
    minimize() {
      const { BrowserWindow, getCurrentWindow } = this.$q.electron.remote;
      this.pause();
      const videoInfo = JSON.stringify(this.currentVideo);
      const episodeInfo = JSON.stringify(this.currentEpisode);
      const encodeUrl = stringify({ video: videoInfo, episode: episodeInfo });
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
    errorHandler(event, data) {
      if (data.details && data.details === 'manifestLoadError') {
        this.$q.dialog({
          title: '错误',
          message: '无法加载资源',
          persistent: true,
        });
      }
    },
  },
  computed: {
    ...mapState({
      currentVideo: state => state.video.currentVideo,
    }),
    thumbStyle() {
      return {
        right: '2px',
        borderRadius: '5px',
        backgroundColor: '#027be3',
        width: '5px',
        opacity: 0.75,
      };
    },
  },
};
</script>

<style>
</style>
