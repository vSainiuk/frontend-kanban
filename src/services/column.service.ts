import { axiosWithAuth } from '@/api/interceptors'
import { Column } from '@/types/column.types'

class ColumnService {
	private BASE_URL = '/user/columns'

	async getColumns() {
		const response = await axiosWithAuth.get<Column[]>(this.BASE_URL)
		return response
	}
}

export const columnService = new ColumnService()