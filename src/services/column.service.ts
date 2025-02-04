import { axiosWithAuth } from '@/api/interceptors'
import { Column, ColumnFormState } from '@/types/column.types'
import { OrderItemsDto } from '@/types/orderItemsDto'
import { UniqueIdentifier } from '@dnd-kit/core'

class ColumnService {
	private BASE_URL = '/user/columns'

	async getColumns() {
		const response = await axiosWithAuth.get<Column[]>(this.BASE_URL)
		return response
	}

	async createColumn(data: Column) {
		const response = await axiosWithAuth.post<Column>(this.BASE_URL, data)
		return response
	}

	async updateColumn(id: UniqueIdentifier, data: ColumnFormState) {
		const response = await axiosWithAuth.patch<Column>(
			`${this.BASE_URL}/${id}`,
			data
		)
		return response
	}

	async deleteColumn(id: UniqueIdentifier) {
		const response = await axiosWithAuth.delete<boolean>(
			`${this.BASE_URL}/${id}`
		)
		return response
	}

	async moveColumns(newColumns: OrderItemsDto[]) {
		const response = await axiosWithAuth.patch<Column[]>(
			this.BASE_URL,
			newColumns
		)
		return response
	}
}

export const columnService = new ColumnService()
