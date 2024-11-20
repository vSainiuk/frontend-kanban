import Badge from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import Loader from '@/components/ui/loader'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import DayPicker from '@/components/ui/task/day-picker/DayPicker'
import { Textarea } from '@/components/ui/textarea'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { TransparentInput } from '@/components/ui/transparent-input'
import { cn } from '@/lib/utils'
import type { Task, TaskFormState } from '@/types/task.types'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'framer-motion'
import { CheckCircle2, GripVertical, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDeleteTask } from '../hooks/useDeleteTask'
import { useTaskDebounce } from '../hooks/useTaskDebounce'

interface KanbanCardProps {
	item: Task
	setItems: React.Dispatch<React.SetStateAction<Task[] | undefined>>
}

export default function KanbanCard({ item, setItems }: KanbanCardProps) {
	const { watch, control, register } = useForm<TaskFormState>({
		defaultValues: {
			title: item.title,
			description: item.description,
			priority: item.priority,
			isCompleted: item.isCompleted,
			createdAt: item.createdAt,
		},
	})

	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: item.id })

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	}

	const [isCreateTaskFinished, setIsCreateTaskFinished] =
		useState<boolean>(false)
	const [isDateChanged, setIsDateChanged] = useState<boolean>(false)
	useTaskDebounce({
		watch,
		itemId: item.id,
		isCreateTaskFinished,
		isDateChanged,
	})
	const { deleteTask, isPendingDeleteTask } = useDeleteTask()
	return (
		<motion.div
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.5, ease: 'easeOut' }}
			className={cn(
				'grid grid-cols-[auto_30px] bg-card items-center gap-1 rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow relative',
				watch('isCompleted') && 'line-through text-gray-400'
			)}
		>
			<button
				className='absolute right-2 bottom-2'
				onClick={() =>
					item.id ? deleteTask(item.id) : setItems(prev => prev?.slice(0, -1))
				}
			>
				{isPendingDeleteTask ? (
					<Loader />
				) : (
					<Trash2 className='w-4 h-4 transition-colors text-muted hover:text-destructive' />
				)}
			</button>

			<div className='flex flex-col gap-1'>
				<div className='flex gap-1 items-center'>
					<button className='w-fit' aria-describedby='todo-item'>
						<GripVertical className='hover:text-muted' />
					</button>

					<Controller
						name='isCompleted'
						control={control}
						render={({ field: { value, onChange } }) => (
							<Checkbox
								className='w-6 h-6'
								checked={value}
								onCheckedChange={onChange}
							/>
						)}
					/>

					<Controller
						name='createdAt'
						control={control}
						render={({ field: { value, onChange } }) => (
							<DayPicker
								value={value || ''}
								onChange={date => {
									onChange(date)
									setIsDateChanged(true)
								}}
							/>
						)}
					/>
					<Controller
						name='priority'
						control={control}
						render={({ field: { value, onChange } }) => (
							<Select value={value || ''} onValueChange={onChange}>
								<SelectTrigger className='bg-transparent border-none p-0 rounded-md w-fit'>
									<SelectValue placeholder='Priority' />
								</SelectTrigger>
								<SelectContent className='bg-background'>
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

				<div className='flex items-center gap-1'>
					<Controller
						name='title'
						control={control}
						render={({ field: { value, onChange } }) => (
							<TooltipProvider>
								<Tooltip delayDuration={300}>
									<TooltipTrigger asChild>
										<TransparentInput
											onKeyDown={e => {
												if (e.key === 'Enter' && !item.id) {
													e.preventDefault()
													setIsCreateTaskFinished(true)
												}
											}}
											value={value}
											onChange={onChange}
										/>
									</TooltipTrigger>
									<TooltipContent alignOffset={400}>
										<div className='w-[300px] h-[300px] bg-primary select-text'>
											Lorem ipsum dolor sit amet consectetur adipisicing elit.
											Facere error eveniet obcaecati unde harum deserunt
											blanditiis quod enim fugiat laborum ut iusto voluptatum
											placeat quos, doloremque sint debitis ex exercitationem.
											<Textarea value={value} onChange={onChange} />
										</div>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						)}
					/>

					{!isCreateTaskFinished && !item.id && (
						<button
							onClick={() => setIsCreateTaskFinished(true)}
							className='w-fit'
							aria-describedby='todo-item'
						>
							<CheckCircle2 className='transition-colors text-muted hover:text-white' />
						</button>
					)}
				</div>
			</div>
		</motion.div>
	)
}
