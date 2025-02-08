import { taskService } from '@/services/task.service'
import { TaskFormState } from '@/types/task.types'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useUpdateTask(key?: string) {
	const queryClient = useQueryClient()

	const { mutate: updateTask } = useMutation({
		mutationKey: ['updateTask', key],
		mutationFn: ({ id, data }: { id: string; data: TaskFormState }) =>
			taskService.updateTask(id, data),
	})

	return { updateTask }
}
