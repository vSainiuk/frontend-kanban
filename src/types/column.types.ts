import { Root } from './root.types'
import { Task } from './task.types'

export interface Column extends Root {
	label: string
	order: number
	tasks?: Task[]
	boardId: string
}

export type ColumnFormState = Partial<Omit<Column, 'id' | 'updatedAt'>>