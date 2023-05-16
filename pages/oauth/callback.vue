<template>
    <div>
        Redirect

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
const code = useState<string>(() => route.query.code as string);
const state = useState<string>(() => route.query.state as string);
const userStore = useUserStore();

const { isLogin } = storeToRefs(userStore);

if (code.value && process.server) {
    await userStore.getToken(code.value);
    await userStore.getUserInfo();
    await userStore.getMemToken();
}

if (isLogin.value && process.client) {
    navigateTo('/');
}

</script>

