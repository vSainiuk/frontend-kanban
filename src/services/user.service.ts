import { axiosWithAuth } from '@/api/interceptors'
import { TypeUserForm } from '@/types/auth.types'
import { User } from '@/types/user.types'

interface ProfileResponse {
	user: User
	statistics: [
		{ label: string; value: number },
		{ label: string; value: number },
		{ label: string; value: number },
		{ label: string; value: number },
	]
}

class UserService {
	private BASE_URL = 'user/profile'

	async getProfile() {
		const response = await axiosWithAuth.get<ProfileResponse>(this.BASE_URL)
		return response.data
	}

	async updateProfile(data: TypeUserForm) {
		const response = await axiosWithAuth.put(this.BASE_URL, data)
		return response.data
	}
}

export const userService = new UserService()
