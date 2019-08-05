<template>
  <q-layout view="hHh Lpr fFf">
    <!-- (Optional) The Header -->
    <q-header elevated>
      <title-bar></title-bar>
      <q-toolbar>
        <q-btn
          dense
          flat
          round
          icon="menu"
          @click="leftDrawer = !leftDrawer"
        />
        <q-space></q-space>
        <q-btn
          dense
          flat
          icon="check"
          label="确定"
          @click="closeConfig"
        />
      </q-toolbar>
    </q-header>
    <!-- (Optional) The Footer -->
    <q-footer>
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
    <q-page-container>
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
                    <q-popup-edit v-model="props.row.name">
                      <q-input
                        type="textarea"
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
                    <q-popup-edit v-model="props.row.uri">
                      <q-input
                        type="textarea"
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
                    <q-popup-edit v-model="props.row.httpApi">
                      <q-input
                        type="textarea"
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
                    <q-popup-edit v-model="props.row.httpsApi">
                      <q-input
                        type="textarea"
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
                    <q-popup-edit v-model="props.row.type">
                      <q-input
                        type="textarea"
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
                <q-card-section>
                  <div class="text-h6">name</div>
                </q-card-section>

                <q-card-section>
                  <q-input
                    dense
                    v-model="addRowData.name"
                    autofocus
                  />
                </q-card-section>
                <q-card-section>
                  <div class="text-h6">url</div>
                </q-card-section>

                <q-card-section>
                  <q-input
                    dense
                    v-model="addRowData.uri"
                  />
                </q-card-section>
                <q-card-section>
                  <div class="text-h6">httpApi</div>
                </q-card-section>

                <q-card-section>
                  <q-input
                    dense
                    v-model="addRowData.httpApi"
                  />
                </q-card-section>
                <q-card-section>
                  <div class="text-h6">httpsApi</div>
                </q-card-section>

                <q-card-section>
                  <q-input
                    dense
                    v-model="addRowData.httpsApi"
                  />
                </q-card-section>
                <q-card-section>
                  <div class="text-h6">type</div>
                </q-card-section>

                <q-card-section>
                  <q-input
                    dense
                    v-model="addRowData.type"
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
        </q-scroll-area>
        </scroll-warp>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import scrollWarp from 'components/scrollWarp';
import clonedeep from 'lodash/cloneDeep';
import titleBar from 'components/titlebar';
import { mapMutations, mapState } from 'vuex';
import { uid } from 'quasar';
import fs from 'fs-extra';

export default {
  name: 'Config',
  data() {
    return {
      leftDrawer: this.$q.platform.is.desktop,
      loading: false,
      filter: '',
      rowCount: 10,
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
        this.setSiteList(clonedeep(this.data));
        this.$electronStore.set('siteList', this.siteList);
      },
      deep: true,
    },
  },
  components: {
    titleBar,
    scrollWarp,
  },
  mounted() {
    this.data = clonedeep(this.siteList);
  },
  computed: {
    ...mapState({
      siteList: state => state.site.siteList,
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
  methods: {
    ...mapMutations(['setSiteList']),
    async openDialog() {
      const { dialog } = this.$q.electron.remote;
      const dialogResult = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'JSON', extensions: ['json'] }],
      });
      if (dialogResult) {
        const importedFile = await fs.readJSON(dialogResult[0]);
        this.$electronStore.set('siteList', importedFile);
        this.setSiteList(importedFile);
        this.data = clonedeep(this.siteList);
      }
    },
    async saveDialog() {
      const { dialog } = this.$q.electron.remote;
      const dialogResult = await dialog.showSaveDialog({
        defaultPath: 'source.json',
      });
      if (dialogResult) {
        await fs.writeJson(dialogResult, this.siteList);
      }
    },
    closeConfig() {
      this.$router.replace('/');
    },
    addRow() {
      this.addDialog = true;
    },
    deleteRow(prop) {
      this.data = this.data.filter(element => element.id !== prop.row.id);
    },
    addRowInTable() {
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
    },
    showClearConfirm() {
      this.clearConfirm = true;
    },
    clearSource() {
      this.$electronStore.clear();
      this.data = [];
      this.setSiteList([]);
    },
  },
};
</script>

<style lang="stylus"></style>
