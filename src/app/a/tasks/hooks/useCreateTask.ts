import { taskService } from '@/services/task.service'
import { TaskFormState } from '@/types/task.types'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useCreateTask() {
	const queryClient = useQueryClient();

	const { mutate: createTask } = useMutation({
		mutationKey: ['createTask'],
		mutationFn: (data: TaskFormState) => taskService.createTask(data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['tasks'],
			})
		},
	})

	return { createTask }
}