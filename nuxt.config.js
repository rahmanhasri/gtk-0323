export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  server: {
    port: 3000,
  },
  head: {
    title: 'gtk-0323',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://unpkg.com/leaflet@1.2.0/dist/leaflet.css' },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/scss/main.scss',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    'nuxt-leaflet',
    '@nuxtjs/axios',
    // '@nuxtjs/bulma',
    'nuxt-buefy',
    '@nuxtjs/auth',
    '@nuxtjs/toast',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/',
  },

  serverMiddleware: [
    { path: '/api', handler: '~/server-middleware/rest.js' },
  ],

  auth: {
    strategies: {
      local: {
        endpoints: {
          login: { url: '/api/users/authentication', method: 'post', propertyName: 'token' },
          logout: false,
          user: false,
        },
      }
    },
  },
  redirect: {
    logout: '/login',
    login: '/',
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {}
}
