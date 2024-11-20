import type { Task } from '@/types/task.types'

interface KanbanAddNewCard {
	filterDate?: string | undefined
	setItems: React.Dispatch<React.SetStateAction<Task[] | undefined>>
}

export default function ListAddNewRow({
	filterDate,
	setItems,
}: KanbanAddNewCard) {
	const addRow = () => {
		setItems(prev => {
			if (!prev) return

			const newTask = {
				id: '',
				title: '',
				description: '',
				isCompleted: false,
				createdAt: filterDate,
			}

			return [newTask, ...prev]
		})
	}
	return (
		<div>
			<button className='italic' onClick={addRow}>
				Add task...
			</button>
		</div>
	)
}
