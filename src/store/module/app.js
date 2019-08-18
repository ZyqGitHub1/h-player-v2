import axios from 'axios';
import pkg from '../../../package.json';

export default {
  state: {
    https: true,
    loadImage: true,
    currentVersion: pkg.version,
    latestVersion: '0.0.0',
  },
  mutations: {
    setHttps(state, status) {
      state.https = status;
    },
    setLoadImage(state, status) {
      state.loadImage = status;
    },
    setLatestVersion(state, latestVersion) {
      state.latestVersion = latestVersion;
    },
  },
  actions: {
    getLatestVersion(context) {
      return axios
        .get(
          'https://api.github.com/repos/ZyqGitHub1/h-player-v2/releases/latest',
        )
        .then((response) => {
          const tag = response.data.tag_name;
          context.commit('setLatestVersion', tag);
          return response;
        });
    },
  },
};
