<template>
  <q-layout
    view="hHh lpR fFf"
    class="fit"
  >
    <q-header
      elevated
      class="bg-primary text-white"
    >
      <title-bar @config="configClick"></title-bar>

      <q-toolbar>
        <q-btn
          dense
          flat
          round
          icon="menu"
          @click="left = !left"
        />

        <q-space></q-space>

        <q-input
          dark
          dense
          standout
          v-model="keyWord"
          input-class="text-right"
          class="q-ml-md"
          @keyup.enter="search"
        >
          <template v-slot:append>
            <q-icon
              v-if="keyWord === ''"
              name="search"
            />
            <q-icon
              v-else
              name="clear"
              class="cursor-pointer"
              @click="keyWord = ''"
            />
          </template>
        </q-input>
      </q-toolbar>

      <q-tabs
        v-model="tab"
        align="left"
      >
        <q-tab
          v-for="site in siteList"
          :key="site.id"
          :name="site.id"
          :label="site.name"
        />
      </q-tabs>
    </q-header>

    <q-drawer
      v-model="left"
      side="left"
      bordered
    >
      <div
        class="fit"
        v-show="!error"
      >
        <q-scroll-area
          :thumb-style="thumbStyle"
          class="fit"
        >
          <q-list separator>
            <q-item
              v-for="classInfo in processdVideoClass"
              :key="classInfo.$.id"
              clickable
              v-ripple
              @click="changeClass(classInfo.$.id)"
              :active="currentClass === classInfo.$.id"
            >
              <q-item-section>{{ classInfo._ }}</q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
        <q-inner-loading :showing="loading">
          <q-spinner-gears
            size="4rem"
            color="primary"
          />
        </q-inner-loading>
      </div>
      <div
        v-show="error"
        class="fit flex justify-center items-center"
      >
        <div class="text-center">
          <q-icon
            name="warning"
            class="text-red"
            style="font-size: 4rem;"
          />
          <div>加载分类失败</div>
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <navigation>
        <router-view
          :videoList="videoList"
          :loading="loading"
          :total="total"
          :page="page"
          @page-change="pageChange"
        />
      </navigation>
    </q-page-container>

    <q-footer
      elevated
      class="bg-grey-8 text-white"
    >
      <footer-content></footer-content>
    </q-footer>
  </q-layout>
</template>

<script>
import titleBar from 'components/titleBar';
import footerContent from 'components/footerContent';
import { mapState, mapMutations, mapGetters } from 'vuex';
import isAbsoluteUrl from 'is-absolute-url';
import { URL } from 'url';
import path from 'path';
import { stringify } from 'query-string';
import _toInteger from 'lodash/toInteger';
import _get from 'lodash/get';
import { getList, getDetail } from '../api/maccms-v8.js';
import { parseXML } from '../utils/parse-xml.js';

export default {
  data() {
    return {
      loading: true,
      error: false,
      keyWord: '',
      tab: '',
      videoClass: [],
      left: this.$q.platform.is.desktop,
      httoOrHttps: false,
      ids: [],
      page: 1,
      total: 0,
      videoList: [],
    };
  },
  components: {
    titleBar,
    footerContent,
  },
  created() {
    if (!this.siteList || this.siteList.length === 0) {
      this.$router.push('/import');
    } else {
      this.setCurrentClass('all');
      this.tab = this.siteList[0].id;
      this.setCurrentSiteId(this.tab);
    }
  },
  watch: {
    tab() {
      console.log('tab');
      this.setCurrentClass('all');
      this.setCurrentSiteId(this.tab);
      this.page = 1;
      this.fetchInfo();
      this.$router.push('/');
    },
    globalKw() {
      console.log('globalKw');
      this.setCurrentClass('all');
      this.page = 1;
      this.fetchInfo();
    },
  },
  methods: {
    ...mapMutations([
      'setCurrentSiteId',
      'setCurrentClass',
      'setCurrentVideo',
      'setSiteList',
    ]),

    async getVideoList() {
      this.loading = true;
      this.error = false;
      const uri = this.currentUri;
      // get video list and class
      const params = {
        pg: this.page,
      };
      if (this.currentClass !== 'all') {
        params.t = this.currentClass;
      }
      if (this.keyWord) {
        params.wd = this.keyWord;
      }
      const listResponse = await getList(uri, params);
      const parsedList = await parseXML(listResponse.data);
      this.videoClass = parsedList.rss.class[0].ty;
      this.total = _toInteger(parsedList.rss.list[0].$.pagecount);
      // get video detail
      const videoInfo = _get(parsedList, 'rss.list[0].video', []);
      this.ids = videoInfo.map(item => item.id[0]);
    },

    async getVideoDetail() {
      this.loading = true;
      this.error = false;
      const detailResponse = await getDetail(this.currentUri, {
        ids: this.ids,
      });
      const parsedDetail = await parseXML(detailResponse.data);
      this.videoList = _get(parsedDetail, 'rss.list[0].video', []);
    },

    async fetchInfo() {
      console.log('fetchInfo');
      try {
        this.loading = true;
        this.error = false;
        this.$q.loadingBar.start();
        await this.getVideoList();
        if (this.ids.length !== 0) {
          await this.getVideoDetail();
        } else {
          this.videoList = [];
        }
      } catch (error) {
        this.error = true;
        console.error(error);
      } finally {
        this.loading = false;
        this.$q.loadingBar.stop();
      }
    },
    configClick() {
      this.$router.push('/config');
    },
    changeClass(currentClass) {
      this.setCurrentClass(currentClass);
      this.fetchInfo();
      this.$router.push('/');
    },
    gotoPlayer(video) {
      this.setCurrentVideo(video);
      this.$router.push('/video');
    },
    directVideo() {
      const { BrowserWindow, getCurrentWindow } = this.$q.electron.remote;
      const videoInfo = JSON.stringify({
        url: this.keyWord,
      });
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
      win.loadURL(`${process.env.APP_URL}#/direct-video?${encodeUrl}`);
    },
    search() {
      if (isAbsoluteUrl(this.keyWord)) {
        try {
          const url = new URL(this.keyWord);
          const { pathname } = url;
          const extname = path.extname(pathname);
          if (extname === '.m3u8') {
            this.$q
              .dialog({
                title: '播放',
                message: '检测到搜索参数是hls流链接，是否播放',
                cancel: true,
                persistent: true,
              })
              .onOk(() => {
                this.directVideo();
              })
              .onCancel(() => {
                this.$store.commit('setKeyWord', this.keyWord);
              });
          } else {
            this.$store.commit('setKeyWord', this.keyWord);
          }
        } catch (error) {
          this.$store.commit('setKeyWord', this.keyWord);
          console.error(error);
        }
      } else {
        this.$store.commit('setKeyWord', this.keyWord);
      }
    },
    pageChange(value) {
      console.log('pageChange');
      this.page = value;
      if (this.page !== 1) {
        this.fetchInfo();
      }
    },
  },
  computed: {
    ...mapGetters(['currentSite']),
    ...mapState({
      siteList: state => state.site.siteList,
      currentClass: state => state.site.currentClass,
      globalKw: state => state.site.keyWord,
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
    processdVideoClass() {
      return [
        {
          _: '全部',
          $: {
            id: 'all',
          },
        },
      ].concat(this.videoClass);
    },
    currentUri() {
      return this.https ? this.currentSite.httpsApi : this.currentSite.httpApi;
    },
  },
};
</script>

<style lang="stylus"></style>
