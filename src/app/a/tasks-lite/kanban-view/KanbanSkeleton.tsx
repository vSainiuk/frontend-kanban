'use client'

import { Skeleton } from '@/components/ui/skeleton'

const COLUMN_COUNT = 3
const TASKS_PER_COLUMN = 3

export default function KanbanSkeleton() {
	return (
		<div
			className='grid gap-4 overflow-x-auto p-2'
			style={{
				width: '100%',
				gridAutoFlow: 'column',
				gridTemplateColumns: `repeat(${COLUMN_COUNT}, 325px)`,
				whiteSpace: 'nowrap',
			}}
		>
			{Array.from({ length: COLUMN_COUNT }).map((_, columnIndex) => (
				<div key={columnIndex} className='flex flex-col gap-3'>
					<Skeleton className='h-[30px] w-full rounded-2xl bg-card/50' />

					{Array.from({ length: columnIndex === 2 ? 2 : TASKS_PER_COLUMN }).map(
						(_, taskIndex) => (
							<Skeleton
								key={taskIndex}
								className='w-full h-[100px] rounded-xl bg-card/50'
							/>
						)
					)}
				</div>
			))}
		</div>
	)
}
