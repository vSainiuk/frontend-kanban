import { ColumnEnum } from '@/types/column.enum'
import { Task } from '@/types/task.types'
import { reorder } from '@/utils/reorder'
import type { DropResult } from '@hello-pangea/dnd'
import { FILTERS } from '../columns.data'
import { useTasks } from './useTasks'
import { useUpdateTask } from './useUpdateTask'
import { useUpdateTasks } from './useUpdateTasks'

export function useTaskDnd() {
	const { updateTask } = useUpdateTask()
	const { updateTasks } = useUpdateTasks()

	const onDragEnd = (result: DropResult) => {
		const { source, destination } = result
		if (!destination || !items?.length) return

		const destinationColumnId = destination.droppableId

		if (destinationColumnId === source.droppableId) {
			const newItems = reorder<Task>({
				list: items,
				startIndex: source.index,
				endIndex: destination.index,
			})

			setItems(newItems)
			updateTasks({
				data: newItems,
			})
			return
		}

		if (destinationColumnId === ColumnEnum.completed) {
			updateTask({
				id: result.draggableId,
				data: {
					isCompleted: true,
				},
			})

			return
		}

		const newCreatedAt = FILTERS[destinationColumnId].format()

		updateTask({
			id: result.draggableId,
			data: {
				createdAt: newCreatedAt,
				isCompleted: false,
			},
		})
	}

	return { onDragEnd }
}
