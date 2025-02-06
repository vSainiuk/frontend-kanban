'use client'

import { useSwipeToToggleSidebar } from '@/hooks/useSwipeToToggleSidebar'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Menu, SquareChevronLeft } from 'lucide-react'
import { menuData } from './menu.data'
import MenuItem from './MenuItem'

interface SidebarProps {
	isCollapsed: boolean
	setIsCollapsed: (value: boolean) => void
}

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
	const { sidebarRef } = useSwipeToToggleSidebar(isCollapsed, setIsCollapsed)

	const toggleIconClasses = `w-7 h-7 text-secondary`

	return (
		<aside
			ref={sidebarRef}
			className={`border-t-2 sm:border-r-2 sm:border-t-0 bg-sidebar/90 border-primary fixed bottom-0 left-0 right-0 sm:static transition-all duration-700`}
		>
			<nav
				className={cn(
					'flex flex-col overflow-x-auto sm:overflow-x-hidden relative',
					isCollapsed && 'sm:items-center'
				)}
			>
				{!isCollapsed && ( ///TODO: Fixed the logo
					<div></div>
				)}

				<button
					className={cn(
						`hidden sm:flex items-center justify-center absolute top-3 right-3 z-20 transition-colors hover:bg-slate-400/25 rounded-xl p-1 w-fit`,
						isCollapsed && 'static mt-1'
					)}
				>
					{isCollapsed ? (
						<Menu
							className={toggleIconClasses}
							onClick={() => setIsCollapsed(false)}
						/>
					) : (
						<motion.div
							initial={{ rotate: -90 }}
							animate={{ rotate: 0 }}
							transition={{ duration: 0.5, ease: 'easeInOut' }}
						>
							<SquareChevronLeft
								className={cn(toggleIconClasses)}
								onClick={() => setIsCollapsed(true)}
							/>
						</motion.div>
					)}
				</button>

				<ul className={cn('flex sm:flex-col justify-between z-10')}>
					{menuData.map((menu, index) => {
						const isLogout = menu.title === 'Log Out'
						return (
							<MenuItem isLogout={isLogout} menu={menu} key={index} isCollapsed={isCollapsed} />
						)
					})}
				</ul>
			</nav>
		</aside>
	)
}
