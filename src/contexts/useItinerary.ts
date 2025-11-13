import { useContext } from 'react';
import { ItineraryContext } from './ItineraryContext';

export function useItinerary() {
  const context = useContext(ItineraryContext);
  if (!context) {
    throw new Error('useItinerary must be used within ItineraryProvider');
  }
  return context;
}
