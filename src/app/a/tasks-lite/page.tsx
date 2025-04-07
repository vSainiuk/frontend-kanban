'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useKanbanBoards } from '@/app/a/tasks-lite/hooks/useKanbanBoards'

export default function TasksLiteRedirectPage() {
	const router = useRouter()
	const { kanbanBoards, isPending } = useKanbanBoards()

	useEffect(() => {
		if (isPending) return

		if (kanbanBoards && kanbanBoards.length > 0) {
			router.replace(`/a/tasks-lite/${kanbanBoards[0].slug}`)
		}
	}, [kanbanBoards, isPending])

	return null
}
