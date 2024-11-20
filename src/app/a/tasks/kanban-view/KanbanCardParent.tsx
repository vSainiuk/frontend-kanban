import { Task } from '@/types/task.types';
import cuid from 'cuid';
import { AnimatePresence } from 'framer-motion';
import { FILTERS } from '../columns.data';
import { filterTasks } from '../filterTasks';
import KanbanAddNewCard from './KanbanAddNewCard';
import KanbanCard from './KanbanCard';

interface KanbanCardParentProps {
  rowId: string;
  label: string;
  items: Task[] | undefined;
  setItems: React.Dispatch<React.SetStateAction<Task[] | undefined>>;
}

export default function KanbanCardParent({
  rowId,
  label,
  items,
  setItems,
}: KanbanCardParentProps) {
  return (
    <div className="mb-4 border border-border rounded-2xl p-2">
      <div className="border-b-2 border-border mb-2">
        <h2 className="text-xl italic">{label}</h2>
      </div>

      <div className="flex flex-col gap-2">
        <AnimatePresence>
          {filterTasks(items, rowId)?.map((item, index) => (
            <div key={item.id} className="relative">
              <KanbanCard item={item} setItems={setItems} />
            </div>
          ))}
        </AnimatePresence>
      </div>

      {rowId !== 'completed' && !items?.some(item => !item.id) && (
        <KanbanAddNewCard
          setItems={setItems}
          filterDate={FILTERS[rowId] ? FILTERS[rowId].format() : undefined}
        />
      )}
    </div>
  );
}
