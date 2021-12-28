export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'Dazu Darmowe Ogłoszenia Nieruchomosci dla osób prywatnych i agencji',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Serwis nieruchomosci online - mieszkania, domy, działki, lokale użytkowe, magazyny, kampingi, domy modularowe na sprzedaż, wynajem, zamianę » Dazu.pl' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      {
        src: 'https://www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit'
      }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    // 'element-ui/lib/theme-chalk/index.css'
    '~/assets/index.css',
    '~/assets/fonts.css',
    // '~/assets/buttons/normalize.css',
    // '~/assets/buttons/demo.css',
    // '~/assets/buttons/component.css'
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '~/plugins/element-ui',
    '~/plugins/axios',
    '~/plugins/click-outside.js',
    '~/plugins/storage',
    '~/plugins/html-safe',
    // '~/plugins/modernizr.custom.js',
    // '~/plugins/classie.js',
    // '~/plugins/progressButton.js',
    // '~/plugins/progressButtonScript.js',
    { src: '~/plugins/flickity', ssr: false },
    { src: '~/plugins/toggle-btn', ssr: false },
    { src: '~/plugins/vue2-editor', ssr: false }
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module'
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    '@nuxtjs/google-analytics',
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    '@nuxtjs/pwa',
    'nuxt-leaflet'
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    proxy: true
  },

  publicRuntimeConfig: {
    assetsUrl: process.env.VUE_APP_ASSETS_BASE_URL,
    baseUrl: process.env.VUE_APP_BASE_API,
    mapStyle: process.env.VUE_APP_MAP_STYLE,
    recaptchaSiteKey: process.env.CAPTCHA_SITE_KEY
  },
  // pwa: {
  //   manifest: {
  //     lang: 'en'
  //   },
  //   icon: {
  //     source: '~/static/icon.png'
  //   }
  // },
  proxy: {
    '/api/': process.env.VUE_APP_BASE_API,
    '/storage/': process.env.VUE_APP_BASE_API,
    '/osm/': {
      target: process.env.VUE_APP_OSM_BASE_API,
      pathRewrite: { '^/osm/': '' }
    },
    'api.jurkiewicz.me': 'dazu.jurkiewicz.me'
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
  },

  // generate: { fallback: '404.html' },

  googleAnalytics: {
    id: process.env.VUE_APP_ANALYTICS_ID
  },

  router: {
    extendRoutes (routes, resolve) {
      routes.push({
        path: '/',
        components: {
          default: resolve(__dirname, 'pages/Index')
        }
      })
      routes.push({
        path: '/dokoncz-rejestracje',
        components: {
          default: resolve(__dirname, 'pages/CompleteRegistration')
        }
      })
      routes.push({
        path: '/ustaw-haslo',
        components: {
          default: resolve(__dirname, 'pages/SetPassword')
        }
      })
      routes.push({
        path: '/ustawienia-konta',
        components: {
          default: resolve(__dirname, 'pages/account/AccountSettings')
        }
      })
      routes.push({
        path: '/ulubione',
        components: {
          default: resolve(__dirname, 'pages/account/Favorites')
        }
      })
      routes.push({
        path: '/moje-ogloszenia',
        components: {
          default: resolve(__dirname, 'pages/account/MyOffers')
        }
      })
      routes.push({
        path: '/agenci',
        components: {
          default: resolve(__dirname, 'pages/account/Agents')
        }
      })
      routes.push({
        path: '/faktury',
        components: {
          default: resolve(__dirname, 'pages/account/Payments')
        }
      })
      routes.push({
        path: '/ogloszenia/:slug',
        components: {
          default: resolve(__dirname, 'pages/Offer')
        }
      })
      routes.push({
        path: '/dodaj-ogloszenie',
        components: {
          default: resolve(__dirname, 'pages/AddOffer')
        }
      })
      routes.push({
        path: '/moje-ogloszenia/edytuj-ogloszenie/:slug',
        components: {
          default: resolve(__dirname, 'pages/account/EditOffer')
        }
      })
      routes.push({
        path: '/szukaj',
        components: {
          default: resolve(__dirname, 'pages/SearchResults')
        }
      })
      routes.push({
        path: '/blog/:slug',
        components: {
          default: resolve(__dirname, 'pages/BlogPost')
        }
      })
      routes.push({
        path: '/moje-ogloszenia/oplac/:slug',
        components: {
          default: resolve(__dirname, 'pages/Payment')
        }
      })
      routes.push({
        path: '/potwierdz-newsletter',
        components: {
          default: resolve(__dirname, 'pages/ConfirmNewsletter')
        }
      })
      routes.push({
        path: '/kontakt',
        components: {
          default: resolve(__dirname, 'pages/ContactForm')
        }
      })
      routes.push({
        path: '/profil/:user',
        components: {
          default: resolve(__dirname, 'pages/Profile')
        }
      })
    }
  }
}
