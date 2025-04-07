import { Root } from './root.types'

export interface KanbanBoard extends Root {
	slug: string
	title?: string
	icon_color?: string
}

export type KanbanBoardFormState = Partial<
	Omit<KanbanBoard, 'id' | 'updatedAt'>
>
