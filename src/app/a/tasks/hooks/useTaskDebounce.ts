import { TaskFormState } from '@/types/task.types'
import debounce from 'lodash.debounce'
import { useCallback, useEffect, useRef } from 'react'
import { useUpdateTask } from './useUpdateTask'

interface UseTaskDebounceProps {
	itemId: string
	formState: TaskFormState
}

export function useTaskDebounce({ itemId, formState }: UseTaskDebounceProps) {
	const { updateTask } = useUpdateTask()

	const prevFormState = useRef<TaskFormState>(formState)

	const debouncedUpdateTask = useCallback(
		debounce((updatedData: TaskFormState) => {
			if (itemId) {
				updateTask({ id: itemId, data: updatedData })
			}
		}, 400),
		[itemId, updateTask]
	)

	useEffect(() => {
		const hasChanged =
			JSON.stringify(prevFormState.current) !== JSON.stringify(formState)

		if (hasChanged) {
			debouncedUpdateTask(formState)
			prevFormState.current = formState
		}

		return () => {
			debouncedUpdateTask.cancel()
		}
	}, [formState, debouncedUpdateTask])
}
