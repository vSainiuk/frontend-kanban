import { useUpdateTask } from '@/app/a/tasks-lite/hooks/useUpdateTask'
import { cn } from '@/lib/utils'
import { TaskPriority } from '@/types/task.types'
import Badge from './ui/badge'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './ui/select'

interface PrioritySelectProps {
	taskId: string
	priority: string
	setPriority: (value: string) => void
	isCompleted: boolean
}

export default function PrioritySelect({
	taskId,
	priority,
	setPriority,
	isCompleted,
}: PrioritySelectProps) {
	const { updateTask } = useUpdateTask()
	return (
		<Select
			disabled={isCompleted}
			value={priority}
			onValueChange={(value: string) => {
				if (value === priority) return
				setPriority(value)
				updateTask({ id: taskId, data: { priority: value as TaskPriority } })
			}}
		>
			<SelectTrigger className='bg-transparent border-none p-0 rounded-md w-fit'>
				<SelectValue placeholder='Priority' />
			</SelectTrigger>
			<SelectContent className='bg-background min-w-10'>
				{['low', 'medium', 'high'].map(p => (
					<SelectItem
						className={cn(
							priority === p ? 'hover:translate-x-0' : 'hover:translate-x-1',
							'cursor-pointer transition-transform'
						)}
						key={p}
						value={p}
					>
						<Badge priority={p as TaskPriority}></Badge>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}
