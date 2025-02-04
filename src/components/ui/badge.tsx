import { TaskPriority } from '@/types/task.types'

interface BadgeProps {
	children?: React.ReactNode
	priority: TaskPriority
}

export default function Badge({ children, priority }: BadgeProps) {
	const priorityColors = {
		'low': 'bg-[#029202]',
		'medium': 'bg-[#8a8a06]',
		'high': 'bg-[#930404]',
	}
	return (
		<span
			className={`block h-5 min-w-5 ${priorityColors[priority]} rounded-full text-white text-sm leading-[14px] p-1`}
		>
			{children}
		</span>
	)
}
