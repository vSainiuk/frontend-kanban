import { UniqueIdentifier } from '@dnd-kit/core'
import React, { forwardRef } from 'react'

interface KanbanAddNewItemProps {
	children: React.ReactNode
	columnId?: UniqueIdentifier
	onClick?: (event: any) => void
}

const KanbanAddNewItem = forwardRef<HTMLDivElement, KanbanAddNewItemProps>(
	function KanbanAddNewItem({ children, onClick, columnId }, ref) {
		return (
			<div ref={ref}>
				<button
					className='italic mt-3 text-muted transition-colors hover:text-white'
					onClick={onClick}
				>
					{children}
				</button>
			</div>
		)
	}
)

export default KanbanAddNewItem
