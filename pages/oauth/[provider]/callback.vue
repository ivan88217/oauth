<template>
    <div>
        重新導向中...

        <ClientOnly>
            <div v-if="isLogin">
                已登入，將自動跳轉回首頁，或點擊 <nuxt-link to="/">Home</nuxt-link>
            </div>
        </ClientOnly>
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { User } from '~/store/user';
import { useUserStore } from '~/store/user';
const route = useRoute();
const code = useState<string>(() => route.query.code as string); // 會員中心跳轉回來的 code
const state = useState<string>(() => route.query.state as string); // 會員中心跳轉回來的 state（目前沒用到）
const userStore = useUserStore();
const provider = route.params.provider as string;
const { isLogin } = storeToRefs(userStore);

if (!code.value && process.client) {
    alert('無效的登入資訊');
    navigateTo('/');
}


// 取得 token（限 server 端）
if (code.value && process.server) {
    let accessToken = '';
    if (provider == 'account_center') {
        accessToken = await userStore.getToken(code.value);
    } else {
        throw new Error('無效的登入方式');
    }
    userStore.accountCenterToken = accessToken;
    const { data } = await useFetch(`/api/user-info/mem`, {
        method: 'POST',
        body: {
            accessToken
        },
        initialCache: false
    } as any);

    const userInfo = data.value as User;

    userStore.accountCenterUser = userInfo;
    userStore.memToken = await userStore.getMemToken(accessToken);
}

// 跳轉回首頁（限 client 端）
if (isLogin.value && process.client) {
    navigateTo('/');
}

</script>

