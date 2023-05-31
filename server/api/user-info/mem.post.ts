import { useOauthConfig } from '~/config/oauth';
import type { User } from '~/store/user';
const oauth = useOauthConfig();

/**
 * 取得會員中心使用者資料
 */
export default defineEventHandler(async (event): Promise<User> => {
    const body = await readBody(event)

    const url = oauth.userInfoUri;
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + body.accessToken,
        },
    })

    const userInfo = await res.json() as User;

    if (!userInfo) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid token'
        })
    }

    return {
        id: userInfo.id,
        name: userInfo.name,
        email: userInfo.email,
    }
})
