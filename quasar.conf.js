/* eslint-disable global-require */
/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js

const webpack = require('webpack');

module.exports = function (ctx) {
  return {
    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    boot: ['i18n', 'axios', 'vue-navigation', 'electron-store', 'vue-rx'],

    css: ['app.styl'],

    extras: [
      // 'ionicons-v4',
      // 'mdi-v3',
      // 'fontawesome-v5',
      // 'eva-icons',
      // 'themify',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      'roboto-font', // optional, you are not bound to it
      'material-icons', // optional, you are not bound to it
    ],

    framework: {
      // iconSet: 'ionicons-v4',
      lang: 'zh-hans', // Quasar language

      // all: true, // --- includes everything; for dev only!

      components: [
        'QAvatar',
        'QTabs',
        'QTab',
        'QFooter',
        'QLayout',
        'QHeader',
        'QDrawer',
        'QPageContainer',
        'QPage',
        'QToolbar',
        'QToolbarTitle',
        'QBtn',
        'QIcon',
        'QList',
        'QItem',
        'QItemSection',
        'QItemLabel',
        'QImg',
        'QCard',
        'QCardSection',
        'QPagination',
        'QInnerLoading',
        'QSpinnerGears',
        'QScrollArea',
        'QForm',
        'QToggle',
        'QPageSticky',
        'QInput',
        'QSeparator',
        'QChip',
        'QTooltip',
        'QBar',
        'QSpace',
        // table
        'QTable',
        'QTh',
        'QTr',
        'QTd',
        'QExpansionItem',
        'QPopupEdit',
        'QDialog',
        'QCardActions',
      ],

      directives: ['Ripple', 'ClosePopup'],

      // Quasar plugins
      plugins: ['Notify', 'Loading', 'LoadingBar', 'Dialog'],
      config: {
        loadingBar: {
          color: 'purple',
          size: '5px',
          position: 'bottom',
          skipHijack: true,
        },
      },
    },

    supportIE: false,

    build: {
      scopeHoisting: true,
      // vueRouterMode: 'history',
      // vueCompiler: true,
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      extendWebpack(cfg) {
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/,
          options: {
            formatter: require('eslint').CLIEngine.getFormatter('stylish'),
          },
        });
      },
    },

    devServer: {
      // https: true,
      // port: 8080,
      open: true, // opens browser window automatically
    },

    // animations: 'all', // --- includes all animations
    animations: [],

    ssr: {
      pwa: false,
    },

    pwa: {
      // workboxPluginMode: 'InjectManifest',
      // workboxOptions: {}, // only for NON InjectManifest
      manifest: {
        // name: 'h-player',
        // short_name: 'h-player',
        // description: 'A Quasar Framework app',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            src: 'statics/icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png',
          },
          {
            src: 'statics/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'statics/icons/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png',
          },
          {
            src: 'statics/icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png',
          },
          {
            src: 'statics/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    },

    cordova: {
      // id: 'org.cordova.quasar.app',
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    electron: {
      bundler: 'builder', // 'builder' or 'packager'

      extendWebpack(cfg) {
        // do something with Electron main process Webpack cfg
        // chainWebpack also available besides this extendWebpack
      },

      chainWebpack(chain) {
        // fix Critical dependency
        // see https://github.com/Automattic/mongoose/issues/7476 and https://github.com/webpack/webpack/issues/196#issuecomment-71925726
        chain
          .plugin('ContextReplacementPlugin')
          .use(webpack.ContextReplacementPlugin, [/.*/])
          .end();
      },

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',
        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration
        appId: 'com.electron.h-player',
        mac: {
          category: 'public.app-category.video',
          target: 'dmg',
        },
        win: {
          target: [
            {
              target: 'zip',
              arch: [
                'x64',
                'ia32',
              ],
            },
          ],
        },
        linux: {
          target: 'AppImage',
        },
      },
    },
  };
};
