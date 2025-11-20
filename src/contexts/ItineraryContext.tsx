import React, { createContext, useReducer, useCallback } from 'react';
import type { DailyItinerary, ItineraryItem, TransportMode, RouteSegment } from '../types';
import { computeRoute } from '../utils/routeUtils';

interface ItineraryState {
  currentItinerary: DailyItinerary | null;
  routes: RouteSegment[];
  isLoading: boolean;
  savedItineraries: DailyItinerary[];
}

type ItineraryAction =
  | { type: 'SET_ITINERARY'; payload: DailyItinerary }
  | { type: 'ADD_ITEM'; payload: ItineraryItem }
  | { type: 'REMOVE_ITEM'; payload: string } // item id
  | { type: 'REORDER_ITEMS'; payload: ItineraryItem[] }
  | { type: 'UPDATE_ITEM'; payload: { id: string; updates: Partial<ItineraryItem> } }
  | { type: 'SET_TRANSPORT_MODE'; payload: TransportMode }
  | { type: 'SET_ROUTES'; payload: RouteSegment[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SAVE_ITINERARY'; payload: DailyItinerary }
  | { type: 'LOAD_SAVED_ITINERARIES'; payload: DailyItinerary[] };

const initialState: ItineraryState = {
  currentItinerary: null,
  routes: [],
  isLoading: false,
  savedItineraries: [],
};

function itineraryReducer(state: ItineraryState, action: ItineraryAction): ItineraryState {
  switch (action.type) {
    case 'SET_ITINERARY':
      return { ...state, currentItinerary: action.payload };

    case 'ADD_ITEM':
      if (!state.currentItinerary) return state;
      return {
        ...state,
        currentItinerary: {
          ...state.currentItinerary,
          items: [...state.currentItinerary.items, action.payload],
        },
      };

    case 'REMOVE_ITEM':
      if (!state.currentItinerary) return state;
      return {
        ...state,
        currentItinerary: {
          ...state.currentItinerary,
          items: state.currentItinerary.items.filter((item) => item.id !== action.payload),
        },
      };

    case 'REORDER_ITEMS':
      if (!state.currentItinerary) return state;
      return {
        ...state,
        currentItinerary: {
          ...state.currentItinerary,
          items: action.payload,
        },
      };

    case 'UPDATE_ITEM':
      if (!state.currentItinerary) return state;
      return {
        ...state,
        currentItinerary: {
          ...state.currentItinerary,
          items: state.currentItinerary.items.map((item) =>
            item.id === action.payload.id ? { ...item, ...action.payload.updates } : item
          ),
        },
      };

    case 'SET_TRANSPORT_MODE':
      if (!state.currentItinerary) return state;
      return {
        ...state,
        currentItinerary: {
          ...state.currentItinerary,
          transportMode: action.payload,
        },
      };

    case 'SET_ROUTES':
      return { ...state, routes: action.payload };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SAVE_ITINERARY':
      return {
        ...state,
        savedItineraries: [
          action.payload,
          ...state.savedItineraries.filter((it) => it.id !== action.payload.id),
        ],
      };

    case 'LOAD_SAVED_ITINERARIES':
      return { ...state, savedItineraries: action.payload };

    default:
      return state;
  }
}

interface ItineraryContextValue {
  state: ItineraryState;
  addItem: (item: ItineraryItem) => void;
  removeItem: (itemId: string) => void;
  reorderItems: (items: ItineraryItem[]) => void;
  updateItem: (id: string, updates: Partial<ItineraryItem>) => void;
  setTransportMode: (mode: TransportMode) => void;
  setItinerary: (itinerary: DailyItinerary) => void;
  saveItinerary: (itinerary: DailyItinerary) => void;
  recomputeRoute: () => Promise<void>;
}

export const ItineraryContext = createContext<ItineraryContextValue | undefined>(undefined);

export function ItineraryProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(itineraryReducer, initialState);

  const addItem = useCallback((item: ItineraryItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
  }, []);

  const reorderItems = useCallback((items: ItineraryItem[]) => {
    dispatch({ type: 'REORDER_ITEMS', payload: items });
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<ItineraryItem>) => {
    dispatch({ type: 'UPDATE_ITEM', payload: { id, updates } });
  }, []);

  const setTransportMode = useCallback((mode: TransportMode) => {
    dispatch({ type: 'SET_TRANSPORT_MODE', payload: mode });
  }, []);

  const setItinerary = useCallback((itinerary: DailyItinerary) => {
    dispatch({ type: 'SET_ITINERARY', payload: itinerary });
  }, []);

  const saveItinerary = useCallback(async (itinerary: DailyItinerary) => {
    dispatch({ type: 'SAVE_ITINERARY', payload: itinerary });
    // Save to Firestore
    try {
      const { createItinerary, updateItinerary } = await import('../firebase/itineraries');
      const { showToast } = await import('../components/Toast');
      
      if (!itinerary.id || itinerary.id.startsWith('it-')) {
        // New itinerary - create in Firestore
        const firestoreId = await createItinerary(itinerary);
        dispatch({ type: 'SET_ITINERARY', payload: { ...itinerary, id: firestoreId } });
        showToast('일정이 저장되었습니다', 'success');
      } else {
        // Update existing
        await updateItinerary(itinerary.id, itinerary);
        showToast('일정이 업데이트되었습니다', 'success');
      }
      // Fallback to localStorage
      localStorage.setItem(`itinerary-${itinerary.id}`, JSON.stringify(itinerary));
    } catch (error) {
      console.error('Failed to save to Firestore:', error);
      const { showToast } = await import('../components/Toast');
      showToast('저장 중 오류가 발생했습니다', 'error');
      // Fallback to localStorage only
      localStorage.setItem(`itinerary-${itinerary.id}`, JSON.stringify(itinerary));
    }
  }, []);

  const recomputeRoute = useCallback(async () => {
    if (!state.currentItinerary || state.currentItinerary.items.length < 2) {
      dispatch({ type: 'SET_ROUTES', payload: [] });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const routes = await computeRoute(
        state.currentItinerary.items,
        state.currentItinerary.transportMode
      );
      dispatch({ type: 'SET_ROUTES', payload: routes });
    } catch (error) {
      console.error('Failed to compute route:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.currentItinerary]);

  const value: ItineraryContextValue = {
    state,
    addItem,
    removeItem,
    reorderItems,
    updateItem,
    setTransportMode,
    setItinerary,
    saveItinerary,
    recomputeRoute,
  };

  return <ItineraryContext.Provider value={value}>{children}</ItineraryContext.Provider>;
}

// Export hook separately to avoid fast-refresh issues
export { useItinerary } from './useItinerary';
