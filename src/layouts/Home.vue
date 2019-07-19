<template>
  <q-layout
    view="hHh lpR fFf"
    class="fit"
  >
    <q-header
      elevated
      class="bg-primary text-white"
    >
      <q-toolbar>
        <q-btn
          dense
          flat
          round
          icon="menu"
          @click="left = !left"
        />

        <q-toolbar-title>
          <q-avatar
            square
            size="24px"
            color="orange"
          >H</q-avatar>
        </q-toolbar-title>

        <q-btn
          dense
          flat
          round
          icon="settings"
          @click="right = !right"
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
    </q-drawer>

    <q-drawer
      v-model="right"
      side="right"
      bordered
    >
      <q-form class="q-gutter-md">
        <q-toggle
          v-model="https"
          label="是否使用https"
        />
      </q-form>
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
  created() {
    ipc.on('from-mini', (event, message) => {
      this.gotoPlayer(message);
    });
  },
  watch: {
    tab: {
      handler() {
        this.setCurrentClass('all');
        this.setCurrentSiteId(this.tab);
        this.getClass();
        this.$router.push('/');
      },
      immediate: true,
    },
    keyWord() {
      if (this.keyWord === null) {
        this.$store.commit('setKeyWord', this.keyWord);
      }
    },
  },
  methods: {
    ...mapMutations(['setCurrentSiteId', 'setCurrentClass', 'setCurrentVideo']),
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
  },
};
</script>

<style lang="stylus">
.q-layout, .q-page {
  min-height: inherit !important;
}

.serch {
  margin-top: 24px;
}
</style>
