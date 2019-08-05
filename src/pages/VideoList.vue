<template>
  <q-page
    padding
    class="flex"
  >
    <scroll-warp>
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
          <div>加载视频列表失败</div>
        </div>
      </div>
      <q-scroll-area
        v-show="!error"
        :thumb-style="thumbStyle"
        class="fit"
      >
        <div>
          <div class="q-pa-md row items-start justify-center q-gutter-md">
            <q-card
              class="my-card cursor-pointer"
              v-for="video in videoList"
              :key="video.id"
              @click="gotoPlayer(video)"
            >
              <q-img
                :src="video.pic"
                spinner-color="red"
                style="height: 200px;width: 290px"
              >
                <div
                  class="absolute-bottom ellipsis text-subtitle1 text-center q-pa-xs"
                >{{video.name}}</div>
                <template v-slot:error>
                  <div class="absolute-full flex flex-center bg-negative text-white">
                    <span>Cannot load image</span>
                    <div
                      class="absolute-bottom ellipsis text-subtitle1 text-center q-pa-xs"
                    >{{video.name}}</div>
                  </div>
                </template>
              </q-img>
              <q-card-section>
                <div class="text-h6 ellipsis title">
                  {{video.name}}
                  <q-tooltip>{{video.name}}</q-tooltip>
                </div>
                <q-chip
                  square
                  color="teal"
                  text-color="white"
                  icon="bookmark"
                >{{video.type}}</q-chip>
                <q-chip
                  square
                  color="teal"
                  text-color="white"
                  icon="event"
                >{{video.last}}</q-chip>
              </q-card-section>
            </q-card>
          </div>
          <div class="q-pa-lg flex flex-center">
            <q-pagination
              v-model="pagination.page"
              :max="pagination.total"
              :input="true"
            ></q-pagination>
          </div>
        </div>
      </q-scroll-area>
      <q-inner-loading :showing="loading">
        <q-spinner-gears
          size="4rem"
          color="primary"
        />
      </q-inner-loading>
    </scroll-warp>
  </q-page>
</template>

<script>
import scrollWarp from 'components/scrollWarp';
import util from 'util';
import { parseString } from 'xml2js';
import _toInteger from 'lodash/toInteger';
import { mapGetters, mapMutations, mapState } from 'vuex';

const parseStringSync = util.promisify(parseString);
export default {
  name: 'VideoList',
  data() {
    return {
      loading: true,
      error: false,
      videoList: [],
      pagination: {
        page: 1,
        total: 0,
      },
      scrollStyle: {
        height: 0,
      },
    };
  },
  components: {
    scrollWarp,
  },
  mounted() {
    this.getVideoList(1);
  },
  watch: {
    // eslint-disable-next-line func-names
    'pagination.page': function (value) {
      this.getVideoList(value);
    },
    currentSite() {
      this.pagination.page = 1;
      this.getVideoList(1);
    },
    currentClass() {
      this.pagination.page = 1;
      this.getVideoList(1);
    },
    keyWord(newKeyWord, oldKeyWord) {
      if (newKeyWord !== oldKeyWord) {
        this.pagination.page = 1;
        this.getVideoList(1);
      }
    },
  },
  methods: {
    ...mapMutations(['setCurrentVideo']),
    getVideoList(page) {
      this.loading = true;
      this.error = false;
      this.$q.loadingBar.start();
      const params = {
        ac: 'videolist',
        pg: page,
      };
      if (this.currentClass !== 'all') {
        params.t = this.currentClass;
      }
      if (this.keyWord) {
        params.wd = this.keyWord;
      }
      const uri = this.https
        ? this.currentSite.httpsApi
        : this.currentSite.httpApi;
      this.$axios(uri, {
        params,
      })
        .then(res => parseStringSync(res.data, { explicitArray: false }))
        .then((data) => {
          this.videoList = data.rss.list.video;
          this.pagination.total = _toInteger(data.rss.list.$.pagecount);
        })
        .catch((error) => {
          console.error(error);
          this.error = true;
        })
        .finally(() => {
          this.loading = false;
          this.$q.loadingBar.stop();
        });
    },
    gotoPlayer(video) {
      this.setCurrentVideo(video);
      this.$router.push('/video');
    },
    search() {
      this.pagination.page = 1;
      this.getVideoList(1);
    },
  },
  computed: {
    ...mapGetters(['currentSite']),
    ...mapState({
      currentClass: state => state.site.currentClass,
      https: state => state.app.https,
      keyWord: state => state.site.keyWord,
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

<style lang="stylus">
.my-card {
  width: 100%;
  max-width: 290px;

  .title {
    margin: 4px;
  }
}
</style>
