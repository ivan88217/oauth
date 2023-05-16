import { defineStore } from 'pinia'
import oauth from '~/config/oauth';

export const useUserStore = defineStore('user', () => {
    const accountCenterToken = ref('');
    const memToken = ref('');
    const accountCenterUser = ref({})
    const isLogin = computed(() => memToken.value !== '' && accountCenterToken.value !== '');

    const getUserInfo = async () => {
        const url = oauth.userInfoUri;
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accountCenterToken.value,
            },
        })
        const json = await res.json();
        if (json.id) {
            return accountCenterUser.value = json;
        }
        return accountCenterUser.value = {};
    };

    const getMemToken = async () => {
        const url = 'http://api.pms.tw/oauth/token/exchange';
        const data = new URLSearchParams({
            hotel_id: '1',
        });
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + accountCenterToken.value,
            },
            body: data,
        });
        const json = await res.json();
        if (json.access_token) {
            return memToken.value = json.access_token;
        }
        return memToken.value = "";
    }

    return {
        accountCenterToken,
        memToken,
        accountCenterUser,
        getUserInfo,
        getMemToken,
        isLogin,
    }
});
