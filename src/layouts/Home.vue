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
import titleBar from 'components/titlebar';
import { mapState, mapMutations, mapGetters } from 'vuex';
import util from 'util';
import { parseString } from 'xml2js';

const Store = require('electron-store');

const store = new Store();

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
      right: false,
      httoOrHttps: false,
    };
  },
  components: {
    titleBar,
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
      this.right = !this.right;
    },
    changeClass(currentClass) {
      this.setCurrentClass(currentClass);
      this.$router.push('/');
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
    search() {
      this.$store.commit('setKeyWord', this.keyWord);
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
