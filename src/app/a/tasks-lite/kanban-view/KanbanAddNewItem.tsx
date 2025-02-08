import { cn } from '@/lib/utils'
import { UniqueIdentifier } from '@dnd-kit/core'
import { motion } from 'framer-motion'
import React, { forwardRef } from 'react'

interface KanbanAddNewItemProps {
	children: React.ReactNode
	columnId?: UniqueIdentifier
	onClick?: (event: any) => void
	classNames?: string
}

const KanbanAddNewItem = forwardRef<HTMLDivElement, KanbanAddNewItemProps>(
	function KanbanAddNewItem({ children, onClick, columnId, classNames }, ref) {
		return (
			<motion.div
				ref={ref}
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -10 }}
				transition={{ duration: 0.3, ease: 'easeOut' }}
			>
				<button
					className={cn(
						'mt-3 px-1 text-xs text-muted transition-colors hover:text-white border border-border hover:border-white rounded-2xl',
						classNames
					)}
					onClick={onClick}
				>
					{children}
				</button>
			</motion.div>
		)
	}
)

export default KanbanAddNewItem
