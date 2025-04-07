import { kanbanBoardService } from '@/services/kanban-board.service'
import { KanbanBoardFormState } from '@/types/kanban-board.type'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useUpdateKanbanBoard() {
	const queryClient = useQueryClient()

	const { mutate: updateKanbanBoard } = useMutation({
		mutationKey: ['updateKanbanBoard'],
		mutationFn: ({ id, data }: { id: string; data: KanbanBoardFormState }) =>
			kanbanBoardService.updateKanbanBoard(id, data),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({
				queryKey: ['kanbanBoards'],
			})
			queryClient.invalidateQueries({
				queryKey: ['kanbanBoard', variables.id],
			})
		},
	})

	return { updateKanbanBoard }
}
