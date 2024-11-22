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
import { Input } from '@/components/ui/input'
import Loader from '@/components/ui/loader'
import { HEIGHT } from '@/constants/height-elements.constants'
import { useHorizontalScroll } from '@/hooks/useHorizontalScroll'
import { Column } from '@/types/column.types'
import { Task } from '@/types/task.types'
import {
	closestCorners,
	DndContext,
	DragEndEvent,
	DragOverEvent,
	DragOverlay,
	DragStartEvent,
	KeyboardSensor,
	MouseSensor,
	TouchSensor,
	UniqueIdentifier,
	useSensor,
	useSensors,
} from '@dnd-kit/core'
import {
	arrayMove,
	rectSwappingStrategy,
	SortableContext,
	sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import cuid from 'cuid'
import { AnimatePresence } from 'framer-motion'
import React, { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { useColumns } from '../../tasks/hooks/useColumns'
import KanbanAddNewItem from './KanbanAddNewItem'
import KanbanCard from './KanbanCard'
import KanbanColumn from './KanbanColumn'

const KanbanView = React.memo(
	function KanbanView() {
		const { columns, setColumns } = useColumns()
		const [activeColumn, setActiveColumn] = useState<Column | null>(null)
		const [activeTask, setActiveTask] = useState<Task | null>(null)
		const columnsIds = useMemo(
			() => columns?.map(column => column.id),
			[columns]
		)

		console.log('columns', columns)

		const { containerRef, handleMouseMove, setIsHoveringScrollbar } =
			useHorizontalScroll()

		// DND STATE Region start
		const [columnName, setColumnName] = useState<string>('')
		const [showAddColumnModal, setShowAddColumnModal] = useState(false)
		// DND STATE Region end

		// DND HANDLERS Region start
		const sensors = useSensors(
			useSensor(MouseSensor, {
				activationConstraint: {
					distance: 2,
				},
			}),
			useSensor(TouchSensor, {
				activationConstraint: {
					delay: 200,
					tolerance: 6,
				},
			}),
			useSensor(KeyboardSensor, {
				coordinateGetter: sortableKeyboardCoordinates,
			})
		)

		function findColumnByType(id: UniqueIdentifier | undefined, type: string) {
			if (type === 'column') {
				return columns.find(column => column.id === id)
			}

			if (type === 'task') {
				return columns.find(column => column.tasks.find(task => task.id === id))
			}
		}

		function onAddColumn() {
			if (!columnName) return

			const newColumn = {
				id: `column-${cuid()}`,
				label: columnName,
				order: columns ? columns.length : 0,
				tasks: [],
			}

			setColumns(prev => (prev ? [...prev, newColumn] : [newColumn]))
			setColumnName('')
			setShowAddColumnModal(false)
		}
		function onDeleteColumn(columnId: UniqueIdentifier) {
			setColumns(
				prevColumns =>
					prevColumns && prevColumns.filter(column => column.id !== columnId)
			)
		}
		function onAddTask(columnId: UniqueIdentifier) {
			setColumns(prevColumns => {
				if (!prevColumns) return prevColumns
				return prevColumns.map(column =>
					column.id === columnId
						? {
								...column,
								tasks: [
									...column.tasks,
									{
										id: `task-${cuid()}`,
										title: '',
										isCompleted: false,
										order: column.tasks.length,
										columnId: column.id,
									},
								],
							}
						: column
				)
			})
		}

		function onDeleteTask(taskId: UniqueIdentifier) {
			setColumns(
				prevColumns =>
					prevColumns &&
					prevColumns.map(column => ({
						...column,
						tasks: column.tasks.filter(task => task.id !== taskId),
					}))
			)
		}

		function onDragStart(event: DragStartEvent) {
			if (event.active.data.current?.type === 'Column') {
				setActiveColumn(event.active.data.current.column)
				return
			}

			if (event.active.data.current?.type === 'Task') {
				setActiveTask(event.active.data.current.task)
				return
			}
		}

		function onDragOver(event: DragOverEvent) {
			const { active, over } = event;
	
			if (!over || active.id === over.id) return;
	
			const activeId = active.id;
			const overId = over.id;
	
			const isActiveTask = active.data.current?.type === 'Task';
			const isOverTask = over.data.current?.type === 'Task';

			if(!isActiveTask) return
	
			// Dropping task over another task
			if (isActiveTask && isOverTask) {
					setColumns(prevColumns => {
							if (!prevColumns) return prevColumns;
	
							const activeColumn = prevColumns.find(column =>
									column.tasks.some(task => task.id === activeId)
							);
	
							if (!activeColumn) return prevColumns;
	
							const activeTaskIndex = activeColumn.tasks.findIndex(
									task => task.id === activeId
							);
	
							if (activeTaskIndex === -1) return prevColumns;
	
							const activeTask = activeColumn.tasks[activeTaskIndex];
	
							// Найти целевую колонку и задание, над которым происходит перетаскивание
							const overColumn = prevColumns.find(column =>
									column.tasks.some(task => task.id === overId)
							);
	
							if (!overColumn) return prevColumns;
	
							const overTaskIndex = overColumn.tasks.findIndex(
									task => task.id === overId
							);
	
							if (overTaskIndex === -1) return prevColumns;
	
							// Если активное задание и целевая колонка совпадают, только меняем порядок
							if (activeColumn.id === overColumn.id) {
									const updatedTasks = arrayMove(
											activeColumn.tasks,
											activeTaskIndex,
											overTaskIndex
									);
	
									return prevColumns.map(column =>
											column.id === activeColumn.id
													? { ...column, tasks: updatedTasks }
													: column
									);
							}
	
							// Если колонки разные: удаляем из исходной, добавляем в целевую
							const updatedActiveColumn = {
									...activeColumn,
									tasks: activeColumn.tasks.filter(task => task.id !== activeId),
							};
	
							const updatedOverColumn = {
									...overColumn,
									tasks: [
											...overColumn.tasks.slice(0, overTaskIndex),
											activeTask,
											...overColumn.tasks.slice(overTaskIndex),
									],
							};
	
							return prevColumns.map(column => {
									if (column.id === updatedActiveColumn.id) return updatedActiveColumn;
									if (column.id === updatedOverColumn.id) return updatedOverColumn;
									return column;
							});
					});
			}

			// Dropping task over a column
			const isOverColumn = over.data.current?.type === 'Column';

			if(isActiveTask && isOverColumn) {
				setColumns(prevColumns => {
					if (!prevColumns) return prevColumns;
	
					const activeColumn = prevColumns.find(column =>
							column.tasks.some(task => task.id === activeId)
					);
	
					if (!activeColumn) return prevColumns;
	
					const activeTaskIndex = activeColumn.tasks.findIndex(
							task => task.id === activeId
					);
	
					const activeTask = activeColumn.tasks[activeTaskIndex];
	
					const updatedActiveColumn = {
							...activeColumn,
							tasks: activeColumn.tasks.filter(task => task.id !== activeId),
					};
	
					const updatedOverColumn = {
							...over.data.current?.column,
							tasks: [...over.data.current?.column.tasks, activeTask],
					};
	
					return prevColumns.map(column => {
							if (column.id === updatedActiveColumn.id) return updatedActiveColumn;
							if (column.id === updatedOverColumn.id) return updatedOverColumn;
							return column;
					});
				});
			}
		}
	
		function onDragEnd(event: DragEndEvent) {
			setActiveColumn(null)
			setActiveTask(null)
			const { active, over } = event

			if (!over) return

			const activeColumnId = active.id
			const overColumnId = over.id

			if (activeColumnId === overColumnId) return

			setColumns(prevColumns => {
				if (!prevColumns) return prevColumns
				const activeColumnIndex = prevColumns?.findIndex(
					column => column.id === activeColumnId
				)

				const overColumnIndex = prevColumns?.findIndex(
					column => column.id === overColumnId
				)

				return arrayMove(prevColumns, activeColumnIndex, overColumnIndex)
			})
		}
		// DND HANDLERS Region end

		if (!columns) return <Loader />

		return (
			<div
				ref={containerRef}
				onMouseMove={handleMouseMove}
				onMouseLeave={() => setIsHoveringScrollbar(false)}
				className='grid gap-4 overflow-x-auto'
				style={{
					height: `calc(100% - ${HEIGHT.switcher})`,
					gridAutoFlow: 'column',
					gridTemplateColumns: `repeat(${columns.length}, 345px)`,
					whiteSpace: 'nowrap',
				}}
			>
				<DndContext
					onDragStart={onDragStart}
					onDragOver={onDragOver}
					onDragEnd={onDragEnd}
					sensors={sensors}
					collisionDetection={closestCorners}
				>
					<SortableContext
						strategy={rectSwappingStrategy}
						items={columnsIds as string[]}
					>
						<AnimatePresence>
							{columns.map(column => {
								return (
									<KanbanColumn
										column={column}
										key={column.id}
										onAddTask={onAddTask}
										onDeleteColumn={onDeleteColumn}
									>
										<SortableContext
											strategy={rectSwappingStrategy}
											items={column.tasks.map(task => task.id)}
										>
											<AnimatePresence>
												{column.tasks.map(task => (
													<KanbanCard
														key={task.id}
														id={task.id}
														task={task}
														onDeleteTask={onDeleteTask}
													/>
												))}
											</AnimatePresence>
										</SortableContext>
									</KanbanColumn>
								)
							})}
						</AnimatePresence>

						{
							<Dialog
								open={showAddColumnModal}
								onOpenChange={() => setShowAddColumnModal(prev => !prev)}
							>
								<DialogTrigger asChild>
									<KanbanAddNewItem>Add column...</KanbanAddNewItem>
								</DialogTrigger>
								<DialogContent
									aria-describedby='modal-content'
									className='sm:max-w-md'
								>
									<DialogHeader className='flex gap-2'>
										<DialogTitle>Add a name of a new column</DialogTitle>
										<DialogDescription>
											<Input
												value={columnName}
												type='text'
												name='columnName'
												onChange={e => setColumnName(e.target.value)}
												placeholder='Column name'
											/>
										</DialogDescription>
									</DialogHeader>

									<Button variant={'default'} onClick={onAddColumn}>
										Add column
									</Button>
								</DialogContent>
							</Dialog>
						}
					</SortableContext>

					{createPortal(
						<DragOverlay>
							{activeTask && (
								<KanbanCard
									id={activeTask.id}
									task={activeTask}
									onDeleteTask={onDeleteTask}
								/>
							)}
						</DragOverlay>,
						document.body
					)}
				</DndContext>
			</div>
		)
	},
	() => true
)

export default KanbanView
