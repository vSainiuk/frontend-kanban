'use client'

import { HEIGHT } from '@/constants/height-elements.constants'
import { DndNoDragProvider } from '@/contexts/DndNoDragContext'
import dynamic from 'next/dynamic'

const KanbanView = dynamic(() => import('./kanban-view/KanbanView'), {
	ssr: false,
})

export default function TasksPage() {
	return (
		<div
			className='pl-5'
			style={{
				height: `calc(100% - ${HEIGHT.header})`,
			}}
		>
			<DndNoDragProvider>
				<KanbanView />
			</DndNoDragProvider>
		</div>
	)
}
