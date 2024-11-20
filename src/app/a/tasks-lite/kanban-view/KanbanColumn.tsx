import { cn } from '@/lib/utils'
import { Column } from '@/types/column.types'
import { UniqueIdentifier } from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'framer-motion'
import { GripHorizontal, Trash2 } from 'lucide-react'
import KanbanAddNewCard from './KanbanAddNewItem'

interface KanbanColumnProps {
	column: Column
	children: React.ReactNode
	onAddTask: (columnId: UniqueIdentifier) => void
	onDeleteColumn: (columnId: UniqueIdentifier) => void
}

export default function KanbanColumn({
	column,
	children,
	onAddTask,
	onDeleteColumn,
}: KanbanColumnProps) {
	const { id, label } = column
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id,
		data: {
			type: 'Column',
			column,
		},
	})

	const style = {
		transform: CSS.Translate.toString(transform),
		transition,
	}

	return (
		<motion.div
			ref={setNodeRef}
			style={style}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0, y: 50 }}
			transition={{ duration: 0.5, ease: 'easeOut' }}
			{...attributes}
			{...listeners}
		>
			<div className={cn('mb-4 p-2', isDragging && 'opacity-50')}>
				<div className='flex items-center justify-between border-b-2 border-border mb-2'>
					<h2 className='text-xl italic'>{label}</h2>
					<div className='flex gap-1 items-center'>
						<button className='w-fit' aria-describedby='todo-item'>
							<GripHorizontal className='hover:text-muted' />
						</button>
						<button className='' onClick={() => onDeleteColumn(id)}>
							<Trash2 className='w-4 h-4 transition-colors text-muted hover:text-destructive' />
						</button>
					</div>
				</div>

				<div className='flex flex-col gap-2'>{children}</div>

				<KanbanAddNewCard
					columnId={id}
					onClick={() => {
						onAddTask(id)
					}}
				>
					Add task...
				</KanbanAddNewCard>
			</div>
		</motion.div>
	)
}
