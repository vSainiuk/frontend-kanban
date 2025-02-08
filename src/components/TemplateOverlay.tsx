
import KanbanCard from '@/app/a/tasks-lite/kanban-view/KanbanCard'
import KanbanColumn from '@/app/a/tasks-lite/kanban-view/KanbanColumn'
import { Column } from '@/types/column.types'
import { Task } from '@/types/task.types'

interface TemplateOverlayProps {
	task?: Task
	column?: Column
	tasks?: Task[]
}

const TemplateOverlay = ({
	task,
	column,
	tasks
}: TemplateOverlayProps) => {

	console.log('column', column)
	if (task) {
		return (
			<KanbanCard
				id={task.id}
				task={task}
				isExistingTempTask={false}
				onDeleteTask={() => {}}
				setIsExistingTempTask={() => {}}
			/>
		)
	}

	if (column) {
		return (
			<KanbanColumn
				column={column}
				tasks={tasks || []}
				isExistingTempTask={false}
				onAddTask={() => {}}
				onDeleteColumn={() => {}}
				onDeleteTask={() => {}}
				setColumns={() => {}}
				setIsExistingTempTask={() => {}}
			/>
		)
	}

	return null
}

export default TemplateOverlay
