import Badge from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import DayPicker from '@/components/ui/task/day-picker/DayPicker'
import { TransparentInput } from '@/components/ui/transparent-input'
import { cn } from '@/lib/utils'
import type { Task, TaskFormState } from '@/types/task.types'
import { GripVertical, Trash2 } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { useDeleteTask } from '../hooks/useDeleteTask'
import { useTaskDebounce } from '../hooks/useTaskDebounce'

interface ListRowProps {
	item: Task
	setItems: React.Dispatch<React.SetStateAction<Task[] | undefined>>
}

export default function ListRow({ item, setItems }: ListRowProps) {
	const { watch, control, register } = useForm<TaskFormState>({
		defaultValues: {
			title: item.title,
			description: item.description,
			priority: item.priority,
			isCompleted: item.isCompleted,
			createdAt: item.createdAt,
		},
	})
	useTaskDebounce({ watch, itemId: item.id })
	const { deleteTask, isPendingDeleteTask } = useDeleteTask()
	return (
		<div
			className={cn(
				'grid grid-cols-[1fr_auto_auto_auto] bg-gray-900/50 items-center gap-4 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow'
			)}
		>
			{/* INPUT + GRIP */}
			<div className='flex'>
				<button
					aria-describedby='todo-item'
					className='text-gray-400 focus:outline-none'
				>
					<GripVertical className='w-5 h-5' />
				</button>

				<Controller
					control={control}
					name='isCompleted'
					render={({ field: { value, onChange } }) => (
						console.log('value', value, onChange),
						(
							<Checkbox
								checked={value}
								onChange={onChange}
								className='h-5 w-5'
							/>
						)
					)}
				/>

				<TransparentInput {...register('title')} />
			</div>
			{/* DATE */}
			<Controller
				control={control}
				name='createdAt'
				render={({ field: { value, onChange } }) => (
					<DayPicker position='left' value={value || ''} onChange={onChange} />
				)}
			/>
			{/* SELECT */}
			<div className=''>
				<Controller
					control={control}
					name='priority'
					render={({ field: { value, onChange } }) => (
						<Select value={value || ''} onValueChange={onChange}>
							<SelectTrigger className='bg-gray-800 border-transparent rounded-md px-2 py-1'>
								<SelectValue placeholder='Priority' />
							</SelectTrigger>
							<SelectContent>
								{['low', 'medium', 'high'].map(priority => (
									<SelectItem key={priority} value={priority}>
										<Badge>{priority}</Badge>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}
				/>
			</div>
			<div className='text-red-500 hover:text-red-700 transition-colors'>
				<button
					onClick={() => {
						item.id ? deleteTask(item.id) : setItems(prev => prev?.slice(0, -1))
					}}
					disabled={isPendingDeleteTask}
					className='flex items-center gap-1 text-sm'
				>
					<Trash2 className='w-5 h-5' />
					{isPendingDeleteTask ? 'Deleting...' : 'Delete'}
				</button>
			</div>
		</div>
	)
}
