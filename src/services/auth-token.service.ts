import Cookies from 'js-cookie'

export enum EnumTokens {
	ACCESS_TOKEN = 'access_token',
	REFRESH_TOKEN = 'refresh_token',
}

export const getAccessToken = () => {
	const accessToken = Cookies.get(EnumTokens.ACCESS_TOKEN)
	return accessToken || null
}

export const saveTokenStorage = (token: string) => {
	Cookies.set(EnumTokens.ACCESS_TOKEN, token, {
		expires: 1,
		sameSite: 'lax',
		secure: true,
		partitioned: true,
	})
}

export const removeTokenStorage = () => {
	Cookies.remove(EnumTokens.ACCESS_TOKEN)
}
