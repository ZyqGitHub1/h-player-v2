const routes = [
  {
    path: '/',
    component: () => import('layouts/Home.vue'),
    children: [
      { path: '', component: () => import('pages/VideoList') },
      { path: 'video', component: () => import('pages/Video') },
    ],
  },
];

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404'),
  });
}

export default routes;
