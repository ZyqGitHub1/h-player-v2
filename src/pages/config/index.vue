<template>
  <q-page class="flex">
    <scroll-warp>
      <q-scroll-area
        :thumb-style="thumbStyle"
        class="fit"
      >
        <div class="text-h4 q-pa-sm">视频源设置</div>
        <q-separator></q-separator>
        <div class="q-pa-sm">
          <q-btn
            color="primary"
            label="导入视频源"
            @click="openDialog"
          />
        </div>
        <div class="q-pa-sm">
          <q-table
            title="Treats"
            :data="data"
            :columns="columns"
            row-key="id"
            :filter="filter"
            :loading="loading"
          >
            <template v-slot:top>
              <q-btn
                flat
                dense
                color="primary"
                :disable="loading"
                label="添加"
                @click="addRow"
              />
              <q-btn
                flat
                dense
                color="primary"
                :disable="loading"
                label="排序"
                @click="showSort"
              />
              <q-space />
              <q-input
                borderless
                dense
                debounce="300"
                color="primary"
                v-model="filter"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td
                  key="id"
                  :props="props"
                >{{ props.row.id }}</q-td>
                <q-td
                  key="name"
                  :props="props"
                >
                  {{ props.row.name }}
                  <q-popup-edit
                    v-model="props.row.name"
                    buttons
                  >
                    <q-input
                      v-model="props.row.name"
                      dense
                      autofocus
                      counter
                    />
                  </q-popup-edit>
                </q-td>
                <q-td
                  key="uri"
                  :props="props"
                >
                  {{ props.row.uri }}
                  <q-popup-edit
                    v-model="props.row.uri"
                    buttons
                  >
                    <q-input
                      v-model="props.row.uri"
                      dense
                      autofocus
                      counter
                    />
                  </q-popup-edit>
                </q-td>
                <q-td
                  key="httpApi"
                  :props="props"
                >
                  <div class="text-pre-wrap">{{ props.row.httpApi }}</div>
                  <q-popup-edit
                    v-model="props.row.httpApi"
                    buttons
                  >
                    <q-input
                      v-model="props.row.httpApi"
                      dense
                      autofocus
                    />
                  </q-popup-edit>
                </q-td>
                <q-td
                  key="httpsApi"
                  :props="props"
                >
                  <div class="text-pre-wrap">{{ props.row.httpsApi }}</div>
                  <q-popup-edit
                    v-model="props.row.httpsApi"
                    buttons
                  >
                    <q-input
                      v-model="props.row.httpsApi"
                      dense
                      autofocus
                    />
                  </q-popup-edit>
                </q-td>
                <q-td
                  key="type"
                  :props="props"
                >
                  <div class="text-pre-wrap">{{ props.row.type }}</div>
                  <q-popup-edit
                    v-model="props.row.type"
                    buttons
                  >
                    <q-input
                      v-model="props.row.type"
                      dense
                      autofocus
                    />
                  </q-popup-edit>
                </q-td>
                <q-td
                  key="action"
                  :props="props"
                >
                  <q-btn
                    dense
                    flat
                    color="red"
                    icon="close"
                    @click="deleteRow(props)"
                  />
                </q-td>
              </q-tr>
            </template>
          </q-table>
          <q-dialog
            v-model="addDialog"
            persistent
          >
            <q-card style="min-width: 400px">
              <q-card-section class="row items-center">
                <div class="text-h6">添加视频源</div>
                <q-space />
                <q-btn
                  icon="close"
                  flat
                  round
                  dense
                  v-close-popup
                />
              </q-card-section>
              <q-card-section
                style="max-height: 50vh"
                class="scroll"
              >
                <q-input
                  v-model="addRowData.name"
                  ref="name"
                  autofocus
                  label="name"
                  :rules="[val => !!val || '必填项']"
                />
                <q-input
                  v-model="addRowData.uri"
                  label="url"
                />
                <q-input
                  v-model="addRowData.httpApi"
                  ref="httpApi"
                  label="httpApi"
                  :rules="[isUrl]"
                />
                <q-input
                  v-model="addRowData.httpsApi"
                  ref="httpsApi"
                  label="httpsApi"
                  :rules="[isUrl]"
                />
                <q-input
                  v-model="addRowData.type"
                  label="type"
                />
              </q-card-section>
              <q-card-actions
                align="right"
                class="text-primary"
              >
                <q-btn
                  flat
                  label="取消"
                  v-close-popup
                />
                <q-btn
                  flat
                  @click="addRowInTable"
                  label="确定"
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
          <q-dialog
            v-model="sortDialog"
            persistent
          >
            <q-card style="min-width: 400px">
              <q-card-section class="row items-center">
                <div class="text-h6">拖动排序</div>
                <q-space />
                <q-btn
                  icon="close"
                  flat
                  round
                  dense
                  v-close-popup
                />
              </q-card-section>
              <q-card-section
                style="max-height: calc(100vh - 200px)"
                class="scroll"
              >
                <dnd-sort @change-order="changeOrder"></dnd-sort>
              </q-card-section>
              <q-card-actions
                align="right"
                class="text-primary"
              >
                <q-btn
                  flat
                  label="取消"
                  v-close-popup
                />
                <q-btn
                  flat
                  @click="finishSort"
                  label="确定"
                  v-close-popup
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </div>
        <div class="q-pa-sm">
          <q-btn
            color="primary"
            label="导出视频源"
            @click="saveDialog"
          />
        </div>
        <div class="q-pa-sm">
          <q-btn
            color="red"
            label="清空视频源"
            @click="showClearConfirm"
          />
          <q-dialog
            v-model="clearConfirm"
            persistent
          >
            <q-card>
              <q-card-section class="row items-center">
                <q-avatar
                  icon="warning"
                  color="primary"
                  text-color="white"
                />
                <span class="q-ml-sm">清空视频源后需要重新导入或添加，请确定已备份当前视频源</span>
              </q-card-section>

              <q-card-actions align="right">
                <q-btn
                  flat
                  label="取消"
                  color="primary"
                  v-close-popup
                />
                <q-btn
                  flat
                  label="确定"
                  color="primary"
                  v-close-popup
                  @click="clearSource"
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </div>
        <div class="text-h4 q-pa-sm">全局设置</div>
        <q-separator></q-separator>
        <div>
          <q-toggle
            v-model="https"
            label="是否使用https"
          />
        </div>
        <div>
          <q-toggle
            v-model="loadImage"
            label="是否自动加载图片"
          />
        </div>
        <div class="q-ml-sm">
          <q-btn
            color="primary"
            icon="bug_report"
            label="打开开发者工具"
            @click="toggleDevTools"
          />
        </div>
        <div class="text-h4 q-pa-sm">软件信息</div>
        <q-separator></q-separator>
        <div class="q-pa-sm">
          <div>
            当前版本:
            <q-chip
              icon="computer"
              size="10px"
            >{{currentVersion}}</q-chip>
          </div>
          <div>
            最新版本:
            <q-chip
              icon="cloud"
              size="10px"
            >{{latestVersion}}</q-chip>
          </div>
        </div>
        <div class="q-pa-sm">
          <q-btn
            :loading="updateing"
            @click="checkUpdate"
            color="primary"
            icon="cloud_upload"
            label="检查更新"
          />
        </div>
        <div class="q-pa-sm">
          <q-btn
            @click="createIssue"
            color="red"
            icon="error"
            label="提交反馈"
          />
        </div>
      </q-scroll-area>
    </scroll-warp>
  </q-page>
