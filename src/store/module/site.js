import Store from 'electron-store';

const store = new Store();

export default {
  state: {
    siteList: [],
    currentSiteId: 1,
    currentClass: '',
    keyWord: '',
  },
  mutations: {
    setCurrentSiteId(state, currentSiteId) {
      state.currentSiteId = currentSiteId;
    },
    setCurrentClass(state, currentClass) {
      state.currentClass = currentClass;
    },
    setKeyWord(state, keyWord) {
      state.keyWord = keyWord;
    },
    setSiteList(state, siteList) {
      if (!Array.isArray(siteList)) {
        state.siteList = [];
      } else {
        state.siteList = siteList;
      }
      store.set('siteList', state.siteList);
    },
  },
  getters: {
    currentSite: state => state.siteList.find(item => item.id === state.currentSiteId),
  },
  actions: {
    loadSiteList(context) {
      const storeSiteList = store.get('siteList');
      if (!Array.isArray(storeSiteList)) {
        context.commit('setSiteList', []);
      } else {
        context.commit('setSiteList', storeSiteList);
      }


      return storeSiteList;
    },
  },
};
