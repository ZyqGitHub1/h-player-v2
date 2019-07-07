/* eslint-disable global-require */
/**
 * This file is used specifically and only for development. It installs
 * `electron-debug` & `vue-devtools`. There shouldn't be any need to
 *  modify this file, but it can be used to extend your development
 *  environment.
 */

const electronDebug = require('electron-debug');

// Install `electron-debug` with `devtron`
electronDebug({ showDevTools: true });

// Install `vue-devtools`
require('electron').app.on('ready', () => {
  const installExtension = require('electron-devtools-installer');
  installExtension.default(installExtension.VUEJS_DEVTOOLS)
    .then(() => {})
    .catch((err) => {
      console.log('Unable to install `vue-devtools`: \n', err);
    });
});

// Require `main` process to boot app
require('./electron-main');
