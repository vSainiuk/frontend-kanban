import { columnService } from '@/services/column.service'
import { Column } from '@/types/column.types'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

export function useColumns() {
	const { data } = useQuery({
		queryKey: ['columns'],
		queryFn: () => columnService.getColumns(),
	})

	const [columns, setColumns] = useState<Column[] | undefined>(data?.data)

	useEffect(() => {
		setColumns(data?.data)
	}, [data?.data])

	return { columns, setColumns }
}
