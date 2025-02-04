import { DNDType } from '@/types/dndtype.types'
import { Task } from '@/types/task.types'

export function mapTasksToColumns(tasks: Task[] | undefined): DNDType[] {
	if (!tasks) {
		return []
	}
	return []
}
