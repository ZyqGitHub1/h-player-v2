import Vue from 'vue';
import Vuex from 'vuex';

import createLogger from 'vuex/dist/logger';
import site from './module/site';
import video from './module/video';
import app from './module/app';


Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      site,
      video,
      app,
    },

    plugins: [createLogger()],

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV,
  });

  return Store;
}
