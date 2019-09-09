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
          :error="error"
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

import { Subject, of } from 'rxjs';

import {
  pluck,
  switchMap,
  tap,
  map,
  concatMap,
  catchError,
} from 'rxjs/operators';

// rxjs

import {
  getList as rxGetList,
  getDetail as rxGetDetail,
} from '../api/rx/maccms-v8.js';
import { parseXML as rxParseXML } from '../utils/rx/parse-xml.js';

export default {
  data() {
    return {
      loading: true,
      error: false,
      keyWord: '',
      tab: '',
      videoClass: [],
      left: this.$q.screen.gt.sm,
      httoOrHttps: false,
      ids: [],
      page: 1,
      total: 0,
      videoList: [],
      source$: new Subject(),
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
    this.rxFetch();
  },
  watch: {
    tab() {
      console.log('watch.tab', this.tab);
      this.setCurrentClass('all');
      this.page = 1;
      this.setCurrentSiteId(this.tab);
      if (this.$route.path !== '/') {
        this.$router.push('/');
      }
      this.source$.next();
    },
  },
  methods: {
    ...mapMutations([
      'setCurrentSiteId',
      'setCurrentClass',
      'setCurrentVideo',
      'setSiteList',
    ]),

    rxFetch() {
      console.log('call:rxFetch');
      const fetch$ = this.source$
        .pipe(
          map(() => this.tab),
          tap((value) => {
            console.log('rxFetch.tab', value);
            this.loading = true;
            this.error = false;
            this.$q.loadingBar.stop();
            this.$q.loadingBar.start();
          }),
          map(() => this.currentUri),
          switchMap((url) => {
            console.log('call:rxGetList');
            console.log('rxGetList.page', this.page);
            const params = {
              pg: this.page,
            };
            if (this.currentClass !== 'all') {
              params.t = this.currentClass;
            }
            if (this.keyWord) {
              params.wd = this.keyWord;
            }
            return rxGetList(url, params).pipe(
              pluck('data'),
              concatMap(rxParseXML),
              tap((value) => {
                console.log('rxGetList->response.data->parseXML', value);
                this.videoClass = value.rss.class[0].ty;
                this.total = _toInteger(value.rss.list[0].$.pagecount);
              }),
              map((value) => {
                // get video detail
                const videoInfo = _get(value, 'rss.list[0].video', []);
                return videoInfo.map(item => item.id[0]);
              }),
              concatMap((value) => {
                console.log('call:rxGetDetail');
                if (value.length !== 0) {
                  return rxGetDetail(this.currentUri, {
                    ids: value,
                  }).pipe(
                    pluck('data'),
                    concatMap(rxParseXML),
                  );
                }

                return of([]);
              }),
              catchError(() => {
                this.loading = false;
                this.error = true;
                this.$q.loadingBar.stop();
                return of([]);
              }),
            );
          }),
        );
      this.$subscribeTo(fetch$,
        (value) => {
          console.log('rxFetch.next', value);
          this.videoList = _get(value, 'rss.list[0].video', []);
          this.loading = false;
          this.$q.loadingBar.stop();
        },
        (err) => {
          console.log('rxFetch.error');
          console.error(err);
          this.loading = false;
          this.error = true;
          this.$q.loadingBar.stop();
          this.rxFetch();
        },
        () => {
          this.loading = false;
          this.$q.loadingBar.stop();
          console.log('rxFetch.complete');
        });
    },
    configClick() {
      this.$router.push('/config');
    },
    changeClass(currentClass) {
      this.setCurrentClass(currentClass);
      this.source$.next();
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
                this.fetchSearch();
              });
          } else {
            this.$store.commit('setKeyWord', this.keyWord);
            this.fetchSearch();
          }
        } catch (error) {
          this.$store.commit('setKeyWord', this.keyWord);
          this.fetchSearch();
          console.error(error);
        }
      } else {
        this.$store.commit('setKeyWord', this.keyWord);
        this.fetchSearch();
      }
    },
    pageChange(value) {
      console.log('call:pageChange');
      console.log('pageChange.page', value);
      if (this.page !== value) {
        this.page = value;
        this.source$.next();
      }
    },
    fetchSearch() {
      console.log('call:fetchSearch');
      this.setCurrentClass('all');
      this.page = 1;
      this.source$.next();
      this.$router.push('/');
    },
  },
  computed: {
    ...mapGetters(['currentSite']),
    ...mapState({
      siteList: state => state.site.siteList,
      currentClass: state => state.site.currentClass,
      globalKw: state => state.site.keyWord,
      https: state => state.app.https,
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
