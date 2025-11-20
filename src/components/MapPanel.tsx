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

    console.log('🗺️ Kakao Maps 초기화 시작...', { kakaoKey: kakaoKey ? '설정됨' : '미설정' });

    loadKakaoSdk(kakaoKey)
      .then((kakao) => {
        if (cancelled || !containerRef.current) {
          console.log('🗺️ 컴포넌트가 언마운트되어 지도 생성 취소');
          return;
        }
        console.log('✅ Kakao SDK 로드 성공');
        const center = items[0]
          ? new kakao.maps.LatLng(items[0].place.lat, items[0].place.lng)
          : new kakao.maps.LatLng(defaultCenter.lat, defaultCenter.lng);
        const map = new kakao.maps.Map(containerRef.current, { center, level: levelRef.current });
        mapRef.current = map;
        setSdkError(null);
        console.log('✅ 지도 생성 완료');
      })
      .catch((err: Error) => {
        console.error('❌ Kakao SDK 로드 실패:', err);
        setSdkError(err.message);
      });

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
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-red-100 max-w-md">
            <MapPin className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">지도를 불러올 수 없어요</h3>
            <p className="text-sm text-gray-600 mb-4">
              {noKey
                ? '환경변수 VITE_KAKAO_JS_KEY가 설정되지 않았습니다.'
                : sdkError}
            </p>
            <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg text-left">
              <p className="font-semibold mb-1">해결 방법:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Kakao Developers에서 JavaScript 키 확인</li>
                <li>.env 파일에 <code className="bg-gray-200 px-1 rounded">VITE_KAKAO_JS_KEY=your_key</code> 추가</li>
                <li>개발 서버 재시작 (npm run dev)</li>
                <li>브라우저 새로고침</li>
              </ol>
              <p className="mt-2">현재 키: {kakaoKey ? `${kakaoKey.substring(0, 10)}...` : '❌ 없음'}</p>
            </div>
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
