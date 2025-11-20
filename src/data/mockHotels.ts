import type { Place } from '../types';

export const mockHotels: Place[] = [
  {
    id: 'hotel-1',
    name: '포근한 호텔 서울',
    lat: 37.5660,
    lng: 126.9784,
    category: 'hotel',
    description: '중심가에 위치한 깔끔한 비즈니스 호텔입니다.',
    rating: 4.4,
    address: '서울특별시 중구',
    photos: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800'],
  },
  {
    id: 'hotel-2',
    name: '뷰포인트 스위트',
    lat: 37.5510,
    lng: 126.9882,
    category: 'hotel',
    description: '전망 좋은 객실을 자랑하는 스위트 호텔.',
    rating: 4.7,
    address: '서울특별시 용산구',
    photos: ['https://images.unsplash.com/photo-1501117716987-c8e2b0f3d0b5?w=800'],
  },
  {
    id: 'hotel-3',
    name: '한옥 스타일 게스트하우스',
    lat: 37.5820,
    lng: 126.9830,
    category: 'hotel',
    description: '전통 한옥을 개조한 아늑한 숙소.',
    rating: 4.6,
    address: '서울특별시 종로구',
    photos: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'],
  },
];

export function getRecommendedHotels(limit = 3): Place[] {
  return [...mockHotels].slice(0, limit);
}
