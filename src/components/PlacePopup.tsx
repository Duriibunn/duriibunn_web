import type { Place } from '../types';
import { X, MapPin, Clock, Star, Phone, Navigation } from 'lucide-react';

interface PlacePopupProps {
  place: Place;
  onClose: () => void;
  onNavigate?: (place: Place) => void;
}

export default function PlacePopup({ place, onClose, onNavigate }: PlacePopupProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-slide-up">
        {/* Header Image */}
        {place.photos && place.photos.length > 0 && (
          <div className="relative h-48 sm:h-64 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
            <img
              src={place.photos[0]}
              alt={place.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all hover:scale-110"
            >
              <X className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-12rem)]">
          {/* Title & Rating */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{place.name}</h2>
              <span className="inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                {place.category}
              </span>
            </div>
            {place.rating && (
              <div className="flex items-center space-x-1 text-yellow-500">
                <Star className="h-5 w-5 fill-current" />
                <span className="font-semibold text-gray-900">{place.rating}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {place.description && (
            <p className="text-gray-600 mb-4 leading-relaxed">{place.description}</p>
          )}

          {/* Info Grid */}
          <div className="space-y-3 mb-6">
            {place.address && (
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{place.address}</span>
              </div>
            )}
            {place.openingHours && (
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{place.openingHours}</span>
              </div>
            )}
            {place.phone && (
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{place.phone}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            {onNavigate && (
              <button
                onClick={() => onNavigate(place)}
                className="group flex-1 flex items-center justify-center space-x-2 px-4 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg font-semibold"
              >
                <Navigation className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span>길찾기</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-6 py-3.5 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-semibold"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
