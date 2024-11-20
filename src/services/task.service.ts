import { axiosWithAuth } from '@/api/interceptors'
import { Task, TaskFormState } from '@/types/task.types'

class TaskService {
	private BASE_URL = '/user/tasks'

	async getTasks() {
		const response = await axiosWithAuth.get<Task[]>(this.BASE_URL)
		return response
	}

	async createTask(data: TaskFormState) {
		const response = await axiosWithAuth.post<Task>(this.BASE_URL, data)
		return response
	}

	async updateTask(id: string, data: TaskFormState) {
		const response = await axiosWithAuth.put<Task>(
			`${this.BASE_URL}/${id}`,
			data
		)
		return response
	}

	async updateTasks(data: Task[]) {
		const response = await axiosWithAuth.put<Task[]>(this.BASE_URL, data)
		return response
	}

	async deleteTask(id: string) {
		const response = await axiosWithAuth.delete<boolean>(
			`${this.BASE_URL}/${id}`
		)
		return response
	}
}

export const taskService = new TaskService()
