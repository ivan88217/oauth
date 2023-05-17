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
import { useUserStore } from '~/store/user';
const route = useRoute();
const code = useState<string>(() => route.query.code as string); // 會員中心跳轉回來的 code
const state = useState<string>(() => route.query.state as string); // 會員中心跳轉回來的 state（目前沒用到）
const userStore = useUserStore();

const { isLogin } = storeToRefs(userStore);

if (!code.value && process.client) {
    alert('無效的登入資訊');
    navigateTo('/');
}


// 取得 token（限 server 端）
if (code.value && process.server) {
    await userStore.getToken(code.value);
    await userStore.getUserInfo();
    await userStore.getMemToken();
}

// 跳轉回首頁（限 client 端）
if (isLogin.value && process.client) {
    navigateTo('/');
}

</script>

