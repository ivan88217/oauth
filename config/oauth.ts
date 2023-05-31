export const useOauthConfig = () => {
    const runtimeConfig = useRuntimeConfig();
    return {
        // OAuth 2.0
        clientId: runtimeConfig.public.clientId!, // 會員中心client_id
        clientSecret: runtimeConfig.public.clientSecret!, // 會員中心client_secret
        userAuthorizationUri: runtimeConfig.public.userAuthorizationUri!, // 會員中心授權登入網址
        accessTokenUri: runtimeConfig.public.accessTokenUri!, // 會員中心取得token網址
        userInfoUri: runtimeConfig.public.userInfoUri!, // 會員中心取得使用者資料網址
        exchangeTokenUri: runtimeConfig.public.exchangeTokenUri!, // 交換權杖網址
        redirectUri: runtimeConfig.public.redirectUri!, // 會員中心授權登入後的轉址網址（需改成自己的網址）
        googleOneTapUri: runtimeConfig.public.googleOneTapUri!, // 會員中心google one tap交換token網址
        scope: "", // 會員中心授權範圍
        state: "",
        responseType: "code",
        grantType: "authorization_code",
    }
};

export const useGoogleOauthConfig = () => {
    const runtimeConfig = useRuntimeConfig();
    return {
        // OAuth 2.0
        clientId: runtimeConfig.public.googleClientId!, // Google client_id
        clientSecret: runtimeConfig.public.googleClientSecret!, // Google client_secret
        redirectUri: runtimeConfig.public.googleRedirectUri!, // Google 授權登入後的轉址網址（目前採用popup，所以不用理會）
    }
};
