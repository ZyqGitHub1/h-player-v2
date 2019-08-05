<template>
  <q-layout view="hHh Lpr fFf">
    <!-- (Optional) The Header -->
    <q-header elevated>
      <title-bar :layout="['minimize', 'maximize', 'close']"></title-bar>
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
      <q-page>
        <div class="flex flex-center import">
          <q-btn
            color="primary"
            label="暂无视频源，点击选择文件导入"
            @click="openDialog"
          />
          <q-btn
            v-if="canclable"
            class="cancl"
            color="red"
            label="取消"
            @click="$router.push('/')"
          />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import titleBar from 'components/titlebar';
import { mapMutations, mapState } from 'vuex';
import fs from 'fs-extra';

const { dialog } = require('electron').remote;

export default {
  name: 'Import',
  data() {
    return {
      leftDrawer: true,
    };
  },
  components: {
    titleBar,
  },
  computed: {
    ...mapState({
      siteList: state => state.site.siteList,
    }),
    canclable() {
      return this.$route.query.canclable;
    },
  },
  methods: {
    ...mapMutations(['setSiteList']),
    async openDialog() {
      const dialogResult = dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'JSON', extensions: ['json'] }],
      });
      if (dialogResult) {
        const importedFile = await fs.readJSON(dialogResult[0]);
        this.$electronStore.set('siteList', importedFile);
        this.setSiteList(importedFile);
        this.$router.push('/');
      }
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
};
</script>

<style lang="stylus">
.import {
  height: calc(100vh - 100px);
}

.cancl {
  margin-left: 20px;
}
</style>
