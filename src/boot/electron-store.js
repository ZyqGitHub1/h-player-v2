const Store = require('electron-store');

const store = new Store();

// "async" is optional
export default async ({ Vue }) => {
  Vue.prototype.$electronStore = store;
};
