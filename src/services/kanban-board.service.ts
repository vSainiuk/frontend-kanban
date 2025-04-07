import { axiosWithAuth } from '@/api/interceptors'
import { KanbanBoard, KanbanBoardFormState } from '@/types/kanban-board.type'

class KanbanBoardService {
	private BASE_URL = '/user/kanban-boards'

	async getKanbanBoards() {
		const response = await axiosWithAuth.get<KanbanBoard[]>(this.BASE_URL)
		return response
	}

	async getKanbanBoard(slug: string) {
		const response = await axiosWithAuth.get<KanbanBoard>(
			`${this.BASE_URL}/${slug}`
		)
		return response
	}

	async createKanbanBoard(data: KanbanBoardFormState) {
		const response = await axiosWithAuth.post<KanbanBoard>(this.BASE_URL, data)
		return response
	}

	async removeKanbanBoard(id: string) {
		const response = await axiosWithAuth.delete<boolean>(
			`${this.BASE_URL}/${id}`
		)
		return response
	}

	async updateKanbanBoard(id: string, data: KanbanBoardFormState) {
		const response = await axiosWithAuth.patch<KanbanBoard>(
			`${this.BASE_URL}/${id}`,
			data
		)
		return response
	}
}

export const kanbanBoardService = new KanbanBoardService()
