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
		console.log('config NOT error', config)
		return config
	},

	async error => {
		const originalRequest = error.config

		console.log('axiosWithAuth.interceptor')

		if (
			(error.response.status === 401 ||
				errorCatch(error) === 'jwt expired' ||
				errorCatch(error) === 'jwt must be provided') &&
			error.config &&
			!error.config._isRetry
		) {
			console.log('axiosWithAuth.interceptor (IF)')
			originalRequest._isRetry = true
			try {
				await authService.getNewTokens()

				console.log('await authService.getNewTokens()')

				return axiosWithAuth.request(originalRequest)
			} catch (error) {
				if (errorCatch(error) === 'jwt expired') {

					console.log('jwt expired, removeTokenStorage()')

					removeTokenStorage()
				}
			}
		}

		throw error
	}
)

export { axiosInstance, axiosWithAuth }
