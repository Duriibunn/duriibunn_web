// Firestore CRUD operations for itineraries
import { db } from './config';
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
  Timestamp,
} from 'firebase/firestore';
import type { DailyItinerary } from '../types';

const COLLECTION = 'itineraries';

// CREATE: Add new itinerary
export async function createItinerary(itinerary: DailyItinerary): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...itinerary,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

// READ: Get single itinerary by ID
export async function getItinerary(id: string): Promise<DailyItinerary | null> {
  const docRef = doc(db, COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as DailyItinerary;
}

// READ: Get all itineraries (optional: filter by userId)
export async function getItineraries(userId?: string): Promise<DailyItinerary[]> {
  const colRef = collection(db, COLLECTION);
  let q = query(colRef, orderBy('createdAt', 'desc'));
  if (userId) {
    q = query(colRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as DailyItinerary));
}

// UPDATE: Update existing itinerary
export async function updateItinerary(id: string, updates: Partial<DailyItinerary>): Promise<void> {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
}

// DELETE: Delete itinerary
export async function deleteItinerary(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION, id);
  await deleteDoc(docRef);
}
