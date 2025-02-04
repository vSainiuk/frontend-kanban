import { Root } from './root.types'

export enum TaskPriority {
	low = 'low',
	medium = 'medium',
	high = 'high',
}

export interface Task extends Root {
	title: string
	description?: string
	priority?: TaskPriority
	isCompleted: boolean
	order: number
	columnId: string
}

export type TasksByColumn = {
  [columnId: string]: Task[];
};

export type TaskFormState = Partial<Omit<Task, 'id' | 'updatedAt'>>
