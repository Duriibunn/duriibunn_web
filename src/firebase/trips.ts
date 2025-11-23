// Firestore CRUD operations for user trips
import { db, auth } from './config';
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';

const TRIPS_COLLECTION = 'trips';
const FAVORITES_COLLECTION = 'favorites';

interface Place {
  id: string;
  name: string;
  category: string;
  image?: string;
  address?: string;
  lat?: number;
  lng?: number;
}

interface Trip {
  id: string;
  userId: string;
  title: string;
  cityName: string;
  startDate: string;
  endDate: string;
  days: number;
  dailySchedules: { [key: number]: Place[] };
  createdAt: number;
  updatedAt?: number;
}

interface FavoritePlace extends Place {
  userId: string;
  savedAt: number;
}

// Get current user ID
function getCurrentUserId(): string {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }
  return user.uid;
}

// ===== TRIPS =====

// CREATE: Add new trip
export async function createTrip(tripData: Omit<Trip, 'id' | 'userId' | 'createdAt'>): Promise<string> {
  const userId = getCurrentUserId();
  const docRef = await addDoc(collection(db, TRIPS_COLLECTION), {
    ...tripData,
    userId,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
  return docRef.id;
}

// READ: Get single trip by ID
export async function getTrip(tripId: string): Promise<Trip | null> {
  const userId = getCurrentUserId();
  const docRef = doc(db, TRIPS_COLLECTION, tripId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) return null;
  
  const data = docSnap.data();
  // Verify the trip belongs to the current user
  if (data.userId !== userId) {
    throw new Error('Unauthorized access to trip');
  }
  
  return { id: docSnap.id, ...data } as Trip;
}

// READ: Get all trips for current user
export async function getUserTrips(): Promise<Trip[]> {
  const userId = getCurrentUserId();
  const q = query(
    collection(db, TRIPS_COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ 
    id: doc.id, 
    ...doc.data() 
  } as Trip));
}

// UPDATE: Update existing trip
export async function updateTrip(tripId: string, updates: Partial<Omit<Trip, 'id' | 'userId'>>): Promise<void> {
  const userId = getCurrentUserId();
  const docRef = doc(db, TRIPS_COLLECTION, tripId);
  
  // Verify ownership
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists() || docSnap.data().userId !== userId) {
    throw new Error('Unauthorized access to trip');
  }
  
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Date.now(),
  });
}

// DELETE: Delete trip
export async function deleteTrip(tripId: string): Promise<void> {
  const userId = getCurrentUserId();
  const docRef = doc(db, TRIPS_COLLECTION, tripId);
  
  // Verify ownership
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists() || docSnap.data().userId !== userId) {
    throw new Error('Unauthorized access to trip');
  }
  
  await deleteDoc(docRef);
}

// ===== FAVORITES =====

// CREATE: Add place to favorites
export async function addToFavorites(place: Omit<FavoritePlace, 'userId' | 'savedAt'>): Promise<string> {
  const userId = getCurrentUserId();
  
  // Check if already exists
  const existingFavorites = await query(
    collection(db, FAVORITES_COLLECTION),
    where('userId', '==', userId),
    where('id', '==', place.id)
  );
  
  const snapshot = await getDocs(existingFavorites);
  if (!snapshot.empty) {
    return snapshot.docs[0].id; // Already exists
  }
  
  const docRef = await addDoc(collection(db, FAVORITES_COLLECTION), {
    ...place,
    userId,
    savedAt: Date.now(),
  });
  return docRef.id;
}

// READ: Get all favorites for current user
export async function getUserFavorites(): Promise<FavoritePlace[]> {
  const userId = getCurrentUserId();
  const q = query(
    collection(db, FAVORITES_COLLECTION),
    where('userId', '==', userId),
    orderBy('savedAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as FavoritePlace);
}

// DELETE: Remove from favorites by place ID
export async function removeFromFavorites(placeId: string): Promise<void> {
  const userId = getCurrentUserId();
  const q = query(
    collection(db, FAVORITES_COLLECTION),
    where('userId', '==', userId),
    where('id', '==', placeId)
  );
  
  const snapshot = await getDocs(q);
  const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
}

// CHECK: Check if place is in favorites
export async function isFavorite(placeId: string): Promise<boolean> {
  const userId = getCurrentUserId();
  const q = query(
    collection(db, FAVORITES_COLLECTION),
    where('userId', '==', userId),
    where('id', '==', placeId)
  );
  
  const snapshot = await getDocs(q);
  return !snapshot.empty;
}
