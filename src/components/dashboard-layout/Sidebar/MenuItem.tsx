import { axiosWithAuth } from '@/api/interceptors'
import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export interface MenuItem {
	title: string
	icon: LucideIcon
	link: string
}

type MenuItemProps = {
	menu: MenuItem
	isCollapsed: boolean
	isLogout?: boolean
}

export default function MenuItem({
	menu,
	isCollapsed,
	isLogout,
}: MenuItemProps) {
	const pathname = usePathname()
	const isActive = pathname === menu.link 
	const isKanbanBoards = pathname.includes('tasks-lite')
	const isTasksLiteActive = isKanbanBoards && menu.link.includes('tasks-lite')

	const handleLogout = async (
		event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
	) => {
		event.preventDefault()

		document.cookie = `access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=None; Secure; Partitioned;`

		await axiosWithAuth.post('/auth/logout').then(() => {
			window.location.reload()
		})
	}

	return (
		<li
			className={`relative flex items-center transition-colors rounded-xl ${
				isActive || isTasksLiteActive ? 'bg-purple-700' : 'hover:bg-accent'
			}`}
		>
			<Link
				draggable={false}
				className={`w-full select-none sm:flex gap-2 p-3`}
				href={isLogout ? '#logout' : menu.link}
				onClick={isLogout ? handleLogout : undefined}
			>
				<motion.div initial={{ opacity: 0 }} animate={{ opacity: 100 }}>
					<menu.icon className='w-8 h-8 sm:w-6 sm:h-6' />
				</motion.div>

				<motion.span
					initial={{ opacity: 0 }}
					animate={{
						opacity: isCollapsed ? 0 : 1,
					}}
					transition={{ duration: 0.5, ease: 'easeInOut' }}
					className='absolute left-12 transition-width overflow-hidden hidden sm:inline-block'
					style={{ whiteSpace: 'nowrap' }}
				>
					{menu.title}
				</motion.span>
			</Link>
		</li>
	)
}
