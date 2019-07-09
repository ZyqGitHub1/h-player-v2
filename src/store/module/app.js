export default {
  state: {
    https: true,
  },
  mutations: {
    setHttps(state, status) {
      state.https = status;
    },
  },
};
