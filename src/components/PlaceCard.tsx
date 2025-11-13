import type { Place } from '../types';
import { MapPin, Star, Plus } from 'lucide-react';

interface PlaceCardProps {
  place: Place;
  onAdd: (place: Place) => void;
  onClick: (place: Place) => void;
}

export default function PlaceCard({ place, onAdd, onClick }: PlaceCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => onClick(place)}>
      {/* Image */}
      {place.photos && place.photos[0] && (
        <div
          className="aspect-[4/3] bg-cover bg-center"
          style={{ backgroundImage: `url(${place.photos[0]})` }}
        />
      )}

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
              {place.name}
            </h3>
            {place.category && (
              <span className="inline-block text-sm text-gray-500">
                {place.category}
              </span>
            )}
          </div>
          {place.rating && (
            <div className="flex items-center space-x-1 flex-shrink-0 ml-3">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-gray-900">{place.rating}</span>
            </div>
          )}
        </div>

        {place.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">{place.description}</p>
        )}

        {place.address && (
          <div className="flex items-start text-sm text-gray-500 mb-4">
            <MapPin className="h-4 w-4 mr-1.5 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-1">{place.address}</span>
          </div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onAdd(place);
          }}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          <span>일정에 추가</span>
        </button>
      </div>
    </div>
  );
}
