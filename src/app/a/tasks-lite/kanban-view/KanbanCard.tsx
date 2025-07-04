'use client'

import MarkdownEditor from '@/components/MarkdownEditor'
import PrioritySelect from '@/components/PrioritySelect'
import BookOpenIcon from '@/components/ui/book-open-icon'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import DayPicker from '@/components/ui/task/day-picker/DayPicker'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { TransparentInput } from '@/components/ui/transparent-input'
import { useDndNoDragContext } from '@/contexts/DndNoDragContext'
import { cn } from '@/lib/utils'
import type { Task, TaskPriority } from '@/types/task.types'
import { UniqueIdentifier } from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { UseMutateFunction } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { motion } from 'framer-motion'
import {
	BookOpen,
	BookOpenText,
	CircleCheck,
	GripVertical,
	Trash2,
} from 'lucide-react'
import { memo, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useCreateTask } from '../hooks/useCreateTask'
import { useDeleteTask } from '../hooks/useDeleteTask'
import { useTaskDebounce } from '../hooks/useTaskDebounce'
import { useUpdateTask } from '../hooks/useUpdateTask'

interface KanbanCardProps {
	id: UniqueIdentifier
	task: Task
	onDeleteTask: (task: Task) => void
	isExistingTempTask: boolean
	setIsExistingTempTask: (value: boolean) => void
}
const KanbanCard = memo(
	function KanbanCard({
		id,
		task,
		onDeleteTask,
		isExistingTempTask,
		setIsExistingTempTask,
	}: KanbanCardProps) {
		const { updateTask } = useUpdateTask()
		const [title, setTitle] = useState(task.title)
		const [isCompleted, setIsCompleted] = useState(task.isCompleted)
		const [description, setDescription] = useState(task.description)
		const [priority, setPriority] = useState(task.priority || 'low')
		const [createdAt, setCreatedAt] = useState(task.createdAt)

		const [isDeletedTask, setIsDeletedTask] = useState(false)
		const deleteTimeoutRef = useRef<NodeJS.Timeout | null>(null)

		const handleDeleteTask = () => {
			setIsDeletedTask(true)
			setIsExistingTempTask(false)

			const duration = 5000

			const toastId = toast(
				<div className='lg:w-[300px] relative flex items-center justify-between gap-4 p-2 pb-4 bg-background rounded-2xl shadow-md border border-border'>
					<div className='flex flex-col max-w-[200px]'>
						<p className='text-sm font-medium'>Task deleted</p>
						<span className='text-xs text-muted-foreground truncate block'>
							{`"${title ? title : 'Untitled task'}"`}
						</span>
					</div>
					<Button
						variant='ghost'
						className='ml-4'
						onClick={() => {
							if (!createdAt) setIsExistingTempTask(true)
							setIsDeletedTask(false)
							if (deleteTimeoutRef.current) {
								clearTimeout(deleteTimeoutRef.current)
							}
							toast.dismiss(toastId)
						}}
					>
						Undo
					</Button>
					<div className='absolute left-3 bottom-2 h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-md animate-progress w-full' />
				</div>,
				{
					unstyled: true,
					duration,
				}
			)

			deleteTimeoutRef.current = setTimeout(() => {
				if (createdAt) deleteTask(task.id)
				onDeleteTask(task)
				toast.dismiss(toastId)
			}, duration)
		}

		const handleCreateTask = () => {
			setIsExistingTempTask(false)

			createTask({
				title,
				isCompleted,
				columnId: task.columnId,
				order: task.order,
				description,
				priority: (priority as TaskPriority) || undefined,
			})
		}

		useEffect(() => {
			const handleUnload = () => {
				if (isDeletedTask) {
					deleteTask(task.id)
					onDeleteTask(task)
				}
			}

			window.addEventListener('beforeunload', handleUnload)
			return () => {
				window.removeEventListener('beforeunload', handleUnload)
			}
		}, [isDeletedTask, task.id])

		const {
			attributes,
			listeners,
			setNodeRef,
			transform,
			transition,
			isDragging,
		} = useSortable({ id, data: { type: 'Task', task } })

		const { createTask } = useCreateTask()
		const { deleteTask } = useDeleteTask()

		useTaskDebounce({
			itemId: task.id,
			isNewTask: createdAt ? false : true,
			formState: {
				title,
				description,
			},
		})

		const handleTaskComplete = (val: boolean) => {
			setIsCompleted(val)
			if (task.createdAt) {
				updateTask({
					id: task.id,
					data: {
						isCompleted: val,
					},
				})
			}
		}

		const { setDisabledDrag } = useDndNoDragContext()
		const [isOpenMarkdownDialog, setIsOpenMarkdownDialog] = useState(false)

		const style = {
			transform: CSS.Transform.toString(transform),
			transition,
		}

		if (isDragging) {
			return (
				<div className='relative w-[325px] h-[100px]'>
					<motion.div
						style={style}
						ref={setNodeRef}
						{...listeners}
						{...attributes}
						className={cn(
							'h-full w-full border border-purple-700/50',
							'grid grid-cols-[auto_30px] items-center gap-1 rounded-2xl p-4 shadow-md transition-shadow relative bg-card/75',
							isDragging ? 'opacity-50' : '',
							isCompleted ? '' : ''
						)}
					></motion.div>
				</div>
			)
		}

		if (isDeletedTask) return null

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
						'grid grid-cols-[auto_30px] items-center gap-1 rounded-2xl p-4 shadow-lg transition-shadow relative bg-card/75',
						isDragging && 'opacity-50',
						isCompleted ? '' : ''
					)}
				>
					<KanbanCardContent
						task={task}
						title={title}
						description={description}
						setTitle={setTitle}
						isCompleted={isCompleted}
						setIsCompleted={handleTaskComplete}
						priority={priority}
						setPriority={setPriority}
						createdAt={createdAt as string}
						setCreatedAt={setCreatedAt}
						handleDeleteTask={handleDeleteTask}
						setIsOpenMarkdownDialog={setIsOpenMarkdownDialog}
						createTask={createTask}
						deleteTask={deleteTask}
						setIsExistingTempTask={setIsExistingTempTask}
						handleCreateTask={handleCreateTask}
					/>
				</motion.div>

				{!isDragging && (
					<Dialog
						aria-describedby='markdown-editor'
						open={isOpenMarkdownDialog}
						onOpenChange={open => {
							setIsOpenMarkdownDialog(open)
							setDisabledDrag(open)
						}}
					>
						<DialogTrigger asChild>
							<BookOpenIcon
								onClick={() => setIsOpenMarkdownDialog(!isOpenMarkdownDialog)}
								className={cn(
									'w-5 h-5 absolute top-2 right-2 ',
									description
										? 'text-white hover:text-muted'
										: 'text-muted hover:text-white'
								)}
								Component={description ? BookOpenText : BookOpen}
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
							<MarkdownEditor
								title={title}
								description={description}
								setDescription={setDescription}
								isCompletedTask={isCompleted}
							/>
						</DialogContent>
					</Dialog>
				)}
			</div>
		)
	},
	(prevProps, nextProps) => {
		return JSON.stringify(prevProps.task) === JSON.stringify(nextProps.task)
	}
)

