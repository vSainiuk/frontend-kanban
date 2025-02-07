import { useCreateTask } from '@/app/a/tasks-lite/hooks/useCreateTask'
import { useUpdateTask } from '@/app/a/tasks-lite/hooks/useUpdateTask'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { useOutside } from '@/hooks/useOutside'
import { Task } from '@/types/task.types'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import { Calendar1 } from 'lucide-react'
import { useState } from 'react'
import { DayPicker as DayPickerLib } from 'react-day-picker'
import 'react-day-picker/style.css'

dayjs.extend(LocalizedFormat)

interface DayPickerProps {
	task: Task
	onChange: (date: string) => void
	value: string | null
	isCompletedTask?: boolean
	setIsExistingTempTask: (value: boolean) => void
}

export default function DayPicker({
	task,
	onChange,
	value,
	isCompletedTask,
	setIsExistingTempTask,
}: DayPickerProps) {
	const { updateTask } = useUpdateTask()
	const { createTask } = useCreateTask()
	const [selectedDate, setSelectedDate] = useState<Date | null>(
		value ? dayjs(value).toDate() : null
	)
	const { isShow, setIsShow, ref } = useOutside(false)

	const handleDaySelect = (date: Date | undefined) => {
		if (!date) {
			return
		}

		const isoDate = date.toISOString()

		setSelectedDate(date)

		if (isoDate) {
			onChange(isoDate)
			if (value) {
				updateTask({ id: task.id, data: { createdAt: isoDate } })
			} else {
				const newTask = { ...task, createdAt: isoDate }
				createTask(newTask)
				setIsExistingTempTask(false)
			}

			setIsShow(false)
		} else {
			onChange('')
		}

		return date
	}

	return (
		<Dialog>
			<DialogTrigger
				className='relative flex items-center gap-2 border border-border rounded-3xl px-3 py-1'
				asChild
			>
				<button
					disabled={isCompletedTask}
					className='text-xs flex items-center gap-2'
				>
					<Calendar1 className='w-4 h-4' />
					{value ? dayjs(value).format('LL') : 'Select a date'}
				</button>
			</DialogTrigger>
			<DialogContent className='w-fit'>
				<DialogHeader>
					<DialogTitle>Select a Date</DialogTitle>
				</DialogHeader>
				<DayPickerLib
					className='bg-background rounded-2xl p-2'
					showOutsideDays
					fixedWeeks
					startMonth={new Date(2024, 0)}
					endMonth={new Date(2100, 0)}
					mode='single'
					defaultMonth={selectedDate || undefined}
					selected={selectedDate || undefined}
					onSelect={handleDaySelect}
					weekStartsOn={1}
				/>
			</DialogContent>
		</Dialog>
	)
}
