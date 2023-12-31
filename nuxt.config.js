export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: ' Fliq free property listings for individuals and agencies',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Free online real estate portal - apartments, houses, plots, commercial premises, warehouses, campsites, modular houses for sale, rent, swap» Fliq.co.uk ' },
      { hid: 'og:description', name: 'og:description', property:'og:description', content: 'Free online real estate portal - apartments, houses, plots, commercial premises, warehouses, campsites, modular houses for sale, rent, swap» Fliq.co.uk' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    __dangerouslyDisableSanitizers: ['script'],
    script: [
      {
        src: 'https://www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit'
      },
      {
        hid: 'gtm-script1',
        src: 'https://www.googletagmanager.com/gtag/js?id=G-F778WV99TH',
        defer: true
      },
      {
        hid: 'gtm-script2',
        innerHTML: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-F778WV99TH');
        `,
        type: 'text/javascript',
        charset: 'utf-8'
      }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    // 'element-ui/lib/theme-chalk/index.css'
    '~/assets/index.css',
    '~/assets/fonts.css'
  ],

  vue: {
    config: {
      productionTip: false,
      devtools: true
    }
  },

  // ee (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '~/plugins/element-ui',
    '~/plugins/vue-cascader-select',
    '~/plugins/axios',
    '~/plugins/click-outside.js',
    '~/plugins/persistedState',
    '~/plugins/html-safe',
    '~/plugins/gtm',
    '~/plugins/lottie-vue-player.client.js',
    { src: '~/plugins/gtm', mode: 'client' },
    { src: '~/plugins/flickity', ssr: false },
    { src: '~/plugins/toggle-btn', ssr: false },
    { src: '~/plugins/vue2-editor', ssr: false }
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    // '@nuxtjs/eslint-module'
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    '@nuxtjs/google-analytics',
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    '@nuxtjs/pwa',
    'nuxt-leaflet',
    '@nuxtjs/gtm'
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    proxy: true
  },
  gtm: {
    id: process.env.GTM_ID || 'GTM-KGXZ77W',

  },
  publicRuntimeConfig: {
    assetsUrl: process.env.VUE_APP_ASSETS_BASE_URL,
    baseUrl: process.env.VUE_APP_BASE_API,
    mapStyle: process.env.VUE_APP_MAP_STYLE,
    recaptchaSiteKey: process.env.CAPTCHA_SITE_KEY,
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY_TEST,
    frontUrl: process.env.FRONT_URL,
    gtm: {
      id: 'GTM-KGXZ77W'
    }
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
        path: '/strony/:slug',
        components: {
          default: resolve(__dirname, 'pages/FooterPages')
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
