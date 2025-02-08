import { taskService } from '@/services/task.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useDeleteTask() {
	const queryClient = useQueryClient()

	const { mutate: deleteTask, isPending: isPendingDeleteTask } = useMutation({
		mutationKey: ['deleteTask'],
		mutationFn: (id: string) => taskService.deleteTask(id),
	})

	return { deleteTask, isPendingDeleteTask }
}
