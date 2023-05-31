<template>
    <div>
        <h1>首頁</h1>

        <div v-if="isLogging">
            <h3>登入中...</h3>
        </div>
        <div v-else>
            <div v-if="isLogin">
                <h3>已登入, 歡迎 {{ accountCenterUser?.name }}</h3>
                <button @click="logout">登出</button>
            </div>
            <div v-else>
                <button @click="login">登入</button>
                <ClientOnly>
                    <GoogleLogin :callback="callback" prompt :error="handleErr" />
                </ClientOnly>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserStore } from '~/store/user';
import type { User } from '~/store/user';

const userStore = useUserStore();
const { isLogin, accountCenterUser } = storeToRefs(userStore);
const isLogging = ref(false);
import { googleLogout, decodeCredential } from 'vue3-google-login';

// Oauth2 登入
const login = () => {
    userStore.login();
};

const logout = () => {
    googleLogout();
    userStore.logout();
};

const callback = async (response: any) => {
    const credential = response?.credential;
    if (!credential) {
        alert('登入失敗');
        return;
    }
    isLogging.value = true;
    // 取得google會員資料
    const googleUser = decodeCredential(credential);

    try {
        // 由google取得的token，再去取得會員中心的token
        const accessToken = await userStore.getTokenFromGoogle(credential);
        userStore.accountCenterToken = accessToken;

        // 由會員中心的token，取得會員中心的會員資料
        const { data: memData } = await useFetch(`/api/user-info/mem`, {
            method: 'POST',
            body: {
                accessToken
            },
            initialCache: false
        } as any);
        const userInfo = memData.value as User;
        userStore.accountCenterUser = userInfo;

        // 由會員中心的token，取得會員平台的token
        userStore.memToken = await userStore.getMemToken(accessToken);
    } finally {
        isLogging.value = false;
    }
}

const handleErr = (err: any) => {
    console.log(err);
}

</script>

<style scoped>
</style>
