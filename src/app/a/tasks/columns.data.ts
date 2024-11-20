import type { Task } from '@/types/task.types'
import dayjs, { type Dayjs } from 'dayjs'
import 'dayjs/locale/en'
import isoWeek from 'dayjs/plugin/isoWeek'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { filterTasks } from './filterTasks'

dayjs.extend(isoWeek)
dayjs.extend(weekOfYear)

export const FILTERS: Record<string, Dayjs> = {
	today: dayjs().startOf('day'),
	tomorrow: dayjs().add(1, 'day').startOf('day'),
	'on-this-week': dayjs().endOf('isoWeek'),
	'on-next-week': dayjs().add(1, 'week').startOf('day'),
	later: dayjs().add(2, 'week').startOf('day'),
}

export function Columns(items: Task[]) {
	const columns = [
		{
			id: 'backlog',
			label: 'Backlog',
			items: filterTasks(items, 'backlog'),
		},
		{
			id: 'today',
			label: 'Today',
			items: filterTasks(items, 'today'),
		},
		{
			id: 'tomorrow',
			label: 'Tomorrow',
			items: filterTasks(items, 'tomorrow'),
		},
		{
			id: 'on-this-week',
			label: 'This Week',
			items: filterTasks(items, 'on-this-week'),
		},
		{
			id: 'on-next-week',
			label: 'Next Week',
			items: filterTasks(items, 'on-next-week'),
		},
		{
			id: 'later',
			label: 'Later',
			items: filterTasks(items, 'later'),
		},
		{
			id: 'completed',
			label: 'Completed',
			items: filterTasks(items, 'completed'),
		},
	]

	return columns
}
