import { UniqueIdentifier } from '@dnd-kit/core'
import { motion } from 'framer-motion'
import React, { forwardRef } from 'react'

interface KanbanAddNewItemProps {
	children: React.ReactNode
	columnId?: UniqueIdentifier
	onClick?: (event: any) => void
}

const KanbanAddNewItem = forwardRef<HTMLDivElement, KanbanAddNewItemProps>(
	function KanbanAddNewItem({ children, onClick, columnId }, ref) {
		return (
			<motion.div
				ref={ref}
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -10 }}
				transition={{ duration: 0.3, ease: 'easeOut' }}
			>
				<button
					className='italic mt-3 text-muted transition-colors hover:text-white'
					onClick={onClick}
				>
					{children}
				</button>
			</motion.div>
		)
	}
)

export default KanbanAddNewItem
