import { DragDropContext } from '@hello-pangea/dnd'
import { Columns } from '../columns.data'
import { useTaskDnd } from '../hooks/useTaskDnd'
import { useTasks } from '../hooks/useTasks'
import ListRowParent from './ListRowParent'

export default function ListView() {
	const { items, setItems } = useTasks()
	const { onDragEnd } = useTaskDnd()

	if(!items) return null
	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<div>
				<div>
					<div>Task title</div>
					<div>Due date</div>
					<div>Priority</div>
					<div></div>
				</div>

				<div className='flex flex-col gap-4'>
					{Columns(items).map(column => (
						<ListRowParent
							key={column.id}
							rowId={column.id}
							label={column.label}
							items={items}
							setItems={setItems}
						/>
					))}
				</div>
			</div>
		</DragDropContext>
	)
}
