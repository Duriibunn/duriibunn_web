import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ItineraryItem, Place } from '../types';
import ItineraryCard from './ItineraryCard';

interface SortableItemProps {
  item: ItineraryItem;
  index: number;
  onRemove: (id: string) => void;
  onClick: (place: Place) => void;
}

function SortableItem({ item, index, onRemove, onClick }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ItineraryCard
        item={item}
        index={index}
        onRemove={onRemove}
        onClick={onClick}
        isDragging={isDragging}
      />
    </div>
  );
}

interface ItineraryListProps {
  items: ItineraryItem[];
  onReorder: (items: ItineraryItem[]) => void;
  onRemove: (id: string) => void;
  onItemClick: (place: Place) => void;
}

export default function ItineraryList({
  items,
  onReorder,
  onRemove,
  onItemClick,
}: ItineraryListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      onReorder(newItems);
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="text-gray-400 mb-3">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3 className="text-sm font-medium text-gray-900 mb-1">일정이 비어있습니다</h3>
        <p className="text-sm text-gray-500">
          장소 탐색에서 방문할 장소를 추가하세요
        </p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {items.map((item, index) => (
            <SortableItem
              key={item.id}
              item={item}
              index={index}
              onRemove={onRemove}
              onClick={onItemClick}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
