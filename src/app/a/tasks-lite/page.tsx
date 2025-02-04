'use client'

import { HEIGHT } from '@/constants/height-elements.constants'
import { MarkdownProvider } from '@/contexts/MarkdownContext'
import dynamic from 'next/dynamic'

const KanbanView = dynamic(() => import('./kanban-view/KanbanView'), { ssr: false })

export default function TasksPage() {
	return (
		<div
			className='px-5'
			style={{
				height: `calc(100% - ${HEIGHT.header})`,
			}}
		>
			<MarkdownProvider>
				<KanbanView />
			</MarkdownProvider>
		</div>
	)
}
