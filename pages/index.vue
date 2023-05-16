<template>
    <div>
        <h1>home</h1>

        <div v-if="!isLogin">
            <button @click="login">登入</button>
        </div>
        <div v-else>
            <button @click="logout">登出</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import oauth from '~/config/oauth';
import { storeToRefs } from 'pinia'
import { useUserStore } from '~/store/user';

const { isLogin } = storeToRefs(useUserStore());

// Oauth2 登入
const login = () => {
    const url = oauth.userAuthorizationUri + "?" + new URLSearchParams({
        client_id: oauth.clientId,
        redirect_uri: oauth.redirectUri,
        response_type: oauth.responseType,
        scope: oauth.scope,
        state: oauth.state,
    });
    return navigateTo(url, { external: true });
};
    
const logout = () => {
};


</script>

<style scoped>
</style>
