import { useOutside } from '@/hooks/useOutside'
import { cn } from '@/lib/utils'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import { X } from 'lucide-react'
import { useState } from 'react'
import { DayPicker as DayPickerLib } from 'react-day-picker'
import 'react-day-picker/style.css'

dayjs.extend(LocalizedFormat)

interface DayPickerProps {
	onChange: (date: string) => void
	value: string
	position?: 'left' | 'right'
}

export default function DayPicker({
	onChange,
	value,
	position = 'right',
}: DayPickerProps) {
	const [selectedDate, setSelectedDate] = useState<Date>()
	const { isShow, setIsShow, ref } = useOutside(false)

	const handleDaySelect = (date: Date | undefined) => {
		if (!date) {
			onChange('')
			return
		}
		const isoDate = date.toISOString()

		setSelectedDate(date)
		if (isoDate) {
			onChange(isoDate)
			setIsShow(false)
		} else {
			onChange('')
		}

		return date
	}

	return (
		<div
			className='relative flex items-center gap-2 border border-border rounded-3xl px-3 py-1'
			ref={ref}
		>
			<button className='text-xs' onClick={() => setIsShow(!isShow)}>
				{value ? dayjs(value).format('LL') : 'Select a date'}
			</button>
			{value && (
				<button className='text-xs' onClick={() => onChange('')}>
					<X className='w-4 h-4 text-muted transition-colors hover:text-white' />
				</button>
			)}
			{isShow && (
				<div
					className={cn(
						'absolute',
						position === 'left' ? '-left-96' : 'left-44'
					)}
				>
					<DayPickerLib
						showOutsideDays
						fixedWeeks
						startMonth={new Date(2024, 0)}
						endMonth={new Date(2100, 0)}
						mode='single'
						defaultMonth={selectedDate}
						selected={selectedDate}
						onSelect={handleDaySelect}
						weekStartsOn={1}
						// formatters={{ formatCaption }} /// TODO: Implement formatCaption
					/>
				</div>
			)}
		</div>
	)
}
