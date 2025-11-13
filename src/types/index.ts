// Core data types for SmartRoute Planner

export type TransportMode = 'WALK' | 'TRANSIT' | 'DRIVE';

export interface Place {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category?: 'attraction' | 'restaurant' | 'hotel' | 'cafe' | 'shopping' | 'other';
  description?: string;
  openingHours?: string;
  photos?: string[];
  rating?: number;
  address?: string;
  phone?: string;
}

export interface ItineraryItem {
  id: string;
  place: Place;
  arrivalTime?: string;
  stayDurationMins?: number;
  note?: string;
  photos?: string[];
  visited?: boolean;
}

export interface RouteSegment {
  fromId: string;
  toId: string;
  durationMins: number;
  distanceMeters: number;
  mode: TransportMode;
  polyline?: string;
  steps?: string[];
}

export interface DailyItinerary {
  id: string;
  date: string; // ISO date string
  title: string;
  items: ItineraryItem[];
  routes?: RouteSegment[];
  transportMode: TransportMode;
  userId?: string;
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

export interface SharedRoute {
  id: string;
  userId: string;
  userName: string;
  title: string;
  description?: string;
  itinerary: DailyItinerary;
  likes: number;
  createdAt: string;
  isPublic: boolean;
}
