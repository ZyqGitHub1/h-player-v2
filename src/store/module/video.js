export default {
  state: {
    currentVideo: {
      actor: '',
      area: '',
      des: '',
      director: '',
      dl: '',
      id: '',
      lang: '',
      last: '',
      name: '',
      note: '',
      pic: '',
      state: '',
      tid: '',
      type: '',
      year: '',
    },
  },
  mutations: {
    setCurrentVideo(state, currentVideo) {
      state.currentVideo = currentVideo;
    },
  },
};
