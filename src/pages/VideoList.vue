<template>
  <q-page
    padding
    class="flex"
  >
    <scroll-warp>
      <div
        v-show="empty && !error"
        class="fit flex justify-center items-center"
      >
        <div class="text-center">
          <q-icon
            name="cloud_off"
            style="font-size: 4rem;"
          />
          <div>暂无数据</div>
        </div>
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
          <div>加载数据失败</div>
        </div>
      </div>
      <q-scroll-area
        v-show="!error && !empty"
        :thumb-style="thumbStyle"
        class="fit"
      >
        <div>
          <div class="q-pa-md row items-start justify-center q-gutter-md">
            <q-card
              class="my-card cursor-pointer"
              v-for="video in videoList"
              :key="video.id[0]"
              @click="gotoPlayer(video)"
            >
              <div v-if="imageVisable[video.id[0]]">
                <q-btn
                  round
                  size="xs"
                  color="primary"
                  icon="switch_camera"
                  class="absolute-top-right"
                  style="z-index:100;"
                  @click.stop.prevent="showImage(video)"
                />
                <q-img
                  :src="video.pic[0]"
                  spinner-color="red"
                  style="height: 200px;width: 290px"
                >
                  <div
                    class="absolute-bottom ellipsis text-subtitle1 text-center q-pa-xs"
                  >{{video.name[0]}}</div>
                  <template v-slot:error>
                    <div class="absolute-full flex flex-center bg-negative text-white">
                      <span>Cannot load image</span>
                      <div
                        class="absolute-bottom ellipsis text-subtitle1 text-center q-pa-xs"
                      >{{video.name[0]}}</div>
                    </div>
                  </template>
                </q-img>
              </div>
              <div v-else>
                <q-btn
                  round
                  size="xs"
                  color="primary"
                  icon="switch_camera"
                  class="absolute-top-right"
                  style="z-index:100;"
                  @click.stop.prevent="showImage(video)"
                />
                <q-img
                  src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg=="
                  spinner-color="red"
                  style="height: 200px;width: 290px"
                >
                  <div
                    class="absolute-bottom ellipsis text-subtitle1 text-center q-pa-xs"
                  >{{video.name[0]}}</div>
                  <template v-slot:error>
                    <div class="absolute-full flex flex-center bg-negative text-white">
                      <span>Cannot load image</span>
                      <div
                        class="absolute-bottom ellipsis text-subtitle1 text-center q-pa-xs"
                      >{{video.name[0]}}</div>
                    </div>
                  </template>
                </q-img>
              </div>
              <q-card-section>
                <div class="text-h6 ellipsis title">
                  {{video.name[0]}}
                  <q-tooltip>{{video.name[0]}}</q-tooltip>
                </div>
                <q-chip
                  square
                  color="teal"
                  text-color="white"
                  icon="bookmark"
                >{{video.type[0]}}</q-chip>
                <q-chip
                  square
                  color="teal"
                  text-color="white"
                  icon="event"
                >{{video.last[0]}}</q-chip>
              </q-card-section>
            </q-card>
          </div>
          <div class="q-pa-lg flex flex-center">
            <q-pagination
              :value="page"
              @input="changePage"
              :max="total"
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
import { mapGetters, mapMutations, mapState } from 'vuex';
import _fromPairs from 'lodash/fromPairs';

export default {
  name: 'VideoList',
  props: {
    page: {
      type: Number,
      default: 1,
    },
    total: {
      type: Number,
      default: 0,
    },
    loading: {
      type: Boolean,
      default: true,
    },
    error: {
      ype: Boolean,
      default: false,
    },
    videoList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      imageVisable: {},
    };
  },
  watch: {
    videoList() {
      if (this.loadImage) {
        const pairs = this.videoList.map(video => [video.id, true]);
        const visableMap = _fromPairs(pairs);
        this.imageVisable = visableMap;
      } else {
        const pairs = this.videoList.map(video => [video.id, false]);
        const visableMap = _fromPairs(pairs);
        this.imageVisable = visableMap;
      }
    },
  },
  components: {
    scrollWarp,
  },
  methods: {
    ...mapMutations(['setCurrentVideo']),
    changePage(value) {
      this.$emit('page-change', value);
    },
    gotoPlayer(video) {
      this.setCurrentVideo(video);
      this.$router.push('/video');
    },
    showImage(video) {
      this.imageVisable[video.id[0]] = !this.imageVisable[video.id[0]];
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
    empty() {
      return !this.videoList || this.videoList.length === 0;
    },
    loadImage: {
      get() {
        return this.$store.state.app.loadImage;
      },
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
