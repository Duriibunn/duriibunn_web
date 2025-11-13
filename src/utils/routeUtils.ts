import type { ItineraryItem, RouteSegment, TransportMode } from '../types';

/**
 * Calculate distance between two coordinates using Haversine formula
 */
function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Estimate travel time based on distance and transport mode
 */
function estimateTravelTime(distanceKm: number, mode: TransportMode): number {
  const speeds = {
    WALK: 5, // km/h
    TRANSIT: 30, // km/h (average with stops)
    DRIVE: 40, // km/h (city traffic)
  };
  const hours = distanceKm / speeds[mode];
  return Math.round(hours * 60); // return minutes
}

/**
 * Calculate route segments between consecutive itinerary items
 * This is a simplified version - in production, use Google Directions API
 */
export async function computeRoute(
  items: ItineraryItem[],
  mode: TransportMode
): Promise<RouteSegment[]> {
  if (items.length < 2) return [];

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const segments: RouteSegment[] = [];

  for (let i = 0; i < items.length - 1; i++) {
    const from = items[i];
    const to = items[i + 1];

    const distanceKm = getDistance(
      from.place.lat,
      from.place.lng,
      to.place.lat,
      to.place.lng
    );

    const durationMins = estimateTravelTime(distanceKm, mode);

    segments.push({
      fromId: from.id,
      toId: to.id,
      durationMins,
      distanceMeters: Math.round(distanceKm * 1000),
      mode,
      steps: [`${from.place.name}에서 출발`, `${to.place.name}에 도착`],
    });
  }

  return segments;
}

/**
 * Optimize order of places using simple nearest-neighbor heuristic
 * In production, use more sophisticated algorithms or Google's optimize:true
 */
export function optimizePlaceOrder(items: ItineraryItem[]): ItineraryItem[] {
  if (items.length <= 2) return items;

  const optimized: ItineraryItem[] = [items[0]];
  const remaining = [...items.slice(1)];

  while (remaining.length > 0) {
    const current = optimized[optimized.length - 1];
    let nearest = remaining[0];
    let minDist = getDistance(
      current.place.lat,
      current.place.lng,
      nearest.place.lat,
      nearest.place.lng
    );

    for (let i = 1; i < remaining.length; i++) {
      const dist = getDistance(
        current.place.lat,
        current.place.lng,
        remaining[i].place.lat,
        remaining[i].place.lng
      );
      if (dist < minDist) {
        minDist = dist;
        nearest = remaining[i];
      }
    }

    optimized.push(nearest);
    remaining.splice(remaining.indexOf(nearest), 1);
  }

  return optimized;
}

/**
 * Calculate total route summary
 */
export function calculateRouteSummary(segments: RouteSegment[]) {
  const totalDuration = segments.reduce((sum, seg) => sum + seg.durationMins, 0);
  const totalDistance = segments.reduce((sum, seg) => sum + seg.distanceMeters, 0);

  return {
    totalDurationMins: totalDuration,
    totalDistanceMeters: totalDistance,
    segmentCount: segments.length,
  };
}

/**
 * Format duration in human-readable format
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}분`;
  if (mins === 0) return `${hours}시간`;
  return `${hours}시간 ${mins}분`;
}

/**
 * Format distance in human-readable format
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) return `${meters}m`;
  const km = (meters / 1000).toFixed(1);
  return `${km}km`;
}
