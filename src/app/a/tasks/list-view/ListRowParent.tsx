import { Task } from '@/types/task.types'
import { Draggable, Droppable } from '@hello-pangea/dnd'
import { FILTERS } from '../columns.data'
import { filterTasks } from '../filterTasks'
import ListAddNewRow from './ListAddNewRow'
import ListRow from './ListRow'

interface ListRowParentProps {
	rowId: string
	label: string
	items: Task[] | undefined
	setItems: React.Dispatch<React.SetStateAction<Task[] | undefined>>
}

export default function ListRowParent({
	rowId,
	label,
	items,
	setItems,
}: ListRowParentProps) {
	return (
		<Droppable droppableId={rowId}>
			{provider => {
				return (
					<div ref={provider.innerRef} {...provider.droppableProps}>
						<div className='border-b-2 border-border'>
							<h2>{label}</h2>
						</div>

						{filterTasks(items, rowId)?.map((item, index) => (
							<Draggable key={item.id} draggableId={item.id} index={index}>
								{provider => (
									<div
										ref={provider.innerRef}
										{...provider.draggableProps}
										{...provider.dragHandleProps}
									>
										<ListRow key={item.id} item={item} setItems={setItems} />
									</div>
								)}
							</Draggable>
						))}

						{provider.placeholder}

						{rowId !== 'completed' && !items?.some(item => !item.id) && (
							<ListAddNewRow
								setItems={setItems}
								filterDate={
									FILTERS[rowId] ? FILTERS[rowId].format() : undefined
								}
							/>
						)}
					</div>
				)
			}}
		</Droppable>
	)
}
