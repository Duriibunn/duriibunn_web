import { Link } from 'react-router-dom';
import { Map, Compass, Calendar, Users } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              여행의 모든 순간을
              <br />
              <span className="text-primary-500">완벽하게</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              경로 계획부터 일정 관리까지,
              <br className="sm:hidden" />
              스마트하게 여행을 준비하세요
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/planner"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors font-medium text-lg"
              >
                경로 만들기
              </Link>
              <Link
                to="/explore"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 rounded-xl hover:bg-gray-50 transition-colors font-medium text-lg border border-gray-200"
              >
                장소 탐색
              </Link>
            </div>
          </div>
        </div>

        {/* Hero Image Placeholder */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="aspect-[16/9] bg-gradient-to-br from-primary-100 to-primary-50 rounded-2xl overflow-hidden shadow-lg">
            <div className="w-full h-full flex items-center justify-center">
              <Map className="h-24 w-24 text-primary-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <Link
            to="/planner"
            className="group p-8 bg-white rounded-2xl hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center mb-4">
              <Compass className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">경로 분석</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              최적의 이동 경로를 자동으로 계산합니다
            </p>
          </Link>

          <Link
            to="/explore"
            className="group p-8 bg-white rounded-2xl hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center mb-4">
              <Map className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">장소 탐색</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              다양한 장소를 탐색하고 일정에 추가하세요
            </p>
          </Link>

          <Link
            to="/myplan"
            className="group p-8 bg-white rounded-2xl hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">내 일정</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              저장된 여행 일정을 관리하세요
            </p>
          </Link>

          <Link
            to="/community"
            className="group p-8 bg-white rounded-2xl hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">커뮤니티</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              다른 사용자들의 여행을 둘러보세요
            </p>
          </Link>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">간단한 3단계</h2>
            <p className="text-lg text-gray-600">손쉽게 여행 계획을 완성하세요</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">장소 선택</h3>
              <p className="text-gray-600 leading-relaxed">
                방문하고 싶은 장소를 검색하고 선택하세요
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">일정 구성</h3>
              <p className="text-gray-600 leading-relaxed">
                순서를 조정하고 경로를 최적화하세요
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">경로 확인</h3>
              <p className="text-gray-600 leading-relaxed">
                지도에서 전체 경로를 확인하고 출발하세요
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-500 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4">
            지금 바로 시작하세요
          </h2>
          <p className="text-xl text-primary-100 mb-10">
            더 스마트한 여행 계획을 경험해보세요
          </p>
          <Link
            to="/planner"
            className="inline-flex items-center justify-center px-10 py-4 bg-white text-primary-600 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-lg"
          >
            무료로 시작하기
          </Link>
        </div>
      </div>
    </div>
  );
}
