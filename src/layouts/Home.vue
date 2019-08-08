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
              v-for="classInfo in videoClass"
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
        <router-view />
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
import util from 'util';
import isAbsoluteUrl from 'is-absolute-url';
import { parseString } from 'xml2js';

import { URL } from 'url';
import path from 'path';
import { stringify } from 'query-string';

const parseStringSync = util.promisify(parseString);

export default {
  data() {
    return {
      loading: true,
      error: false,
      keyWord: '',
      tab: 1,
      videoClass: [],
      left: this.$q.platform.is.desktop,
      httoOrHttps: false,
    };
  },
  components: {
    titleBar,
    footerContent,
  },
  created() {
    const storeSiteList = this.$electronStore.get('siteList');
    this.setSiteList(storeSiteList);
    const ipc = this.$q.electron.ipcRenderer;
    ipc.on('from-mini', (event, message) => {
      this.gotoPlayer(message);
    });
    this.setCurrentClass('all');
    this.setCurrentSiteId(this.tab);
    this.getClass();
    this.$router.push('/');
  },
  watch: {
    tab() {
      this.setCurrentClass('all');
      this.setCurrentSiteId(this.tab);
      this.getClass();
      this.$router.push('/');
    },
    keyWord() {
      if (this.keyWord === '') {
        this.$store.commit('setKeyWord', this.keyWord);
      }
    },
  },
  methods: {
    ...mapMutations([
      'setCurrentSiteId',
      'setCurrentClass',
      'setCurrentVideo',
      'setSiteList',
    ]),
    getClass() {
      this.loading = true;
      this.error = false;
      this.$axios(this.currentSite.httpsApi, {
        params: {
          ac: 'list',
        },
      })
        .then(res => parseStringSync(res.data, { explicitArray: false }))
        .then((data) => {
          this.videoClass = data.rss.class.ty;
          this.videoClass.unshift({
            _: '全部',
            $: {
              id: 'all',
            },
          });
        })
        .catch((err) => {
          this.error = true;
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    configClick() {
      this.$router.push('/config');
    },
    changeClass(currentClass) {
      this.setCurrentClass(currentClass);
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
  },
  computed: {
    ...mapGetters(['currentSite']),
    ...mapState({
      siteList: state => state.site.siteList,
      currentClass: state => state.site.currentClass,
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

<style lang="stylus"></style>
