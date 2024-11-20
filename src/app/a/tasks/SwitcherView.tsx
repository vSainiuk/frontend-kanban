'use client'

import { HEIGHT } from '@/constants/height-elements.constants'
import { cn } from '@/lib/utils'
import { Kanban, ListTodo } from 'lucide-react'
import type { TypeView } from './TasksView'

interface SwitcherViewProps {
	type: 'list' | 'kanban'
	setType: (type: TypeView) => void
}

export default function SwitcherView({ setType, type }: SwitcherViewProps) {
	return (
		<div
			style={{ height: `${HEIGHT.switcher}` }}
			className='flex items-center gap-4'
		>
			<button
				onClick={() => setType('list')}
				className={cn('flex items-center gap-1', {
					'opacity-40 transition-opacity hover:opacity-100': type === 'kanban',
				})}
			>
				<ListTodo />
				List
			</button>

			<button
				onClick={() => setType('kanban')}
				className={cn('flex items-center gap-1', {
					'opacity-40 transition-opacity hover:opacity-100': type === 'list',
				})}
			>
				<Kanban />
				Kanban
			</button>
		</div>
	)
}
