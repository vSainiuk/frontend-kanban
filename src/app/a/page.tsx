'use client'

import Loader from '@/components/ui/loader'
import { useProfile } from '@/hooks/useProfile'

export default function StatisticsPage() {
	const { data, isPending } = useProfile()

	return isPending ? (
		<Loader />
	) : (
		<div className='grid grid-cols-1 sm:grid-cols-4 gap-10'>
			{data?.statistics.length ? (
				data?.statistics.map(stat => (
					<div className='bg-sidebar border border-input rounded-xl text-center flex flex-col justify-around h-32' key={stat.label}>
						<div className='text-xl'>{stat.label}</div>
						<div className='text-3xl'>{stat.value}</div>
					</div>
				))
			) : (
				<span>There no any statistics</span>
			)}
		</div>
	)
}
