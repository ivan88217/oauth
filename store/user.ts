import { defineStore } from 'pinia'
import oauth from '~/config/oauth';

interface User {
    id: number;
    name: string;
    email: string;
}

export const useUserStore = defineStore('user', () => {
    const accountCenterToken = useState<string>(() => '');
    const memToken = useState<string>(() => '');
    const accountCenterUser = useState<User|null>(() => null)
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
        return accountCenterUser.value = null;
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

    const getToken = async (code: string) => {
        const url = oauth.accessTokenUri;
        const data = new URLSearchParams({
            client_id: oauth.clientId,
            client_secret: oauth.clientSecret,
            grant_type: oauth.grantType,
            redirect_uri: oauth.redirectUri,
            code: code,
        });
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: data,
        });
        const json = await res.json();
        if (json.access_token) {
            return accountCenterToken.value = json.access_token;
        }
        return accountCenterToken.value = "";
    }

    const logout = () => {
        accountCenterToken.value = "";
        memToken.value = "";
        accountCenterUser.value = null;
    }

    return {
        isLogin,
        accountCenterToken,
        memToken,
        accountCenterUser,
        
        getUserInfo,
        getMemToken,
        getToken,
        login,
        logout,
    }
});
