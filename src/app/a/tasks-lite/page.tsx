'use client'

import { HEIGHT } from '@/constants/height-elements.constants'
import { DndNoDragProvider } from '@/contexts/DndNoDragContext'
import { useProfile } from '@/hooks/useProfile'
import dynamic from 'next/dynamic'

const KanbanView = dynamic(() => import('./kanban-view/KanbanView'), {
	ssr: false,
})

export default function TasksPage() {
	const { data } = useProfile()
	const backgroundImageUrl = data?.user?.backgroundImageUrl

	return (
		<div
			className='pl-5 bg-cover bg-center bg-no-repeat'
			style={{
				height: `calc(100% - ${HEIGHT.header})`,
				backgroundImage: backgroundImageUrl
					? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImageUrl})`
					: '',
			}}
		>
			<DndNoDragProvider>
				<KanbanView />
			</DndNoDragProvider>
		</div>
	)
}
