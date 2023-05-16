<template>
    <div>
        Redirect

        <div v-if="isLogin">
            已登入，將自動跳轉回首頁，或點擊 <nuxt-link to="/">Home</nuxt-link>
        </div>
    </div>
</template>

<script setup lang="ts">
import oauth from '~/config/oauth';
import { storeToRefs } from 'pinia'
import { ref } from 'vue';
import { useUserStore } from '~/store/user';
const route = useRoute();
const code = ref(route.query.code as string);
const state = ref(route.query.state as string);
const userStore = useUserStore();

const { accountCenterToken, isLogin } = storeToRefs(userStore);

const url = oauth.accessTokenUri;
const request = new URLSearchParams({
    client_id: oauth.clientId,
    client_secret: oauth.clientSecret,
    code: code.value,
    grant_type: oauth.grantType,
    redirect_uri: oauth.redirectUri,
});

const { data } = await useFetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: request,
});

if (data) {
    accountCenterToken.value = (data.value as any).access_token;
    await userStore.getMemToken();
    await userStore.getUserInfo();
    await navigateTo('/');
}


</script>

