import Loader from '@/components/ui/loader'
import { HEIGHT } from '@/constants/height-elements.constants'
import { useHorizontalScroll } from '@/hooks/useHorizontalScroll'
import {
	closestCorners,
	DndContext,
	DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core'
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import React from 'react'
import { Columns, FILTERS } from '../columns.data'
import { useTaskDnd } from '../hooks/useTaskDnd'
import { useTasks } from '../hooks/useTasks'
import { useUpdateTasks } from '../hooks/useUpdateTasks'
import KanbanCardParent from './KanbanCardParent'
import { useUpdateTask } from '../hooks/useUpdateTask'

const KanbanView = React.memo(
	function KanbanView() {
		const { updateTasks } = useUpdateTasks()
		const { updateTask } = useUpdateTask()

		const { items, setItems } = useTasks()
		const { onDragEnd } = useTaskDnd()
		const { containerRef, handleMouseMove, setIsHoveringScrollbar } =
			useHorizontalScroll()

		function handleDragEnd(event: DragEndEvent) {
			const { active, over } = event
			if (!over) return

			if (active.id !== over.id) {
				setItems(items => {
					if (!items) return
					const oldIndex = items.findIndex(item => item.id === active.id)
					const newIndex = items.findIndex(item => item.id === over.id)

					const newArray = arrayMove(items, oldIndex, newIndex)

					// updateTasks({
					// 	data: newArray,
					// })

					// const newCreatedAt = FILTERS[destinationColumnId].format()

					// updateTask({
					// 	id: over.id.toString(),
					// 	data: {
					// 		createdAt: newCreatedAt,
					// 		isCompleted: false,
					// 	},
					// })

					return newArray
				})
			}
		}

		// DND HANDLERS Region start

		const sensors = useSensors(
			useSensor(PointerSensor),
			useSensor(KeyboardSensor, {
				coordinateGetter: sortableKeyboardCoordinates,
			})
		)
		// DND HANDLERS Region end

		if (!items) return <Loader />
		return (
			<DndContext
				onDragEnd={handleDragEnd}
				sensors={sensors}
				collisionDetection={closestCorners}
			>
				<SortableContext items={items}>
					<div
						ref={containerRef}
						onMouseMove={handleMouseMove}
						onMouseLeave={() => setIsHoveringScrollbar(false)}
						className='grid gap-4 overflow-x-auto'
						style={{
							height: `calc(100% - ${HEIGHT.switcher})`,
							gridAutoFlow: 'column',
							gridTemplateColumns: `repeat(${Columns(items).length}, 345px)`,
							whiteSpace: 'nowrap',
						}}
					>
						{Columns(items).map(column => (
							<KanbanCardParent
								key={column.id}
								rowId={column.id}
								label={column.label}
								items={items}
								setItems={setItems}
							/>
						))}
					</div>
				</SortableContext>
			</DndContext>
		)
	},
	() => true
)

export default KanbanView
