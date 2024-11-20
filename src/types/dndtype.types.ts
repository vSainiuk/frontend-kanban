import { UniqueIdentifier } from '@dnd-kit/core'
import { Task } from './task.types'

export interface DNDType {
	id: UniqueIdentifier
	label: string
	tasks: Task[]
}
