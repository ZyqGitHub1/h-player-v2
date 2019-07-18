import Navigation from 'vue-navigation';

// "async" is optional
export default async ({ router, Vue, store }) => {
  Vue.use(Navigation, { router, store });
};
