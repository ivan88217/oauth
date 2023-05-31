// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    // The private keys which are only available server-side
    apiSecret: 'secret',
    // Keys within public are also exposed client-side
    public: {
      apiBase: '/api',
      clientId: process.env.CLIENT_ID, // 會員中心client_id
      clientSecret: process.env.CLIENT_SECRET, // 會員中心client_secret
      userAuthorizationUri: process.env.USER_AUTHORIZATION_URI, // 會員中心授權登入網址
      accessTokenUri: process.env.ACCESS_TOKEN_URI, // 會員中心取得token網址
      userInfoUri: process.env.USER_INFO_URI, // 會員中心取得使用者資料網址
      exchangeTokenUri: process.env.EXCHANGE_TOKEN_URI, // 交換權杖網址
      redirectUri: process.env.REDIRECT_URI, // 會員中心授權登入後的轉址網址（需改成自己的網址）
      googleOneTapUri: process.env.GOOGLE_ONE_TAP_URI, // 會員中心授權登入後的轉址網址（需改成自己的網址）

      googleClientId: process.env.GOOGLE_CLIENT_ID, // 會員中心client_id
      googleClientSecret: process.env.GOOGLE_CLIENT_SECRET, // 會員中心client_secret
      googleRedirectUri: process.env.GOOGLE_REDIRECT_URI, // 會員中心授權登入後的轉址網址（需改成自己的網址）
    }
  },
  modules: ['@pinia/nuxt'],
  ssr: true,
})
