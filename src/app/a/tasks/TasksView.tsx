'use client'

import Loader from '@/components/ui/loader'
import { HEIGHT } from '@/constants/height-elements.constants'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import KanbanView from './kanban-view/KanbanView'
import ListView from './list-view/ListView'
import SwitcherView from './SwitcherView'

export type TypeView = 'list' | 'kanban'

export default function TasksView() {
	const [type, setType, isLoading] = useLocalStorage<TypeView>(
		'tasks-view',
		'list'
	)

	if (isLoading) return <Loader />
	return (
		<div
			style={{
				height: `calc(100% - ${HEIGHT.header})`,
			}}
		>
			<SwitcherView setType={setType} type={type} />
			{type === 'list' ? <ListView /> : <KanbanView />}
		</div>
	)
}
