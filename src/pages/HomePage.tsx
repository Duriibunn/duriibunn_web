import { Link, useNavigate } from 'react-router-dom';
import { Map } from 'lucide-react';
import { getRecommendedPlaces } from '../data/mockPlaces';
import { getRecommendedHotels } from '../data/mockHotels';

export default function HomePage() {
  const navigate = useNavigate();
  const recommendedAttractions = getRecommendedPlaces(4);
  const recommendedHotels = getRecommendedHotels(3);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      {/* Hero Section - date prompt + CTA */}
      <div className="relative bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              언제 떠나시나요?
            </h1>
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
              여행 일정을 입력하면 맞춤 추천과 자동 경로 계획을 도와드립니다.
            </p>

            <div className="mt-8">
              <button
                onClick={() => navigate('/create-trip')}
                className="px-12 py-5 bg-teal-500 text-white text-xl font-bold rounded-2xl hover:bg-teal-600 shadow-2xl"
              >
                여행 일정 만들기
              </button>
            </div>

            <p className="text-sm text-gray-500 mt-8">추천 숙소와 관광지를 확인해보세요</p>
          </div>
        </div>

        {/* Hero Image / Illustration */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="aspect-[16/9] bg-linear-to-br from-primary-100 to-primary-50 rounded-2xl overflow-hidden shadow-lg">
            <div className="w-full h-full flex items-center justify-center">
              <Map className="h-20 w-20 text-primary-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Hotels */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">추천 숙소</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendedHotels.map((h) => (
                <div key={h.id} className="bg-white rounded-xl overflow-hidden shadow-sm">
                  <div className="h-36 bg-gray-100">
                    <img src={h.photos?.[0]} alt={h.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{h.name}</h3>
                        <p className="text-sm text-gray-600">{h.address}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900">{h.rating}</div>
                        <div className="text-xs text-gray-500">후기</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-3">{h.description}</p>
                    <div className="mt-4 flex gap-2">
                      <Link to="/explore" className="text-sm text-primary-600">자세히 보기</Link>
                      <button
                        onClick={() => navigate('/create-trip')}
                        className="ml-auto text-sm px-3 py-2 bg-primary-50 text-primary-700 rounded-md"
                      >
                        숙소로 선택
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Attractions */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">추천 관광지</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendedAttractions.map((p) => (
                <div key={p.id} className="bg-white rounded-xl overflow-hidden shadow-sm p-4">
                  <div className="flex items-start gap-3">
                    <img src={p.photos?.[0]} alt={p.name} className="w-20 h-20 rounded-lg object-cover" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{p.name}</h3>
                      <p className="text-sm text-gray-600">{p.category}</p>
                      <p className="text-sm text-gray-500 mt-2">{p.description}</p>
                      <div className="mt-3">
                        <button
                          onClick={() => navigate('/create-trip')}
                          className="text-sm px-3 py-2 bg-primary-50 text-primary-700 rounded-md"
                        >
                          일정에 추가
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* How It Works (keep smaller) */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">간단한 3단계</h2>
          <p className="text-gray-600">장소 선택 → 일정 구성 → 경로 확인</p>
        </div>
      </div>

    </div>
  );
}
