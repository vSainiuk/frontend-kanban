import { TaskFormState } from '@/types/task.types'
import debounce from 'lodash.debounce'
import { useCallback, useEffect } from 'react'
import { UseFormWatch } from 'react-hook-form'
import { useCreateTask } from './useCreateTask'
import { useUpdateTask } from './useUpdateTask'

interface UseTaskDebounce {
	watch: UseFormWatch<TaskFormState>
	itemId: string
	isCreateTaskFinished: boolean
	isDateChanged: boolean
}

export function useTaskDebounce({
	watch,
	itemId,
	isCreateTaskFinished,
	isDateChanged,
}: UseTaskDebounce) {
	const { createTask } = useCreateTask()
	const { updateTask } = useUpdateTask()

	const debouncedCreateTask = useCallback(
		debounce((formData: TaskFormState) => createTask(formData), 400),
		[]
	)

	const debouncedUpdateTask = useCallback(
		debounce(
			(formData: TaskFormState) => updateTask({ id: itemId, data: formData }),
			400
		),
		[]
	)

	useEffect(() => {
		const { unsubscribe } = watch(formData => {
			if (itemId) {
				debouncedUpdateTask({
					...formData,
					priority: formData.priority || undefined,
				})
			}
		})

		return () => {
			unsubscribe()
		}
	}, [watch, itemId, debouncedUpdateTask])

	useEffect(() => {
		if (isCreateTaskFinished || isDateChanged) {
			const formData = watch()
			debouncedCreateTask(formData)
		}
	}, [isCreateTaskFinished, isDateChanged, watch, debouncedCreateTask])
}
