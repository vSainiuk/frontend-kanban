interface ReorderProps<T> {
	list: T[]
	startIndex: number
	endIndex: number
}

export function reorder<T>({
	list,
	startIndex,
	endIndex,
}: ReorderProps<T>): T[] {
	const result = Array.from(list)
	const [removed] = result.splice(startIndex, 1)
	result.splice(endIndex, 0, removed)
	return result
}
