// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  css: [
    '~/assets/css/custom.css'
  ],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://financial-accounting-api-production.up.railway.app/api'
    }
  },
  app: {
    head: {
      title: 'Financial Accounting Webapp - Technical Assessment PT. TRANS BERJAYA KHATULISTIWA',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'Sistem Akuntansi Keuangan Modern (Laravel 11 + Nuxt 3) dikembangkan oleh David Gholi Rahmadana untuk Technical Test PT. TRANS BERJAYA KHATULISTIWA.' },
        { name: 'keywords', content: 'financial, accounting, profit loss, journal entry, chart of accounts, david gholi rahmadana, laravel, nuxt 3, trans berjaya khatulistiwa' },
        { name: 'author', content: 'David Gholi Rahmadana' },
        
        // OpenGraph / Facebook / WhatsApp Preview
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Financial Accounting Webapp - David Gholi Rahmadana' },
        { property: 'og:description', content: 'Executive Dashboard, Journal Transactions, Profit & Loss Report, Multi-Currency, & Dark/Light Mode System.' },
        { property: 'og:site_name', content: 'Financial Accounting Webapp' },
        
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Financial Accounting Webapp - David Gholi Rahmadana' },
        { name: 'twitter:description', content: 'Executive Dashboard, Journal Transactions, Profit & Loss Report, Multi-Currency, & Dark/Light Mode System.' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ]
    }
  }
})
