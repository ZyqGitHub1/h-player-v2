export default {
  state: {
    siteList: [
      {
        id: 1,
        name: '色色资源站',
        uri: 'https://www.emiao026.com',
        httpApi: 'http://sscj8.com/inc/api.php',
        httpsApi: 'http://sscj8.com/inc/sapi.php',
        type: '综合性资源',
      },
      {
        id: 2,
        name: '玖玖资源站',
        uri: 'https://www.sesejiu.com',
        httpApi: 'http://99zxcj.com/inc/ck.php',
        httpsApi: 'http://99zxcj.com/inc/sck.php',
        type: '综合性资源',
      },
      {
        id: 3,
        name: '撸死你资源站',
        uri: 'http://www.ttlsn3.com',
        httpApi: 'http://lsnzxcj.com/inc/api.php',
        httpsApi: 'http://lsnzxcj.com/inc/sapi.php',
        type: '猎奇资源',
      },
      {
        id: 4,
        name: '富二代资源站',
        uri: 'https://sb8.app/rb8.png',
        httpApi: 'http://f2dcj6.com/api',
        httpsApi: 'http://f2dcj6.com/sapi',
        type: '国产资源',
      },
      {
        id: 5,
        name: '字幕网资源站',
        uri: 'https://www.zmffl.com',
        httpApi: 'http://zcyydy.com/api',
        httpsApi: 'http://zcyydy.com/sapi',
        type: '中文字幕',
      },
      {
        id: 6,
        name: '久草资源站',
        uri: 'https://www.9ckkl.com',
        httpApi: 'http://ssyydy.com/api',
        httpsApi: 'http://ssyydy.com/sapi',
        type: '会员资源',
      },
      {
        id: 7,
        name: '女优资源站',
        uri: 'http://www.ttlsn4.com',
        httpApi: 'http://nygcj.com/api.php',
        httpsApi: 'http://nygcj.com/sapi.php',
        type: '无水印资源',
      },
      {
        id: 8,
        name: '利来资源站',
        uri: 'https://sao-lang-jian.com',
        httpApi: 'http://llzxcj.com/inc/ck.php',
        httpsApi: 'http://llzxcj.com/inc/sck.php',
        type: '无水印资源',
      },
    ],
    currentSiteId: 1,
    currentClass: '',
  },
  mutations: {
    setCurrentSiteId(state, currentSiteId) {
      state.currentSiteId = currentSiteId;
    },
    setCurrentClass(state, currentClass) {
      state.currentClass = currentClass;
    },
  },
  getters: {
    currentSite: state => state.siteList.find(item => item.id === state.currentSiteId),
  },
};
