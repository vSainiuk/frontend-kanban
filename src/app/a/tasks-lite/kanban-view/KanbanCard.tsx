import MarkdownEditor from '@/components/MarkdownEditor'
import Badge from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import DayPicker from '@/components/ui/task/day-picker/DayPicker'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { TransparentInput } from '@/components/ui/transparent-input'
import { cn } from '@/lib/utils'
import type { Task, TaskFormState } from '@/types/task.types'
import { UniqueIdentifier } from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'framer-motion'
import { BookOpen, GripVertical, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

interface KanbanCardProps {
	id: UniqueIdentifier
	task: Task
	onDeleteTask: (id: UniqueIdentifier) => void
}

export default function KanbanCard({
	id,
	task,
	onDeleteTask,
}: KanbanCardProps) {
	const { title, isCompleted, description, priority, createdAt } = task
	const { watch, control, register } = useForm<TaskFormState>({
		defaultValues: {
			title,
			description,
			priority,
			isCompleted,
			createdAt,
		},
	})

	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id, data: { type: 'task' } })

	const [isOpenMarkdownDialog, setIsOpenMarkdownDialog] = useState(false)

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	}

	return (
		<div className='relative'>
			<motion.div
				style={style}
				ref={setNodeRef}
				{...listeners}
				{...attributes}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0, y: 50 }}
				transition={{ duration: 0.5, ease: 'easeOut' }}
				className={cn(
					'grid grid-cols-[auto_30px] bg-card items-center gap-1 rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow relative',
					isDragging && 'opacity-50',
					watch('isCompleted') && 'line-through text-gray-400'
				)}
			>
				<button
					className='absolute right-2 bottom-2'
					onClick={() => id && onDeleteTask(id)}
				>
					<Trash2 className='w-4 h-4 transition-colors text-muted hover:text-destructive' />
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
													if (e.key === 'Enter' && !id) {
														e.preventDefault()
													}
												}}
												value={value}
												onChange={onChange}
											/>
										</TooltipTrigger>
										<TooltipContent alignOffset={400}>
											<p>{value}</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							)}
						/>

						{/* {!isCreateTaskFinished && !item.id && (
						<button
							onClick={() => setIsCreateTaskFinished(true)}
							className='w-fit'
							aria-describedby='todo-item'
						>
							<CheckCircle2 className='transition-colors text-muted hover:text-white' />
						</button>
					)} */}
					</div>
				</div>
			</motion.div>

			{!isDragging && (
				<Dialog
					aria-describedby='markdown-editor'
					open={isOpenMarkdownDialog}
					onOpenChange={() => setIsOpenMarkdownDialog(!isOpenMarkdownDialog)}
				>
					<DialogTrigger asChild>
						<BookOpen
							onClick={() => setIsOpenMarkdownDialog(!isOpenMarkdownDialog)}
							className='w-4 h-4 absolute top-2 right-2 text-muted hover:text-white'
						/>
					</DialogTrigger>
					<DialogContent
						aria-describedby='markdown-editor-content'
						className='max-w-screen-lg'
					>
						<DialogHeader>
							<DialogTitle />
							<DialogDescription />
						</DialogHeader>
						<MarkdownEditor title={title} />
					</DialogContent>
				</Dialog>
			)}
		</div>
	)
}
