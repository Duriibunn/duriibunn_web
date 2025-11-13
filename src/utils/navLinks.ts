import type { ItineraryItem, Place, TransportMode } from '../types';

function encodeName(name: string) {
  return encodeURIComponent(name);
}

function kakaoToUrl(name: string, lat: number, lng: number) {
  // Kakao uses y(lat), x(lng)
  return `https://map.kakao.com/link/to/${encodeName(name)},${lat},${lng}`;
}

function kakaoFromToUrl(fromName: string, fromLat: number, fromLng: number, toName: string, toLat: number, toLng: number) {
  // https://map.kakao.com/link/from/{name},{y},{x}/to/{name},{y},{x}
  return `https://map.kakao.com/link/from/${encodeName(fromName)},${fromLat},${fromLng}/to/${encodeName(toName)},${toLat},${toLng}`;
}

function googleMode(mode: TransportMode): 'walking' | 'transit' | 'driving' {
  switch (mode) {
    case 'WALK':
      return 'walking';
    case 'TRANSIT':
      return 'transit';
    case 'DRIVE':
    default:
      return 'driving';
  }
}

function googleDirectionsUrl(destLat: number, destLng: number, mode: TransportMode, origin?: { lat: number; lng: number }) {
  const params = new URLSearchParams();
  params.set('api', '1');
  params.set('destination', `${destLat},${destLng}`);
  params.set('travelmode', googleMode(mode));
  if (origin) params.set('origin', `${origin.lat},${origin.lng}`);
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

function googleDirectionsWithWaypoints(items: ItineraryItem[], mode: TransportMode, origin?: { lat: number; lng: number }) {
  const params = new URLSearchParams();
  params.set('api', '1');
  params.set('travelmode', googleMode(mode));
  if (origin) params.set('origin', `${origin.lat},${origin.lng}`);
  if (items.length === 1) {
    params.set('destination', `${items[0].place.lat},${items[0].place.lng}`);
  } else {
    const last = items[items.length - 1];
    const waypoints = items.slice(0, -1).map(it => `${it.place.lat},${it.place.lng}`).join('|');
    if (waypoints) params.set('waypoints', waypoints);
    params.set('destination', `${last.place.lat},${last.place.lng}`);
  }
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

function getCurrentPosition(timeoutMs = 3000): Promise<{ lat: number; lng: number }> {
  if (!('geolocation' in navigator)) return Promise.reject(new Error('geolocation_unavailable'));
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('geolocation_timeout')), timeoutMs);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        clearTimeout(timer);
        resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      },
      { enableHighAccuracy: false, timeout: timeoutMs, maximumAge: 60_000 }
    );
  });
}

export async function openDirections(place: Place, mode: TransportMode) {
  // Try Kakao from->to using geolocation; fallback to to-only; as last resort use Google Maps
  const toName = place.name || '목적지';
  const toLat = place.lat;
  const toLng = place.lng;

  try {
    const origin = await getCurrentPosition(3000);
    const kakaoUrl = kakaoFromToUrl('현재 위치', origin.lat, origin.lng, toName, toLat, toLng);
    window.open(kakaoUrl, '_blank', 'noopener,noreferrer');
    return;
  } catch {
    // ignore
  }

  try {
    const kakaoUrl = kakaoToUrl(toName, toLat, toLng);
    window.open(kakaoUrl, '_blank', 'noopener,noreferrer');
    return;
  } catch {
    // ignore
  }

  const gUrl = googleDirectionsUrl(toLat, toLng, mode);
  window.open(gUrl, '_blank', 'noopener,noreferrer');
}

export async function openItineraryDirections(items: ItineraryItem[], mode: TransportMode) {
  if (!items || items.length === 0) return;
  try {
    const origin = await getCurrentPosition(2000);
    const gUrl = googleDirectionsWithWaypoints(items, mode, origin);
    window.open(gUrl, '_blank', 'noopener,noreferrer');
    return;
  } catch {
    const gUrl = googleDirectionsWithWaypoints(items, mode);
    window.open(gUrl, '_blank', 'noopener,noreferrer');
  }
}
