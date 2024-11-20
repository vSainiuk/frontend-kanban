import type { Task } from '@/types/task.types'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import { FILTERS } from './columns.data'

dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

export function filterTasks(
	tasks: Task[] | undefined,
	filter: keyof typeof FILTERS
) {
	switch (filter) {
		case 'today':
			return tasks?.filter(
				task =>
					dayjs(task.createdAt).isSame(FILTERS.today, 'day') &&
					!task.isCompleted
			)

		case 'tomorrow':
			return tasks?.filter(
				task =>
					dayjs(task.createdAt).isSame(FILTERS.tomorrow, 'day') &&
					!task.isCompleted
			)

		case 'on-this-week':
			return tasks?.filter(
				task =>
					!dayjs(task.createdAt).isSame(FILTERS.today, 'day') &&
					!dayjs(task.createdAt).isSame(FILTERS.tomorrow, 'day') &&
					dayjs(task.createdAt).isSameOrBefore(FILTERS['on-this-week']) &&
					!task.isCompleted
			)

		case 'on-next-week':
			return tasks?.filter(
				task =>
					!dayjs(task.createdAt).isSame(FILTERS.tomorrow, 'day') &&
					dayjs(task.createdAt).isAfter(FILTERS['on-this-week']) &&
					dayjs(task.createdAt).isSameOrAfter(FILTERS['on-next-week']) &&
					!task.isCompleted
			)

		case 'later':
			return tasks?.filter(
				task =>
					(dayjs(task.createdAt).isAfter(FILTERS['on-next-week']) ||
						!task.createdAt) &&
					!task.isCompleted
			)

		case 'completed':
			return tasks?.filter(task => task.isCompleted)

		default:
			return []
	}
}
