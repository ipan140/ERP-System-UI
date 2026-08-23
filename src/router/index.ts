import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'Ecommerce',
      component: () => import('../views/Ecommerce.vue'),
      meta: {
        title: 'eCommerce Dashboard',
      },
    },
    {
      path: '/calendar',
      name: 'Calendar',
      component: () => import('../views/Others/Calendar.vue'),
      meta: {
        title: 'Calendar',
      },
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/Others/UserProfile.vue'),
      meta: {
        title: 'Profile',
      },
    },
    {
      path: '/form-elements',
      name: 'Form Elements',
      component: () => import('../views/Forms/FormElements.vue'),
      meta: {
        title: 'Form Elements',
      },
    },
    {
      path: '/basic-tables',
      name: 'Basic Tables',
      component: () => import('../views/Tables/BasicTables.vue'),
      meta: {
        title: 'Basic Tables',
      },
    },
    {
      path: '/line-chart',
      name: 'Line Chart',
      component: () => import('../views/Chart/LineChart/LineChart.vue'),
    },
    {
      path: '/bar-chart',
      name: 'Bar Chart',
      component: () => import('../views/Chart/BarChart/BarChart.vue'),
    },
    {
      path: '/alerts',
      name: 'Alerts',
      component: () => import('../views/UiElements/Alerts.vue'),
      meta: {
        title: 'Alerts',
      },
    },
    {
      path: '/avatars',
      name: 'Avatars',
      component: () => import('../views/UiElements/Avatars.vue'),
      meta: {
        title: 'Avatars',
      },
    },
    {
      path: '/badge',
      name: 'Badge',
      component: () => import('../views/UiElements/Badges.vue'),
      meta: {
        title: 'Badge',
      },
    },

    {
      path: '/buttons',
      name: 'Buttons',
      component: () => import('../views/UiElements/Buttons.vue'),
      meta: {
        title: 'Buttons',
      },
    },

    {
      path: '/images',
      name: 'Images',
      component: () => import('../views/UiElements/Images.vue'),
      meta: {
        title: 'Images',
      },
    },
    {
      path: '/videos',
      name: 'Videos',
      component: () => import('../views/UiElements/Videos.vue'),
      meta: {
        title: 'Videos',
      },
    },
    {
      path: '/blank',
      name: 'Blank',
      component: () => import('../views/Pages/BlankPage.vue'),
      meta: {
        title: 'Blank',
      },
    },

    {
      path: '/error-404',
      name: '404 Error',
      component: () => import('../views/Errors/FourZeroFour.vue'),
      meta: {
        title: '404 Error',
      },
    },

    {
      path: '/signin',
      name: 'Signin',
      component: () => import('../views/Auth/Signin.vue'),
      meta: { title: 'Signin' },
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('../views/Auth/Signup.vue'),
      meta: { title: 'Signup' },
    },
    // FASE 1 ROUTES
    {
      path: '/core/countries',
      name: 'Countries',
      component: () => import('../views/Core/MasterData/Countries.vue'),
      meta: { title: 'Countries' },
    },
    {
      path: '/core/currencies',
      name: 'Currencies',
      component: () => import('../views/Core/MasterData/Currencies.vue'),
      meta: { title: 'Currencies' },
    },
    {
      path: '/core/user-roles',
      name: 'UserRoles',
      component: () => import('../views/Core/Access/UserRoles.vue'),
      meta: { title: 'User Roles' },
    },
    {
      path: '/core/permissions',
      name: 'Permissions',
      component: () => import('../views/Core/Access/Permissions.vue'),
      meta: { title: 'Permissions' },
    },
    {
      path: '/core/discuss',
      name: 'Discuss',
      component: () => import('../views/Core/Communications/Discuss.vue'),
      meta: { title: 'Discuss' },
    },
    {
      path: '/core/mailer',
      name: 'Mailer',
      component: () => import('../views/Core/Communications/Mailer.vue'),
      meta: { title: 'Mailer' },
    },
    {
      path: '/core/voip',
      name: 'Voip',
      component: () => import('../views/Core/Communications/Voip.vue'),
      meta: { title: 'VoIP' },
    },
    {
      path: '/core/whatsapp',
      name: 'Whatsapp',
      component: () => import('../views/Core/Communications/Whatsapp.vue'),
      meta: { title: 'WhatsApp' },
    },
    {
      path: '/core/storage',
      name: 'Storage',
      component: () => import('../views/Core/Documents/Storage.vue'),
      meta: { title: 'Storage' },
    },
    {
      path: '/core/documents',
      name: 'Documents',
      component: () => import('../views/Core/Documents/Documents.vue'),
      meta: { title: 'Documents' },
    },
    {
      path: '/core/report',
      name: 'Report',
      component: () => import('../views/Core/Documents/Report.vue'),
      meta: { title: 'Report' },
    },
    {
      path: '/core/knowledge',
      name: 'Knowledge',
      component: () => import('../views/Core/Advanced/Knowledge.vue'),
      meta: { title: 'Knowledge' },
    },
    {
      path: '/core/iot',
      name: 'Iot',
      component: () => import('../views/Core/Advanced/Iot.vue'),
      meta: { title: 'IoT' },
    },
    {
      path: '/core/ai',
      name: 'ArtificialIntelligence',
      component: () => import('../views/Core/Advanced/ArtificialIntelligence.vue'),
      meta: { title: 'Artificial Intelligence' },
    },
  ],
})

export default router

router.beforeEach((to, from, next) => {
  document.title = `Vue.js ${to.meta.title} | TailAdmin - Vue.js Tailwind CSS Dashboard Template`
  next()
})
