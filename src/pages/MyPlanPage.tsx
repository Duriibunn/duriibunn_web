import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, MapPin } from 'lucide-react';

export default function MyPlanPage() {
  const [selectedDate] = useState(new Date());

  return (
    <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">내 일정</h1>
        <p className="text-gray-600">저장된 여행 일정을 관리하세요</p>
      </div>

      {/* Calendar & Itinerary Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Calendar Section */}
        <div className="lg:col-span-1">
          <div className="p-6 bg-white border border-gray-200 rounded-lg">
            <h2 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
              <CalendarIcon className="w-5 h-5 mr-2" />
              캘린더
            </h2>
            <div className="py-8 text-center">
              <div className="mb-2 text-4xl font-bold text-blue-600">
                {format(selectedDate, 'd')}
              </div>
              <div className="mb-1 text-lg text-gray-900">
                {format(selectedDate, 'yyyy년 M월')}
              </div>
              <div className="text-sm text-gray-500">
                {format(selectedDate, 'EEEE')}
              </div>
            </div>
            <div className="mt-6 text-sm text-center text-gray-500">
              <p>고급 캘린더 UI는</p>
              <p>react-day-picker 또는</p>
              <p>date-fns를 활용하여 구현</p>
            </div>
          </div>
        </div>

        {/* Daily Itinerary Section */}
        <div className="lg:col-span-2">
          <div className="p-6 bg-white border border-gray-200 rounded-lg">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              {format(selectedDate, 'M월 d일')} 일정
            </h2>

            {/* Empty State */}
            <div className="py-12 text-center">
              <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <h3 className="mb-1 text-base font-medium text-gray-900">
                저장된 일정이 없습니다
              </h3>
              <p className="mb-6 text-sm text-gray-500">
                경로 분석 페이지에서 일정을 만들고 저장하세요
              </p>
              <button
                onClick={() => window.location.href = '/planner'}
                className="px-6 py-2 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                일정 만들기
              </button>
            </div>

            {/* Features Info */}
            <div className="pt-6 mt-8 border-t border-gray-200">
              <h3 className="mb-3 text-sm font-semibold text-gray-900">
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
