'use client'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import DialogTemplate from '@/components/ui/dialog-template'
import { useDndNoDragContext } from '@/contexts/DndNoDragContext'
import { cn } from '@/lib/utils'
import { columnService } from '@/services/column.service'
import { Column } from '@/types/column.types'
import { Task } from '@/types/task.types'
import { UniqueIdentifier } from '@dnd-kit/core'
import {
	rectSwappingStrategy,
	SortableContext,
	useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { AnimatePresence, motion } from 'framer-motion'
import { Edit2, GripHorizontal, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import KanbanAddNewCard from './KanbanAddNewItem'
import KanbanCard from './KanbanCard'

interface KanbanColumnProps {
	column: Column
	setColumns: React.Dispatch<React.SetStateAction<Column[] | undefined>>
	onAddTask: (columnId: UniqueIdentifier) => void
	onDeleteTask: (task: Task) => void
	onDeleteColumn: (columnId: UniqueIdentifier) => void
	tasks: Task[]
	isExistingTempTask: boolean
	setIsExistingTempTask: (value: boolean) => void
}

export default function KanbanColumn({
	column,
	setColumns,
	onAddTask,
	onDeleteTask,
	onDeleteColumn,
	tasks,
	isExistingTempTask,
	setIsExistingTempTask,
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

	const tasksIds = useMemo(() => tasks?.map(task => task.id), [tasks])

	const style = {
		transform: CSS.Translate.toString(transform),
		transition,
	}

	const [isEditColumnNameOpen, setIsEditColumnNameOpen] =
		useState<boolean>(false)
	const [newEditColumnName, setNewEditColumnName] = useState<string>(label)
	const { setDisabledDrag } = useDndNoDragContext()

	const handleEditColumnName = () => {
		setIsEditColumnNameOpen(false)

		const trimmedName = newEditColumnName.trim()

		if (!trimmedName || trimmedName === label) return

		columnService.updateColumn(id, { label: trimmedName }).then(() => {
			setNewEditColumnName(trimmedName)
			setColumns(prev =>
				prev?.map(col => (col.id === id ? { ...col, label: trimmedName } : col))
			)
		})
	}

	useEffect(() => {
		setDisabledDrag(isEditColumnNameOpen)
	}, [isEditColumnNameOpen])

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
					<h2 className='text-xl text-ellipsis max-w-[75%] overflow-hidden'>
						{label}
					</h2>

					<div className='flex gap-1 items-center'>
						<DialogTemplate
							open={isEditColumnNameOpen}
							setOpen={setIsEditColumnNameOpen}
							title='Edit column name'
							btnText='Save'
							onClick={handleEditColumnName}
							inputProps={{
								value: newEditColumnName,
								onChange: setNewEditColumnName,
							}}
						>
							<Edit2 className='w-4 h-4 transition-colors text-muted hover:text-white' />
						</DialogTemplate>

						<button className='w-fit' aria-describedby='todo-item'>
							<GripHorizontal className='hover:text-muted' />
						</button>

						{tasks.length > 0 ? (
							<Dialog>
								<DialogTrigger asChild>
									<Trash2 className='w-4 h-4 transition-colors text-muted hover:text-destructive' />
								</DialogTrigger>
								<DialogContent
									aria-describedby='modal-content'
									className='sm:max-w-[425px]'
								>
									<DialogHeader>
										<DialogTitle>Are you sure?</DialogTitle>
									</DialogHeader>
									<DialogDescription>
										Are you sure you want to delete this column? All tasks in
										this column will be deleted permanently.
									</DialogDescription>

									<Button
										variant='destructive'
										onClick={() => onDeleteColumn(id)}
									>
										Delete
									</Button>
								</DialogContent>
							</Dialog>
						) : (
							<Trash2
								onClick={() => onDeleteColumn(id)}
								className='w-4 h-4 transition-colors text-muted hover:text-destructive'
							/>
						)}
					</div>
				</div>

				<div className='flex flex-col gap-2'>
					<SortableContext strategy={rectSwappingStrategy} items={tasksIds}>
						<AnimatePresence>
							{tasks &&
								tasks.map(task => (
									<KanbanCard
										key={task.id}
										id={task.id}
										task={task}
										onDeleteTask={onDeleteTask}
										isExistingTempTask={isExistingTempTask}
										setIsExistingTempTask={setIsExistingTempTask}
									/>
								))}
						</AnimatePresence>
					</SortableContext>
				</div>

				{!isExistingTempTask && (
					<KanbanAddNewCard
						columnId={id}
						onClick={() => {
							setIsExistingTempTask(true)
							onAddTask(id)
						}}
					>
						Add task...
					</KanbanAddNewCard>
				)}
			</div>
		</motion.div>
	)
}
