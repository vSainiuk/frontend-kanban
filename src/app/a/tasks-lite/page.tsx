'use client'

import { HEIGHT } from '@/constants/height-elements.constants'
import KanbanView from './kanban-view/KanbanView'



export default function TasksPage() {
	return (
		<div
			style={{
				height: `calc(100% - ${HEIGHT.header})`,
			}}
		>
			<KanbanView />
		</div>
	)
}
