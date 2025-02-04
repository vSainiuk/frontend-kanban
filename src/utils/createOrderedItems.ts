import { Column } from '@/types/column.types'
import { Task } from '@/types/task.types'

interface OrderedItem {
	id: string;
	order: number;
}

function createOrderedItems(array: Column[] | Task[]): OrderedItem[] {
  return array.map((item, index) => ({
    id: item.id,
    order: index,
  }));
}

export default createOrderedItems