'use client'

import { kanbanBoardService } from '@/services/kanban-board.service'
import { KanbanBoard } from '@/types/kanban-board.type'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

export function useKanbanBoard(slug: string) {
	const { data, refetch } = useQuery({
		queryKey: ['kanbanBoard', slug],
		queryFn: () => kanbanBoardService.getKanbanBoard(slug),
		enabled: !!slug,
	})
	const [kanbanBoard, setKanbanBoard] = useState<KanbanBoard | undefined>(
		data?.data
	)

	useEffect(() => {
		setKanbanBoard(data?.data)
	}, [data?.data])

	return { kanbanBoard, setKanbanBoard, refetch }
}