</template>

<script>
import scrollWarp from 'components/scrollWarp';
import clonedeep from 'lodash/cloneDeep';
import { mapMutations, mapState } from 'vuex';
import { uid } from 'quasar';
import fs from 'fs-extra';
import { openNewGitHubIssue } from 'electron-util';
import isAbsoluteUrl from 'is-absolute-url';
import dndSort from './components/dndSort';

export default {
  name: 'Config',
  data() {
    return {
      leftDrawer: this.$q.platform.is.desktop,
      loading: false,
      updateing: false,
      filter: '',
      rowCount: 10,
      tempOrder: [],
      columns: [
        {
          name: 'id',
          required: true,
          label: 'id',
          align: 'left',
          field: 'id',
          sortable: true,
        },
        {
          name: 'name',
          align: 'center',
          label: 'name',
          field: 'name',
          sortable: true,
        },
        {
          name: 'uri',
          label: 'uri',
          field: 'uri',
          sortable: true,
        },
        { name: 'httpApi', label: 'httpApi', field: 'httpApi' },
        { name: 'httpsApi', label: 'httpsApi', field: 'httpsApi' },
        { name: 'type', label: 'type', field: 'type' },
        { name: 'action', label: '操作' },
      ],
      data: [],
      addDialog: false,
      sortDialog: false,
      clearConfirm: false,
      addRowData: {
        id: '',
        name: '',
        uri: '',
        httpApi: '',
        httpsApi: '',
        type: '',
      },
    };
  },
  watch: {
    data: {
      handler() {
        console.log('config->watch->data->handler');
        this.setSiteList(clonedeep(this.data));
      },
      deep: true,
    },
  },
  components: {
    scrollWarp,
    dndSort,
  },
  mounted() {
    this.data = clonedeep(this.siteList);
  },
  computed: {
    ...mapState({
      siteList: state => state.site.siteList,
      currentVersion: state => state.app.currentVersion,
      latestVersion: state => state.app.latestVersion,
    }),
    https: {
      get() {
        return this.$store.state.app.https;
      },
      set(value) {
        this.$store.commit('setHttps', value);
      },
    },
    loadImage: {
      get() {
        return this.$store.state.app.loadImage;
      },
      set(value) {
        this.$store.commit('setLoadImage', value);
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
  methods: {
    ...mapMutations(['setSiteList']),
    async openDialog() {
      const { dialog } = this.$q.electron.remote;
      const dialogResult = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'JSON', extensions: ['json'] }],
      });
      if (!dialogResult.canceled && dialogResult.filePaths) {
        const importedFile = await fs.readJSON(dialogResult.filePaths[0]);
        this.data = clonedeep(importedFile);
      }
    },
    async saveDialog() {
      const { dialog } = this.$q.electron.remote;
      const dialogResult = await dialog.showSaveDialog({
        defaultPath: 'source.json',
      });
      if (!dialogResult.canceled && dialogResult.filePath) {
        await fs.writeJson(dialogResult.filePath, this.siteList);
      }
    },
    addRow() {
      this.addDialog = true;
    },
    deleteRow(prop) {
      this.data = this.data.filter(element => element.id !== prop.row.id);
    },
    addRowInTable() {
      this.$refs.name.validate();
      this.$refs.httpApi.validate();
      this.$refs.httpsApi.validate();

      if (this.$refs.name.hasError || this.$refs.httpApi.hasError || this.$refs.httpsApi.hasError) {
        this.$q.notify({
          color: 'negative',
          message: '请完善添加的视频源信息',
        });
      } else {
        this.addRowData.id = uid();
        this.data.push(this.addRowData);
        this.addRowData = {
          id: '',
          name: '',
          uri: '',
          httpApi: '',
          httpsApi: '',
          type: '',
        };
        this.addDialog = false;
      }
    },
    showSort() {
      this.sortDialog = true;
      this.tempOrder = clonedeep(this.data);
    },
    changeOrder(list) {
      this.tempOrder = list;
    },
    finishSort() {
      this.data = this.tempOrder;
    },
    showClearConfirm() {
      this.clearConfirm = true;
    },
    clearSource() {
      this.$electronStore.clear();
      this.data = [];
    },
    checkUpdate() {
      this.updateing = true;
      this.$store
        .dispatch('getLatestVersion')
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          this.updateing = false;
        });
    },
    createIssue() {
      openNewGitHubIssue({
        user: 'ZyqGitHub1',
        repo: 'h-player-v2',
      });
    },
    toggleDevTools() {
      const win = this.$q.electron.remote.BrowserWindow.getFocusedWindow();
      if (win) {
        const { webContents } = win;
        if (webContents.isDevToolsOpened()) {
          webContents.closeDevTools();
        } else {
          webContents.openDevTools();
        }
      }
    },
    isUrl(val) {
      return isAbsoluteUrl(val) || '请输入有效url';
    },
  },
};
</script>

<style lang="stylus"></style>
