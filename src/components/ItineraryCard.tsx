import type { ItineraryItem, Place } from '../types';
import { GripVertical, X, MapPin, Clock } from 'lucide-react';

interface ItineraryCardProps {
  item: ItineraryItem;
  index: number;
  onRemove: (id: string) => void;
  onClick: (place: Place) => void;
  isDragging?: boolean;
}

export default function ItineraryCard({
  item,
  index,
  onRemove,
  onClick,
  isDragging,
}: ItineraryCardProps) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 p-4 transition-all ${
        isDragging ? 'opacity-50 scale-95' : 'hover:border-gray-300'
      }`}
    >
      <div className="flex items-start space-x-3">
        {/* Drag Handle */}
        <div className="flex-shrink-0 cursor-grab active:cursor-grabbing hover:bg-gray-50 rounded p-0.5 transition-colors">
          <GripVertical className="h-5 w-5 text-gray-400" />
        </div>

        {/* Order Number */}
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold text-sm">
          {index + 1}
        </div>

        {/* Content */}
        <div
          className="flex-1 min-w-0 cursor-pointer"
          onClick={() => onClick(item.place)}
        >
          <h3 className="text-base font-semibold text-gray-900 mb-1 truncate">
            {item.place.name}
          </h3>
          
          {item.place.category && (
            <span className="inline-block text-xs text-gray-500 mb-2">
              {item.place.category}
            </span>
          )}

          <div className="space-y-1">
            {item.place.address && (
              <div className="flex items-start text-xs text-gray-600">
                <MapPin className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                <span className="truncate">{item.place.address}</span>
              </div>
            )}
            {item.stayDurationMins && (
              <div className="flex items-center text-xs text-gray-600">
                <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                <span>체류시간: {item.stayDurationMins}분</span>
              </div>
            )}
          </div>

          {item.note && (
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">{item.note}</p>
          )}
        </div>

        {/* Remove Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(item.id);
          }}
          className="flex-shrink-0 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
