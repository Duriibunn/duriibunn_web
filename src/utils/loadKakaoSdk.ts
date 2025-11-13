// Dynamic loader for Kakao Maps JavaScript SDK
// Usage: loadKakaoSdk(import.meta.env.VITE_KAKAO_JS_KEY).then(kakao => { /* init map */ })
// Ensures single injection and leverages autoload=false for controlled initialization.

let kakaoPromise: Promise<Kakao> | null = null;

export function loadKakaoSdk(appKey: string | undefined): Promise<Kakao> {
  if (!appKey) {
    return Promise.reject(new Error('Kakao JS 앱 키가 설정되지 않았습니다. .env.local에 VITE_KAKAO_JS_KEY를 추가하세요.'));
  }
  if (typeof window !== 'undefined' && window.kakao && kakaoPromise) {
    return kakaoPromise;
  }
  if (kakaoPromise) return kakaoPromise;

  kakaoPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('브라우저 환경이 아닙니다.'));
      return;
    }

    // If kakao already present
    if (window.kakao && window.kakao.maps) {
      resolve(window.kakao);
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>('script[data-kakao-sdk]');
    if (existing) {
      existing.addEventListener('load', () => {
        window.kakao.maps.load(() => resolve(window.kakao));
      });
      existing.addEventListener('error', () => reject(new Error('Kakao SDK 로드 실패')));
      return;
    }

    const script = document.createElement('script');
    script.setAttribute('data-kakao-sdk', 'true');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`;
    script.async = true;
    script.onload = () => {
      try {
        window.kakao.maps.load(() => resolve(window.kakao));
      } catch (e) {
        reject(e instanceof Error ? e : new Error('Kakao maps.load 실행 중 오류')); 
      }
    };
    script.onerror = () => reject(new Error('Kakao SDK 스크립트 로드 오류'));
    document.head.appendChild(script);
  });

  return kakaoPromise;
}

export function isKakaoLoaded(): boolean {
  return typeof window !== 'undefined' && !!window.kakao && !!window.kakao.maps;
}
