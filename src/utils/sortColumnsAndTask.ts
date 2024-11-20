import { Column } from '@/types/column.types'

export function sortColumnsAndTasks(columns: Column[]) {
	return columns
		.sort((a, b) => a.order - b.order)
		.map(column => ({
			...column,
			tasks: column.tasks.sort((a, b) => a.order - b.order),
		}))
}
