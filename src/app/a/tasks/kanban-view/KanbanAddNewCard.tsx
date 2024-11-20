import type { Task } from '@/types/task.types'

interface KanbanAddNewCard {
	filterDate?: string | undefined
	setItems: React.Dispatch<React.SetStateAction<Task[] | undefined>>
}

export default function KanbanAddNewCard({
	filterDate,
	setItems,
}: KanbanAddNewCard) {
	const addCard = () => {
		setItems(prev => {
			if (!prev) return

			const newTask = {
				id: '',
				title: '',
				description: '',
				isCompleted: false,
				createdAt: filterDate,
			}

			return [...prev, newTask]
		})
	}
	return (
		<div>
			<button
				className='italic mt-3 text-muted transition-colors hover:text-white'
				onClick={addCard}
			>
				Add task...
			</button>
		</div>
	)
}
