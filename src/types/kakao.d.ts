// Minimal Kakao Maps type declarations for TypeScript
// This keeps our app type-safe without pulling full upstream typings.

declare global {
  interface Window {
    kakao: Kakao;
  }

  interface Kakao {
    maps: KakaoMaps;
  }

  interface KakaoMaps {
    load(callback: () => void): void;
    LatLng: new (lat: number, lng: number) => KakaoLatLng;
    LatLngBounds: new () => {
      extend(latlng: KakaoLatLng): void;
    };
    Map: new (
      container: HTMLElement,
      options: { center: KakaoLatLng; level: number }
    ) => KakaoMap;
    Marker: new (options: { position: KakaoLatLng; map?: KakaoMap; title?: string }) => KakaoMarker;
    Polyline: new (options: { path: KakaoLatLng[]; strokeWeight?: number; strokeColor?: string; strokeOpacity?: number; strokeStyle?: string }) => KakaoPolyline;
    InfoWindow: new (options: { content: string | HTMLElement; position?: KakaoLatLng; removable?: boolean }) => KakaoInfoWindow;
    event: {
      addListener(target: unknown, type: string, listener: (...args: unknown[]) => void): void;
    };
  }

  interface KakaoLatLng {
    getLat(): number;
    getLng(): number;
  }

  interface KakaoMap {
    setCenter(latlng: KakaoLatLng): void;
    setLevel(level: number): void;
    setBounds?: (bounds: unknown) => void;
  }

  interface KakaoMarker {
    setMap(map: KakaoMap | null): void;
  }

  interface KakaoPolyline {
    setMap(map: KakaoMap | null): void;
  }

  interface KakaoInfoWindow {
    open(map?: KakaoMap, marker?: KakaoMarker): void;
    close(): void;
    setContent(content: string | HTMLElement): void;
  }
}

export {};
