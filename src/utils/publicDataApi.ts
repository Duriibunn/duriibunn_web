/**
 * Public Data Portal API - 한국관광공사 Tour API
 */

const BASE_URL = '/api/tour';
const API_KEY = import.meta.env.VITE_PUBLIC_DATA_API_KEY || '';

export interface TourPlace {
  contentid: string;
  contenttypeid: string;
  title: string;
  addr1: string;
  addr2?: string;
  tel?: string;
  firstimage?: string;
  firstimage2?: string;
  mapx: string;
  mapy: string;
  mlevel?: string;
  areacode?: string;
  sigungucode?: string;
  cat1?: string;
  cat2?: string;
  cat3?: string;
}

interface ApiResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items?: {
        item?: TourPlace | TourPlace[];
      };
      numOfRows: number;
      pageNo: number;
      totalCount: number;
    };
  };
}

export const CONTENT_TYPES = {
  TOURIST_SPOT: 12,
  CULTURE: 14,
  FESTIVAL: 15,
  COURSE: 25,
  LEPORTS: 28,
  ACCOMMODATION: 32,
  SHOPPING: 38,
  RESTAURANT: 39,
} as const;

export const AREA_CODES: Record<string, number> = {
  '서울': 1,
  '인천': 2,
  '대전': 3,
  '대구': 4,
  '광주': 5,
  '부산': 6,
  '울산': 7,
  '세종': 8,
  '경기': 31,
  '강원': 32,
  '충북': 33,
  '충남': 34,
  '경북': 35,
  '경남': 36,
  '전북': 37,
  '전남': 38,
  '제주': 39,
};

const cache = new Map<string, { data: TourPlace[]; timestamp: number }>();
const CACHE_DURATION = 30 * 60 * 1000;

function getCached(key: string): TourPlace[] | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key: string, data: TourPlace[]): void {
  cache.set(key, { data, timestamp: Date.now() });
}

async function fetchAPI(endpoint: string, params: Record<string, string>, retryCount = 0): Promise<TourPlace[]> {
  if (!API_KEY) {
    console.error('API KEY not set');
    return [];
  }

  const searchParams = new URLSearchParams({
    serviceKey: API_KEY,
    MobileOS: 'ETC',
    MobileApp: 'Dooribun',
    _type: 'json',
    ...params
  });

  const url = `${BASE_URL}/${endpoint}?${searchParams.toString()}`;
  
  try {
    const response = await fetch(url);
    
    if (response.status === 429) {
      // 429 에러 시 재시도 (최대 2번, 2초씩 대기)
      if (retryCount < 2) {
        console.warn(`Rate limit hit, retrying in ${2 * (retryCount + 1)} seconds... (attempt ${retryCount + 1}/2)`);
        await delay(2000 * (retryCount + 1));
        return fetchAPI(endpoint, params, retryCount + 1);
      }
      throw new Error('RATE_LIMIT');
    }
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const json: ApiResponse = await response.json();
    
    if (json.response.header.resultCode !== '0000') {
      return [];
    }

    const items = json.response.body.items?.item;
    if (!items) return [];

    return Array.isArray(items) ? items : [items];
    
  } catch (error) {
    console.error('API Failed:', error);
    throw error;
  }
}

export async function getAreaBasedList(
  areaCode?: number,
  sigunguCode?: number,
  contentTypeId?: number,
  numOfRows: number = 20,
  pageNo: number = 1
): Promise<TourPlace[]> {
  const cacheKey = `area-${areaCode}-${sigunguCode}-${contentTypeId}-${numOfRows}-${pageNo}`;
  
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const params: Record<string, string> = {
    numOfRows: String(numOfRows),
    pageNo: String(pageNo),
    arrange: 'B',
  };

  if (areaCode) params.areaCode = String(areaCode);
  if (sigunguCode) params.sigunguCode = String(sigunguCode);
  if (contentTypeId) params.contentTypeId = String(contentTypeId);

  try {
    const data = await fetchAPI('areaBasedList2', params);
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    const oldCache = cache.get(cacheKey);
    if (oldCache) return oldCache.data;
    return [];
  }
}

export async function searchKeyword(
  keyword: string,
  contentTypeId?: number,
  areaCode?: number,
  numOfRows: number = 20,
  pageNo: number = 1
): Promise<TourPlace[]> {
  const cacheKey = `search-${keyword}-${contentTypeId}-${areaCode}-${numOfRows}-${pageNo}`;
  
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const params: Record<string, string> = {
    keyword,
    numOfRows: String(numOfRows),
    pageNo: String(pageNo),
  };

  if (contentTypeId) params.contentTypeId = String(contentTypeId);
  if (areaCode) params.areaCode = String(areaCode);

  try {
    const data = await fetchAPI('searchKeyword2', params);
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    const oldCache = cache.get(cacheKey);
    if (oldCache) return oldCache.data;
    return [];
  }
}

export async function locationBasedList(
  mapX: number,
  mapY: number,
  radius: number = 1000,
  contentTypeId?: number,
  numOfRows: number = 10
): Promise<TourPlace[]> {
  const params: Record<string, string> = {
    mapX: String(mapX),
    mapY: String(mapY),
    radius: String(radius),
    numOfRows: String(numOfRows),
    pageNo: '1',
  };

  if (contentTypeId) params.contentTypeId = String(contentTypeId);

  try {
    return await fetchAPI('locationBasedList2', params);
  } catch (error) {
    return [];
  }
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function loadMultipleCategories(
  areaCode: number,
  delayMs: number = 1000
): Promise<{
  touristSpots: TourPlace[];
  restaurants: TourPlace[];
  accommodations: TourPlace[];
}> {
  const result = {
    touristSpots: [] as TourPlace[],
    restaurants: [] as TourPlace[],
    accommodations: [] as TourPlace[],
  };

  try {
    result.touristSpots = await getAreaBasedList(areaCode, undefined, CONTENT_TYPES.TOURIST_SPOT, 30);
  } catch (error) {
    console.warn('Failed to load tourist spots');
  }

  await delay(delayMs);

  try {
    result.restaurants = await getAreaBasedList(areaCode, undefined, CONTENT_TYPES.RESTAURANT, 15);
  } catch (error) {
    console.warn('Failed to load restaurants');
  }

  await delay(delayMs);

  try {
    result.accommodations = await getAreaBasedList(areaCode, undefined, CONTENT_TYPES.ACCOMMODATION, 15);
  } catch (error) {
    console.warn('Failed to load accommodations');
  }

  return result;
}

export function getAreaCodeByCity(cityName: string): number | undefined {
  return AREA_CODES[cityName];
}

export function clearCache(): void {
  cache.clear();
}
