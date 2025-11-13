import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ItineraryItem, RouteSegment, TransportMode } from '../types';
import { MapPin } from 'lucide-react';
import { loadKakaoSdk } from '../utils/loadKakaoSdk';

interface MapPanelProps {
  segments: RouteSegment[];
  isLoading?: boolean;
  className?: string;
  items?: ItineraryItem[];
  transportMode?: TransportMode;
  onMarkerClick?: (item: ItineraryItem) => void;
}

export default function MapPanel({ segments, isLoading, className = '', items = [], transportMode = 'WALK', onMarkerClick }: MapPanelProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<KakaoMap | null>(null);
  const markersRef = useRef<KakaoMarker[]>([]);
  const polylineRef = useRef<KakaoPolyline | null>(null);
  const infoWindowRef = useRef<KakaoInfoWindow | null>(null);
  const levelRef = useRef<number>(5);
  const [sdkError, setSdkError] = useState<string | null>(null);

  const kakaoKey = import.meta.env.VITE_KAKAO_JS_KEY as string | undefined;

  const defaultCenter = useMemo(() => ({ lat: 37.5665, lng: 126.9780 }), []); // Seoul City Hall

  // Initialize map once
  useEffect(() => {
    let cancelled = false;
    if (!containerRef.current) return;

    loadKakaoSdk(kakaoKey)
      .then((kakao) => {
        if (cancelled || !containerRef.current) return;
        const center = items[0]
          ? new kakao.maps.LatLng(items[0].place.lat, items[0].place.lng)
          : new kakao.maps.LatLng(defaultCenter.lat, defaultCenter.lng);
        const map = new kakao.maps.Map(containerRef.current, { center, level: levelRef.current });
        mapRef.current = map;
      })
      .catch((err: Error) => setSdkError(err.message));

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const strokeColor = useMemo(() => {
    switch (transportMode) {
      case 'TRANSIT':
        return '#6366f1'; // indigo
      case 'DRIVE':
        return '#f59e0b'; // amber
      case 'WALK':
      default:
        return '#10b981'; // emerald
    }
  }, [transportMode]);

  const attachMarkerEvents = useCallback((marker: KakaoMarker, item: ItineraryItem) => {
    if (!window.kakao || !mapRef.current) return;
    const { maps } = window.kakao;
    maps.event.addListener(marker as unknown as object, 'click', () => {
      if (!infoWindowRef.current) {
        infoWindowRef.current = new maps.InfoWindow({ content: '', removable: true });
      }
      if (!mapRef.current) return;
      const contentEl = document.createElement('div');
      contentEl.className = 'p-2 text-sm';
      contentEl.innerHTML = `
        <div class="font-semibold mb-1">${item.place.name}</div>
        <div class="text-gray-600">${item.place.category || '장소'}</div>
      `;
      infoWindowRef.current.setContent(contentEl);
      infoWindowRef.current.open(mapRef.current, marker);
      onMarkerClick?.(item);
    });
  }, [onMarkerClick]);

  // Update markers and polyline when items/segments or strokeColor change
  useEffect(() => {
    if (!mapRef.current || !window.kakao) return;
    const { maps } = window.kakao;

    // Clear existing
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    // No items
    if (!items || items.length === 0) return;

    // Add markers
    const bounds = new maps.LatLngBounds();
    const path = items.map((it) => {
      const pos = new maps.LatLng(it.place.lat, it.place.lng);
      const marker = new maps.Marker({ position: pos, title: it.place.name });
      marker.setMap(mapRef.current);
      attachMarkerEvents(marker, it);
      markersRef.current.push(marker);
      bounds.extend(pos);
      return pos;
    });

    // Fit bounds
    if (items.length > 1 && mapRef.current) {
      mapRef.current.setBounds?.(bounds);
    } else if (mapRef.current) {
      mapRef.current.setCenter(path[0]);
      mapRef.current.setLevel(5);
    }

    // Draw polyline roughly following item order
    if (segments && segments.length > 0) {
      const polyline = new maps.Polyline({
        path,
        strokeWeight: 4,
        strokeColor,
        strokeOpacity: 0.9,
        strokeStyle: 'solid',
      });
      polyline.setMap(mapRef.current);
      polylineRef.current = polyline;
    }
  }, [items, segments, strokeColor, attachMarkerEvents]);

  const noKey = !kakaoKey;

  return (
    <div className={`relative bg-gray-100 rounded-lg overflow-hidden ${className}`}>
      <div ref={containerRef} className="w-full h-full" />

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4" />
            <p className="text-gray-700 font-medium">경로 계산 중...</p>
          </div>
        </div>
      )}

      {/* Error or missing key overlay */}
      {(sdkError || noKey) && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-6 bg-white rounded-xl shadow border border-gray-100 max-w-md">
            <MapPin className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-900 mb-1">지도를 불러올 수 없어요</h3>
            <p className="text-sm text-gray-600">
              {noKey
                ? '환경변수 VITE_KAKAO_JS_KEY가 설정되지 않았습니다. .env.local에 추가하세요.'
                : `SDK 로드 오류: ${sdkError}`}
            </p>
          </div>
        </div>
      )}

      {/* Zoom controls */}
      {mapRef.current && !sdkError && !noKey && (
        <div className="absolute top-4 right-4 space-y-2">
          <button
            onClick={() => {
              if (!mapRef.current) return;
              levelRef.current = Math.max(1, levelRef.current - 1);
              mapRef.current.setLevel(levelRef.current);
            }}
            className="p-2 bg-white rounded-lg shadow hover:bg-gray-50"
            aria-label="확대"
          >
            <span className="text-xl">+</span>
          </button>
          <button
            onClick={() => {
              if (!mapRef.current) return;
              levelRef.current = Math.min(14, levelRef.current + 1);
              mapRef.current.setLevel(levelRef.current);
            }}
            className="p-2 bg-white rounded-lg shadow hover:bg-gray-50"
            aria-label="축소"
          >
            <span className="text-xl">−</span>
          </button>
        </div>
      )}
    </div>
  );
}
