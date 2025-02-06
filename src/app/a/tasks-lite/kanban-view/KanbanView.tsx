'use client'

import DialogTemplate from '@/components/ui/dialog-template'
import Loader from '@/components/ui/loader'
import { HEIGHT } from '@/constants/height-elements.constants'
import { useMarkdownContext } from '@/contexts/MarkdownContext'
import { columnService } from '@/services/column.service'
import { taskService } from '@/services/task.service'
import { OrderItemsDto } from '@/types/orderItemsDto'
import { Task, TasksByColumn } from '@/types/task.types'
import createOrderedItems from '@/utils/createOrderedItems'
import {
	closestCorners,
	DndContext,
	DragEndEvent,
	DragOverEvent,
	DragOverlay,
	DragStartEvent,
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
} from '@dnd-kit/sortable'
import cuid from 'cuid'
import { AnimatePresence } from 'framer-motion'
import debounce from 'lodash.debounce'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useColumns } from '../hooks/useColumns'
import { useTasks } from '../hooks/useTasks'
import KanbanAddNewItem from './KanbanAddNewItem'
import KanbanCard from './KanbanCard'
import KanbanColumn from './KanbanColumn'

const KanbanView = React.memo(
	function KanbanView() {
		const { isMarkdownOpen } = useMarkdownContext()
		const { columns, setColumns } = useColumns()
		const { tasks: data } = useTasks()
		const [tasks, setTasks] = useState<TasksByColumn>({})
		const [activeTask, setActiveTask] = useState<Task | null>(null)
		const [isExistingTempTask, setIsExistingTempTask] = useState<boolean>(false)

		const debouncedUpdateTasksRef = useRef(
			debounce((updatedTasks: OrderItemsDto[]) => {
				taskService.moveTasks(updatedTasks)
			}, 1000)
		).current

		useEffect(() => {
			if (data) {
				const groupedTasks = data.reduce((acc: TasksByColumn, task: Task) => {
					if (!acc[task.columnId]) {
						acc[task.columnId] = []
					}
					acc[task.columnId].push(task)
					return acc
				}, {})

				setTasks(groupedTasks)
			}
		}, [data])

		const columnsIds = useMemo(
			() => columns?.map(column => column.id),
			[columns]
		)

		// const { containerRef, handleMouseMove, setIsHoveringScrollbar } =  ///TODO: How to optimize this?
		// 	useHorizontalScroll()

		// DND STATE Region start
		const [columnName, setColumnName] = useState<string>('')
		const [showAddColumnModal, setShowAddColumnModal] = useState(false)
		// DND STATE Region end

		// DND HANDLERS Region start
		const mouseSensor = useSensor(MouseSensor, {
			activationConstraint: {
				distance: 2,
			},
		})

		const touchSensor = useSensor(TouchSensor, {
			activationConstraint: {
				delay: 200,
				tolerance: 6,
			},
		})

		const customSensors = useSensors(mouseSensor, touchSensor)

		// const handlePointerDown = (event: any) => {
		// 	if (event.target.closest('[data-no-dnd]')) {
		// 		event.stopPropagation()
		// 	}
		// }

		// useEffect(() => {
		// 	document.addEventListener('pointerdown', handlePointerDown)
		// 	return () => {
		// 		document.removeEventListener('pointerdown', handlePointerDown)
		// 	}
		// }, [])

		function onAddColumn() {
			if (!columnName) return

			const newColumn = {
				id: `column-${cuid()}`,
				label: columnName,
				order: columns ? columns.length : 0,
				tasks: [],
			}

			columnService.createColumn(newColumn).then(createdColumn => {
				setColumns(prev =>
					prev ? [...prev, createdColumn.data] : [createdColumn.data]
				)
				setTasks(prev => ({ ...prev, [createdColumn.data.id]: [] }))
				setColumnName('')
				setShowAddColumnModal(false)
			})
		}

		function onDeleteColumn(columnId: UniqueIdentifier) {
			columnService
				.deleteColumn(columnId)
				.then(() => {
					setColumns(prevColumns => {
						if (!prevColumns) return prevColumns

						const updatedColumns = prevColumns.filter(
							column => column.id !== columnId
						)

						const newTasks = Object.fromEntries(
							Object.entries(tasks).filter(([key]) => key !== columnId)
						)
						setTasks(newTasks)

						const orderedColumnsToBD = createOrderedItems(updatedColumns)

						columnService.moveColumns(orderedColumnsToBD)

						return updatedColumns
					})
				})
				.catch(error => {
					console.error('Error deleting column:', error)
				})
		}

		function onAddTask(columnId: UniqueIdentifier) {
			const newTask: Task = {
				id: `task-${cuid()}`,
				columnId: columnId as string,
				isCompleted: false,
				title: '',
				description: '',
				order: tasks[columnId as string]?.length || 0,
			}

			setTasks(prev => ({
				...prev,
				[columnId]: [...(prev[columnId] || []), newTask],
			}))
		}

		function onDeleteTask({ id, columnId }: Task) {
			setTasks(prev => {
				if (!prev[columnId]) return prev

				return {
					...prev,
					[columnId]: prev[columnId].filter(task => task.id !== id),
				}
			})
		}

		function onDragStart(event: DragStartEvent) {
			if (event.active.data.current?.type === 'Task') {
				setActiveTask(event.active.data.current.task)
				return
			}
		}

		function onDragOver(event: DragOverEvent) {
			const { active, over } = event

			if (!over || active.id === over.id) return

			const activeId = active.id
			const overId = over.id
			const isActiveTask = active.data.current?.type === 'Task'
			const isOverTask = over.data.current?.type === 'Task'
			const isOverColumn = over.data.current?.type === 'Column'

			if (!isActiveTask) return

			const activeColumnId = active.data.current?.task.columnId
			const overColumnId = isOverTask
				? over.data.current?.task.columnId
				: isOverColumn
					? overId
					: null

			// Dropping a task over another task in the same column
			if (isActiveTask && isOverTask && activeColumnId === overColumnId) {
				setTasks(prevTasks => {
					if (!prevTasks) return prevTasks

					const activeIndex = prevTasks[activeColumnId].findIndex(
						t => t.id === activeId
					)
					const overIndex = prevTasks[overColumnId].findIndex(
						t => t.id === overId
					)

					const result = arrayMove(
						prevTasks[activeColumnId],
						activeIndex,
						overIndex
					)

					const newTasks = createOrderedItems(result)
					debouncedUpdateTasksRef(newTasks)

					return {
						...prevTasks,
						[activeColumnId]: result,
					}
				})
			} else {
				// Dropping a task over a task in a different column
				setTasks(prevTasks => {
					const activeTasks = [...(prevTasks[activeColumnId] || [])]
					const overTasks = [...(prevTasks[overColumnId] || [])]

					console.log('activeTasks', activeTasks)
					console.log('overTasks', overTasks)

					const activeIndex = activeTasks.findIndex(
						task => task.id === activeId
					)

					console.log('activeIndex', activeIndex)

					if (activeIndex === -1) return prevTasks

					const [movedTask] = activeTasks.splice(activeIndex, 1)

					const isOverLastTask =
						overTasks.length > 0 &&
						overTasks[overTasks.length - 1].id === overId

					console.log('isOverLastTask', isOverLastTask)

					const overIndex = isOverLastTask
						? overTasks.length
						: overTasks.findIndex(task => task.id === overId)

					const updatedOverTasks = [
						...overTasks.slice(0, overIndex),
						{ ...movedTask, columnId: overColumnId },
						...overTasks.slice(overIndex),
					]

					const orderedActiveTasks = createOrderedItems(activeTasks)
					const orderedOverTasks = createOrderedItems(updatedOverTasks)

					debouncedUpdateTasksRef([...orderedActiveTasks, ...orderedOverTasks])
					taskService.updateTask(activeId as string, { columnId: overColumnId })

					return {
						...prevTasks,
						[activeColumnId]: activeTasks,
						[overColumnId]: updatedOverTasks,
					}
				})
			}

			// Dropping a task over a column
			if (isActiveTask && isOverColumn) {
				setTasks(prevTasks => {
					if (!prevTasks) return prevTasks

					const activeIndex = prevTasks[activeColumnId].findIndex(
						t => t.id === activeId
					)

					const result = arrayMove(
						prevTasks[activeColumnId],
						activeIndex,
						prevTasks[overColumnId].length
					)

					return {
						...prevTasks,
						[activeColumnId]: result,
					}
				})
			}
		}

		function onDragEnd(event: DragEndEvent) {
			setActiveTask(null)
			const { active, over } = event

			if (!over) return

			const isActiveColumn = active.data.current?.type === 'Column'
			const isOverColumn = over.data.current?.type === 'Column'

			const activeColumnId = active.id
			const overColumnId = over.id

			if (activeColumnId === overColumnId) return

			if (isActiveColumn && isOverColumn) {
				setColumns(prevColumns => {
					if (!prevColumns) return prevColumns
					const activeColumnIndex = prevColumns?.findIndex(
						column => column.id === activeColumnId
					)

					const overColumnIndex = prevColumns?.findIndex(
						column => column.id === overColumnId
					)

					const result = arrayMove(
						prevColumns,
						activeColumnIndex,
						overColumnIndex
					)

					const newColumns = createOrderedItems(result)

					columnService.moveColumns(newColumns)

					return result
				})
			}
		}
		// DND HANDLERS Region end

		if (!columns) return <Loader />

		return (
			<div
				// ref={containerRef}
				// onMouseMove={handleMouseMove}
				// onMouseLeave={() => setIsHoveringScrollbar(false)}
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
					sensors={customSensors}
					collisionDetection={closestCorners}
				>
					<SortableContext
						disabled={isMarkdownOpen}
						strategy={rectSwappingStrategy}
						items={columnsIds as string[]}
					>
						<AnimatePresence>
							{columns.map(column => {
								return (
									<KanbanColumn
										column={column}
										setColumns={setColumns}
										key={column.id}
										onAddTask={onAddTask}
										onDeleteTask={onDeleteTask}
										onDeleteColumn={onDeleteColumn}
										tasks={tasks[column.id as string] || []}
										isExistingTempTask={isExistingTempTask}
										setIsExistingTempTask={setIsExistingTempTask}
									/>
								)
							})}
						</AnimatePresence>

						{
							<DialogTemplate
								open={showAddColumnModal}
								setOpen={setShowAddColumnModal}
								btnText='Add column'
								title='Add a name of a new column'
								onClick={onAddColumn}
								inputProps={{
									value: columnName,
									onChange: setColumnName,
								}}
							>
								<KanbanAddNewItem>Add column...</KanbanAddNewItem>
							</DialogTemplate>
						}
					</SortableContext>

					{createPortal(
						<DragOverlay>
							{activeTask && (
								<KanbanCard /// TODO: create a CardOverlay component
									id={activeTask.id}
									task={activeTask}
									onDeleteTask={onDeleteTask}
									isExistingTempTask={false}
									setIsExistingTempTask={function (value: boolean): void {
										throw new Error('Function not implemented.')
									}}
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
