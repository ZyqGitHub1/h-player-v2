const Store = require('electron-store');

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
    setSiteList(state, setSetList) {
      state.siteList = setSetList;
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
      }
      context.commit('setSiteList', storeSiteList);

      return storeSiteList;
    },
  },
};
