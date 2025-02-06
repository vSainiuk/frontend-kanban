import {
	getAccessToken,
	removeTokenStorage,
} from '@/services/auth-token.service'
import { authService } from '@/services/auth.service'
import axios, { type CreateAxiosDefaults } from 'axios'
import { errorCatch } from './error'

const options: CreateAxiosDefaults = {
	baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4200/api',
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true,
}

const axiosInstance = axios.create(options)
const axiosWithAuth = axios.create(options)

axiosWithAuth.interceptors.request.use(config => {
	const accessToken = getAccessToken()

	if (accessToken && config?.headers) {
		config.headers.Authorization = `Bearer ${accessToken}`
	}

	return config
})

axiosWithAuth.interceptors.response.use(
	config => {
		return config
	},

	async error => {
		const originalRequest = error.config
		if (
			(error.response.status === 401 ||
				errorCatch(error) === 'jwt expired' ||
				errorCatch(error) === 'jwt must be provided') &&
			error.config &&
			!error.config._isRetry
		) {
			originalRequest._isRetry = true
			try {
				await authService.getNewTokens()

				return axiosWithAuth.request(originalRequest)
			} catch (error) {
				removeTokenStorage()
				window.location.href = '/auth'
			}
		}

		throw error
	}
)

export { axiosInstance, axiosWithAuth }
