'use client'

import { kanbanBoardService } from '@/services/kanban-board.service'
import { KanbanBoard } from '@/types/kanban-board.type'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

export function useKanbanBoards() {
	const { data, refetch, isPending } = useQuery({
		queryKey: ['kanbanBoards'],
		queryFn: () => kanbanBoardService.getKanbanBoards(),
	})
	const [kanbanBoards, setKanbanBoards] = useState<KanbanBoard[] | undefined>(
		data?.data
	)

	useEffect(() => {
		setKanbanBoards(data?.data)
	}, [data?.data])

	return { kanbanBoards, setKanbanBoards, refetch, isPending }
}
