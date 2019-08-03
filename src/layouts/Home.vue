<template>
  <q-layout
    view="hHh lpR fFf"
    class="fit"
  >
    <q-header
      elevated
      class="bg-primary text-white"
    >
      <q-bar class="q-electron-drag">
        <q-avatar
          square
          color="orange"
        >H</q-avatar>
        <div>H-PLAYER</div>

        <q-space />

        <q-btn
          dense
          flat
          round
          icon="settings"
          @click="right = !right"
        />

        <q-btn
          dense
          flat
          icon="minimize"
          @click="minimize"
        />
        <q-btn
          dense
          flat
          icon="crop_square"
          @click="maximize"
        />
        <q-btn
          dense
          flat
          icon="close"
          @click="closeApp"
        />
      </q-bar>

      <q-toolbar>
        <q-btn
          dense
          flat
          round
          icon="menu"
          @click="left = !left"
        />

        <q-space></q-space>

        <q-btn
          dense
          flat
          round
          icon="search"
          @click="left = !left"
        />
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
      <div class="row serch">
        <div class="col">
          <q-input
            clearable
            borderless
            v-model="keyWord"
            label="请输入关键字"
            @keyup.enter="search"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </div>
      <q-separator />
      <q-scroll-area
        :thumb-style="thumbStyle"
        class="class-list"
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
        <q-inner-loading :showing="loading">
          <q-spinner-gears
            size="50px"
            color="primary"
          />
        </q-inner-loading>
      </q-scroll-area>
    </q-drawer>

    <q-drawer
      v-model="right"
      side="right"
      bordered
    >
      <q-scroll-area class="fit">
        <q-list>
          <q-item
            clickable
            v-ripple
          >
            <q-item-section>
              <span class="text-h6">网站设置</span>
            </q-item-section>
          </q-item>
          <q-separator></q-separator>
          <q-item
            clickable
            v-ripple
          >
            <q-item-section>
              <q-toggle
                v-model="https"
                label="是否使用https"
              />
            </q-item-section>
          </q-item>
          <q-item
            clickable
            v-ripple
          >
            <q-item-section>
              <span class="text-h6">视频源设置</span>
            </q-item-section>
          </q-item>
          <q-separator></q-separator>
          <q-item
            clickable
            v-ripple
          >
            <q-item-section>
              <q-btn
                color="primary"
                label="导入视频源"
                @click="gotoImport"
              />
            </q-item-section>
          </q-item>
          <q-item
            clickable
            v-ripple
          >
            <q-item-section>
              <q-btn
                color="red"
                label="清空视频源"
                @click="clearSource"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
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
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar
            square
            size="24px"
            color="orange"
          >H</q-avatar>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex';
import util from 'util';
import { parseString } from 'xml2js';

const Store = require('electron-store');

const store = new Store();

const ipc = require('electron').ipcRenderer;

const parseStringSync = util.promisify(parseString);

export default {
  data() {
    return {
      loading: true,
      keyWord: '',
      tab: 1,
      videoClass: [],
      left: this.$q.platform.is.desktop,
      right: false,
      httoOrHttps: false,
    };
  },
  beforeRouteEnter(from, to, next) {
    const storeSiteList = store.get('siteList');
    if (!storeSiteList || storeSiteList.length === 0) {
      next('/import');
    }

    next();
  },
  created() {
    const storeSiteList = this.$electronStore.get('siteList');
    this.setSiteList(storeSiteList);
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
      if (this.keyWord === null) {
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
        .catch(console.error)
        .finally(() => {
          this.loading = false;
        });
    },
    changeClass(currentClass) {
      this.setCurrentClass(currentClass);
      this.$router.push('/');
    },
    search() {
      this.$store.commit('setKeyWord', this.keyWord);
    },
    gotoPlayer(video) {
      this.setCurrentVideo(video);
      this.$router.push('/video');
    },
    async gotoImport() {
      this.$router.replace({
        path: 'import',
        query: {
          canclable: true,
        },
      });
    },
    clearSource() {
      this.$electronStore.clear();
      this.$router.replace('/import');
    },
    minimize() {
      if (process.env.MODE === 'electron') {
        this.$q.electron.remote.BrowserWindow.getFocusedWindow().minimize();
      }
    },

    maximize() {
      if (process.env.MODE === 'electron') {
        const win = this.$q.electron.remote.BrowserWindow.getFocusedWindow();

        if (win.isMaximized()) {
          win.unmaximize();
        } else {
          win.maximize();
        }
      }
    },

    closeApp() {
      if (process.env.MODE === 'electron') {
        this.$q.electron.remote.BrowserWindow.getFocusedWindow().close();
      }
    },
  },
  computed: {
    ...mapGetters(['currentSite']),
    ...mapState({
      siteList: state => state.site.siteList,
      currentClass: state => state.site.currentClass,
    }),
    https: {
      get() {
        return this.$store.state.app.https;
      },
      set(value) {
        this.$store.commit('setHttps', value);
      },
    },
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

<style lang="stylus">
// .q-layout, .q-page {
// min-height: inherit !important;
// }
.serch {
  margin-top: 24px;
}

.class-list {
  height: calc(100% - 100px);
}
</style>
