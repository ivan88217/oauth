<template>
    <div>
        <h1>home</h1>

        <div v-if="!isLogin">
            <button @click="login">登入</button>
        </div>
        <div v-else>
            <h3>已登入, {{ accountCenterUser?.name }}</h3>
            <button @click="logout">登出</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import oauth from '~/config/oauth';
import { storeToRefs } from 'pinia'
import { useUserStore } from '~/store/user';

const userStore = useUserStore();
const { isLogin, accountCenterUser } = storeToRefs(userStore);

// Oauth2 登入
const login = () => {
    userStore.login();
};
    
const logout = () => {
    userStore.logout();
};


</script>

<style scoped>
</style>
