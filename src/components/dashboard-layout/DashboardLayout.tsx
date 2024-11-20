'use client'

import { useLocalStorage } from '@/hooks/useLocalStorage'
import Header from './Header'
import Sidebar from './Sidebar/Sidebar'

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const [isCollapsed, setIsCollapsed, isLoading] =
		useLocalStorage<boolean>('isCollapsed')

	return (
		<div
			className={`grid min-h-screen shrink-0 transition-all duration-300 ${
				isCollapsed
					? 'sm:grid-cols-[50px_1fr] 2xl:grid-cols-[50px_1fr]'
					: 'sm:grid-cols-[200px_1fr] 2xl:grid-cols-[200px_1fr]'
			}`}
		>
			<Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

			<main className='bg-background overflow-x-hidden max-h-screen relative px-5'>
				<Header />
				{children}
			</main>
		</div>
	)
}
