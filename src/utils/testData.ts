// Test utility to populate sample trips in localStorage
// Run this in browser console to test the "My Trips" section

export const sampleTrips = [
  {
    id: 'trip-seoul-001',
    title: '서울 주말 여행',
    city: '서울',
    startDate: '2025-12-01',
    endDate: '2025-12-03',
    days: 3,
    itineraries: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'trip-jeju-001',
    title: '제주도 힐링 여행',
    city: '제주',
    startDate: '2025-12-15',
    endDate: '2025-12-18',
    days: 4,
    itineraries: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'trip-busan-001',
    title: '부산 바다 여행',
    city: '부산',
    startDate: '2026-01-05',
    endDate: '2026-01-06',
    days: 2,
    itineraries: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'trip-gangneung-001',
    title: '강릉 겨울 여행',
    city: '강릉',
    startDate: '2026-01-20',
    endDate: '2026-01-22',
    days: 3,
    itineraries: [],
    createdAt: new Date().toISOString()
  }
];

// Add sample trips to localStorage
export function addSampleTrips() {
  localStorage.setItem('myTrips', JSON.stringify(sampleTrips));
  console.log('✅ Sample trips added to localStorage');
  console.log('Refresh the page to see the changes');
}

// Clear all trips from localStorage
export function clearTrips() {
  localStorage.removeItem('myTrips');
  console.log('🗑️ All trips cleared from localStorage');
  console.log('Refresh the page to see the changes');
}

// Show current trips in localStorage
export function showTrips() {
  const trips = localStorage.getItem('myTrips');
  if (trips) {
    console.log('Current trips:', JSON.parse(trips));
  } else {
    console.log('No trips in localStorage');
  }
}

// Browser console commands:
// To test with sample data:
//   localStorage.setItem('myTrips', JSON.stringify([{id:"trip-1",title:"서울 여행",city:"서울",startDate:"2025-12-01",endDate:"2025-12-03",days:3}]))
//
// To clear:
//   localStorage.removeItem('myTrips')
//
// Then refresh the page
