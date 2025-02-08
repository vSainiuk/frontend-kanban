import { axiosWithAuth } from '@/api/interceptors'

export async function saveImageToS3(file: File) {
	const formData = new FormData()
	formData.append('file', file)

	const response = await axiosWithAuth.post('/upload', formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	})

	return response
}
