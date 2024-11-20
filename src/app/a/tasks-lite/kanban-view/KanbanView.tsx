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
import {
	closestCorners,
	DndContext,
	DragEndEvent,
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
				console.log('columnId', columnId, 'prevColumns', prevColumns)
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
		}

		function onDragEnd(event: DragEndEvent) {
			const { active, over } = event

			console.log('columns', columns, 'active', active, 'over', over)

			if (!over) return

			const activeColumn = findColumnByType(active.id, 'column')
			const overColumn = findColumnByType(over.id, 'column')
			const activeColumnOfTask = findColumnByType(active.id, 'task')
			const overColumnOfTask = findColumnByType(over.id, 'task')

			// Handle column reordering
			if (activeColumn && overColumn && activeColumn.id !== overColumn.id) {
				const activeColumnIndex = columns.findIndex(
					column => column.id === activeColumn.id
				)
				const overColumnIndex = columns.findIndex(
					column => column.id === overColumn.id
				)

				let newColumns = [...columns]
				newColumns = arrayMove(newColumns, activeColumnIndex, overColumnIndex)

				setColumns(newColumns)
			}

			// Handle task reordering
			if (activeColumnOfTask && overColumnOfTask) {
				const activeColumnIndex = columns.findIndex(
					column => column.id === activeColumnOfTask.id
				)
				const overColumnIndex = columns.findIndex(
					column => column.id === overColumnOfTask.id
				)

				const activeTaskIndex = activeColumnOfTask.tasks.findIndex(
					task => task.id === active.id
				)
				const overTaskIndex = overColumnOfTask.tasks.findIndex(
					task => task.id === over.id
				)

				// In the same column
				if (activeColumnIndex === overColumnIndex) {
					let newColumns = [...columns]
					newColumns[activeColumnIndex].tasks = arrayMove(
						newColumns[activeColumnIndex].tasks,
						activeTaskIndex,
						overTaskIndex
					)
					setColumns(newColumns)
				} else {
					// In different column
					let newColumns = [...columns]
					const [removed] = newColumns[activeColumnIndex].tasks.splice(
						activeTaskIndex,
						1
					)
					newColumns[overColumnIndex].tasks.splice(overTaskIndex, 0, removed)
					setColumns(newColumns)
				}
			}

			// Handling task drop into a empty column
			if (activeColumnOfTask && overColumn) {
				const activeColumnIndex = columns.findIndex(
					column => column.id === activeColumnOfTask.id
				)
				const overColumnIndex = columns.findIndex(
					column => column.id === overColumn.id
				)
				// Find the index of the task in the active column
				const activeTaskIndex = activeColumnOfTask.tasks.findIndex(
					task => task.id === active.id
				)

				let newColumns = [...columns]
				const [removed] = newColumns[activeColumnIndex].tasks.splice(
					activeTaskIndex,
					1
				)

				newColumns[overColumnIndex].tasks.push(removed)
				setColumns(newColumns)
			}
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
					onDragEnd={onDragEnd}
					sensors={sensors}
					collisionDetection={closestCorners}
				>
					<SortableContext
						strategy={rectSwappingStrategy}
						items={columnsIds as string[]}
					>
						<AnimatePresence>
							{columns.map(column => (
								<KanbanColumn
									column={column}
									key={column.id}
									onAddTask={onAddTask}
									onDeleteColumn={onDeleteColumn}
								>
									<SortableContext
										strategy={rectSwappingStrategy}
										items={column.tasks}
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
							))}
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
				</DndContext>
			</div>
		)
	},
	() => true
)

export default KanbanView
