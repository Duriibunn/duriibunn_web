import type { Place } from '../types';

// Sample places for demo (Seoul area)
export const mockPlaces: Place[] = [
  {
    id: 'place-1',
    name: '경복궁',
    lat: 37.5796,
    lng: 126.9770,
    category: 'attraction',
    description: '조선시대의 대표적인 궁궐로, 한국의 전통 건축미를 감상할 수 있습니다.',
    openingHours: '09:00 - 18:00',
    rating: 4.8,
    address: '서울특별시 종로구 사직로 161',
    photos: ['https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800'],
  },
  {
    id: 'place-2',
    name: '북촌 한옥마을',
    lat: 37.5824,
    lng: 126.9835,
    category: 'attraction',
    description: '전통 한옥이 밀집한 지역으로, 한국 전통 문화를 체험할 수 있습니다.',
    openingHours: '24시간',
    rating: 4.6,
    address: '서울특별시 종로구 계동길 37',
    photos: ['https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800'],
  },
  {
    id: 'place-3',
    name: '인사동',
    lat: 37.5743,
    lng: 126.9857,
    category: 'shopping',
    description: '전통 공예품, 골동품, 갤러리가 모여있는 문화의 거리입니다.',
    openingHours: '10:00 - 22:00',
    rating: 4.5,
    address: '서울특별시 종로구 인사동길',
    photos: ['https://images.unsplash.com/photo-1548013146-72479768bada?w=800'],
  },
  {
    id: 'place-4',
    name: 'N서울타워',
    lat: 37.5512,
    lng: 126.9882,
    category: 'attraction',
    description: '서울의 상징적인 랜드마크로, 전망대에서 서울 전경을 감상할 수 있습니다.',
    openingHours: '10:00 - 23:00',
    rating: 4.7,
    address: '서울특별시 용산구 남산공원길 105',
    photos: ['https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800'],
  },
  {
    id: 'place-5',
    name: '명동',
    lat: 37.5636,
    lng: 126.9865,
    category: 'shopping',
    description: '서울의 대표적인 쇼핑 거리로, 다양한 브랜드와 먹거리가 있습니다.',
    openingHours: '10:00 - 22:00',
    rating: 4.4,
    address: '서울특별시 중구 명동길',
    photos: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800'],
  },
  {
    id: 'place-6',
    name: '청계천',
    lat: 37.5696,
    lng: 126.9784,
    category: 'attraction',
    description: '도심 속 자연을 느낄 수 있는 산책로입니다.',
    openingHours: '24시간',
    rating: 4.5,
    address: '서울특별시 중구 청계천로',
    photos: ['https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800'],
  },
  {
    id: 'place-7',
    name: '광화문광장',
    lat: 37.5720,
    lng: 126.9769,
    category: 'attraction',
    description: '역사적 의미가 담긴 넓은 광장입니다.',
    openingHours: '24시간',
    rating: 4.6,
    address: '서울특별시 종로구 세종대로',
    photos: ['https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800'],
  },
  {
    id: 'place-8',
    name: '동대문 디자인 플라자',
    lat: 37.5665,
    lng: 127.0088,
    category: 'attraction',
    description: '독특한 건축물로 유명한 복합 문화공간입니다.',
    openingHours: '10:00 - 20:00',
    rating: 4.5,
    address: '서울특별시 중구 을지로 281',
    photos: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800'],
  },
  {
    id: 'place-9',
    name: '이태원',
    lat: 37.5342,
    lng: 126.9948,
    category: 'restaurant',
    description: '다양한 세계 음식과 바를 즐길 수 있는 지역입니다.',
    openingHours: '10:00 - 새벽',
    rating: 4.3,
    address: '서울특별시 용산구 이태원동',
    photos: ['https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800'],
  },
  {
    id: 'place-10',
    name: '한강공원',
    lat: 37.5291,
    lng: 126.9343,
    category: 'attraction',
    description: '한강변을 따라 조성된 여유로운 휴식 공간입니다.',
    openingHours: '24시간',
    rating: 4.7,
    address: '서울특별시 영등포구 여의동로',
    photos: ['https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800'],
  },
];

// Get places by category
export function getPlacesByCategory(category: Place['category']): Place[] {
  return mockPlaces.filter((place) => place.category === category);
}

// Get recommended places (top rated)
export function getRecommendedPlaces(limit: number = 6): Place[] {
  return [...mockPlaces]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, limit);
}

// Search places by name
export function searchPlaces(query: string): Place[] {
  const lowerQuery = query.toLowerCase();
  return mockPlaces.filter((place) =>
    place.name.toLowerCase().includes(lowerQuery) ||
    place.description?.toLowerCase().includes(lowerQuery)
  );
}
