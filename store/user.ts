import { defineStore } from 'pinia'
import { useOauthConfig } from '~/config/oauth';

interface User {
    id: number;
    name: string;
    email: string;
}

export const useUserStore = defineStore('user', () => {
    const oauth = useOauthConfig();
    const accountCenterToken = useState<string>(() => ''); // 會員中心token
    const memToken = useState<string>(() => ''); // 會員平台token
    const accountCenterUser = useState<User | null>(() => null) // 會員中心使用者資料
    const isLogin = computed(() => memToken.value !== '' && accountCenterToken.value !== ''); // 是否登入

    /**
     * 取得會員中心使用者資料
     */
    const getUserInfo = async () => {
        const url = oauth.userInfoUri;
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + accountCenterToken.value,
            },
        })
        const json = await res.json();
        if (json.id) {
            return accountCenterUser.value = json;
        }
        return accountCenterUser.value = null;
    };


    /**
     * 登入
     */
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

    /**
     * 取得會員中心token
     * @param code OAuth2.0授權碼
     * @returns string 會員中心token
     */
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
                'Accept': 'application/json',
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

    /**
     * 拿會員中心的token交換會員平台token
     * @returns string 會員平台token
     */
    const getMemToken = async () => {
        const url = oauth.exchangeTokenUri;
        const data = new URLSearchParams({
            hotel_id: '1',
        });
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + accountCenterToken.value,
            },
            body: data,
        });
        const json = await res.json();
        console.log(json);
        if (json.access_token) {
            return memToken.value = json.access_token;
        }
        return memToken.value = "";
    }

    /**
     * 登出
     */
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
