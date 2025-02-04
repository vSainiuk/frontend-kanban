'use client'

import { taskService } from '@/services/task.service'
import { Task } from '@/types/task.types'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

export function useTasks() {
	const { data } = useQuery({
		queryKey: ['tasks'],
		queryFn: () => taskService.getTasks(),
	})
	const [tasks, setTasks] = useState<Task[] | undefined>(data?.data)

	useEffect(() => {
		setTasks(data?.data)
	}, [data?.data])

	return { tasks, setTasks }
}
