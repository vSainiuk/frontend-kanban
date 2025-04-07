'use client'

import BoardList from '@/components/board-list/BoardList'
import { HEIGHT } from '@/constants/height-elements.constants'
import { DndNoDragProvider } from '@/contexts/DndNoDragContext'
import { useProfile } from '@/hooks/useProfile'
import KanbanView from './kanban-view/KanbanView'

export default function KanbanViewPage({ boardSlug }: { boardSlug: string }) {
	const { data } = useProfile()
	const backgroundImageUrl = data?.user?.backgroundImageUrl
	return (
		<div
			className='flex bg-cover bg-center bg-no-repeat'
			style={{
				height: `calc(100% - ${HEIGHT.header})`,
				backgroundImage: backgroundImageUrl
					? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImageUrl})`
					: '',
			}}
		>
			<BoardList />

			<DndNoDragProvider>
				<KanbanView slug={boardSlug} />
			</DndNoDragProvider>
		</div>
	)
}