const KanbanCardContent = memo(
	({
		task,
		title,
		setTitle,
		isCompleted,
		setIsCompleted,
		priority,
		setPriority,
		description,
		createdAt,
		setCreatedAt,
		handleDeleteTask,
		setIsOpenMarkdownDialog,
		createTask,
		deleteTask,
		setIsExistingTempTask,
		handleCreateTask,
	}: {
		task: Task
		title: string
		description?: string
		setTitle: (val: string) => void
		isCompleted: boolean
		setIsCompleted: (val: boolean) => void
		priority: string
		setPriority: (val: string) => void
		createdAt: string | null
		setCreatedAt: (val: string) => void
		handleDeleteTask: (task: Task) => void
		setIsOpenMarkdownDialog: (val: boolean) => void
		createTask: UseMutateFunction<
			AxiosResponse<Task, any>,
			Error,
			Partial<Omit<Task, 'id' | 'updatedAt'>>,
			unknown
		>
		deleteTask: (id: string) => void
		setIsExistingTempTask: (value: boolean) => void
		handleCreateTask: () => void
	}) => {
		const inputRef = useRef<HTMLInputElement | null>(null)

		useEffect(() => {
			if (!createdAt && inputRef.current) {
				inputRef.current.focus()
			}
		}, [createdAt])

		return (
			<>
				<button
					className='group absolute right-2 bottom-2'
					onClick={() => handleDeleteTask(task)}
				>
					<Trash2 className='w-5 h-5 transition-colors text-muted group-hover:text-destructive' />
				</button>

				<div className={cn(`flex flex-col gap-1`, isCompleted && 'text-muted')}>
					<div className='flex gap-1 items-center'>
						<button className='w-fit' aria-describedby='todo-item'>
							<GripVertical className='text-white hover:text-muted' />
						</button>

						<Checkbox
							className='w-6 h-6'
							checked={isCompleted}
							onCheckedChange={setIsCompleted}
						/>
						<DayPicker
							task={task}
							isCompletedTask={isCompleted}
							value={createdAt}
							onChange={setCreatedAt}
							setIsExistingTempTask={setIsExistingTempTask}
						/>
						<PrioritySelect
							taskId={task.id}
							taskCreatedAt={task.createdAt}
							priority={priority}
							setPriority={setPriority}
							isCompleted={isCompleted}
						/>
					</div>

					<div className='flex items-center gap-1'>
						<TooltipProvider>
							<Tooltip delayDuration={300}>
								<TooltipTrigger asChild>
									<TransparentInput
										ref={inputRef}
										onMouseDown={e => e.stopPropagation()}
										disabled={isCompleted}
										value={title}
										onChange={e => setTitle(e.target.value)}
										onKeyDown={e => {
											if (e.key === 'Enter' && !createdAt) {
												handleCreateTask()
											}
										}}
									/>
								</TooltipTrigger>
								{!!title && (
									<TooltipContent
										className='bg-background text-white px-4 py-2 rounded-xl shadow-lg border border-border
              			max-w-[300px] text-sm leading-tight tracking-wide'
										alignOffset={400}
										onMouseDown={e => e.stopPropagation()}
									>
										<p className='whitespace-normal break-words'>{title}</p>
									</TooltipContent>
								)}
							</Tooltip>
						</TooltipProvider>

						{!createdAt && (
							<CircleCheck
								onClick={handleCreateTask}
								className={cn(
									'hover:text-green-500 transition-colors',
									'w-6 h-6',
									isCompleted && 'text-white'
								)}
							/>
						)}
					</div>
				</div>
			</>
		)
	},
	(prevProps, nextProps) => {
		return (
			prevProps.title === nextProps.title &&
			prevProps.description === nextProps.description &&
			prevProps.isCompleted === nextProps.isCompleted &&
			prevProps.priority === nextProps.priority &&
			prevProps.createdAt === nextProps.createdAt
		)
	}
)

export default memo(KanbanCard)
