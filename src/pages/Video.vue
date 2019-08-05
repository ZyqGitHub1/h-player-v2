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
            ref="player"
          ></hls-player>
        </viewArea>
        <q-expansion-item
          icon="info"
          :label="`${currentVideo.name}-${currentEpisode.episode}`"
          header-class="bg-primary text-white"
          expand-icon-class="text-white"
        >
          <q-card>
            <q-card-section>
              <div class="text-h6">演员: {{currentVideo.actor}}</div>
              <div class="text-h6">地区: {{currentVideo.area}}</div>
              <div class="text-h6">简介: {{currentVideo.des}}</div>
              <div class="text-h6">导演: {{currentVideo.director}}</div>
              <div class="text-h6">语言: {{currentVideo.lang}}</div>
              <div class="text-h6">时间: {{currentVideo.last}}</div>
              <div class="text-h6">备注: {{currentVideo.note}}</div>
              <div class="text-h6">
                图片:
                <q-img
                  :src="currentVideo.pic"
                  spinner-color="white"
                  style="height: 140px; max-width: 150px"
                />
              </div>
              <div class="text-h6">评分: {{currentVideo.state}}</div>
              <div class="text-h6">类型: {{currentVideo.type}}</div>
              <div class="text-h6">年份: {{currentVideo.year}}</div>
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
    this.initUrl(this.currentVideo.dl.dd._);
    [this.currentEpisode] = this.episodeInfo;
  },
  methods: {
    sliceUrl(str) {
      return str.split('#');
    },
    getUrlInfo(str) {
      const splitStr = str.split('$');
      if (splitStr.length === 3) {
        return {
          episode: splitStr[0],
          url: splitStr[1],
          player: splitStr[2],
        };
      }
      return {
        episode: '无',
        url: splitStr[0],
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
      this.pause();
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
