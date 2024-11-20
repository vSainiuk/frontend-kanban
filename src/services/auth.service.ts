import { axiosInstance } from '@/api/interceptors'
import { AuthForm, AuthResponse } from '@/types/auth.types'
import { removeTokenStorage, saveTokenStorage } from './auth-token.service'

export const authService = {
	async main(type: 'login' | 'register', data: AuthForm) {
		const response = await axiosInstance.post<AuthResponse>(
			`/auth/${type}`,
			data
		)

		if (response.data.access_token) saveTokenStorage(response.data.access_token)
		return response
	},
	async getNewTokens() {
		const response = await axiosInstance.post<AuthResponse>(
			'/auth/login/access-token'
		)

		if (response.data.access_token) saveTokenStorage(response.data.access_token)
		return response
	},
	async logout() {
		const response = await axiosInstance.post<boolean>('/auth/logout')

		if (response.data) removeTokenStorage()
		return response
	},
}
