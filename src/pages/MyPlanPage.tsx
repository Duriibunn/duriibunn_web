import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, MapPin } from 'lucide-react';

export default function MyPlanPage() {
  const [selectedDate] = useState(new Date());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">내 일정</h1>
        <p className="text-gray-600">저장된 여행 일정을 관리하세요</p>
      </div>

      {/* Calendar & Itinerary Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2" />
              캘린더
            </h2>
            <div className="text-center py-8">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {format(selectedDate, 'd')}
              </div>
              <div className="text-lg text-gray-900 mb-1">
                {format(selectedDate, 'yyyy년 M월')}
              </div>
              <div className="text-sm text-gray-500">
                {format(selectedDate, 'EEEE')}
              </div>
            </div>
            <div className="mt-6 text-sm text-gray-500 text-center">
              <p>고급 캘린더 UI는</p>
              <p>react-day-picker 또는</p>
              <p>date-fns를 활용하여 구현</p>
            </div>
          </div>
        </div>

        {/* Daily Itinerary Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {format(selectedDate, 'M월 d일')} 일정
            </h2>

            {/* Empty State */}
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-base font-medium text-gray-900 mb-1">
                저장된 일정이 없습니다
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                경로 분석 페이지에서 일정을 만들고 저장하세요
              </p>
              <button
                onClick={() => window.location.href = '/planner'}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                일정 만들기
              </button>
            </div>

            {/* Features Info */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                이 페이지의 기능
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>날짜별 일정 조회 및 수정</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>메모와 사진 추가</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>스크랩한 장소 관리</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Firebase 연동으로 데이터 영구 저장</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
