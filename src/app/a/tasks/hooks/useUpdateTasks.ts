import { taskService } from '@/services/task.service'
import { Task } from '@/types/task.types'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useUpdateTasks(key?: string) {
	const queryClient = useQueryClient()

	const { mutate: updateTasks } = useMutation({
		mutationKey: ['updateTasks', key],
		mutationFn: ({ data }: { data: Task[] }) => taskService.updateTasks(data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['tasks'],
			})
		},
	})

	return { updateTasks }
}
