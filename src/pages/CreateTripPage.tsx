import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight, Sparkles, Users, Heart } from 'lucide-react';

const KOREAN_CITIES = [
  { id: 'gapyeong', name: '가평', emoji: '🏞️', description: '청평호와 아침고요수목원' },
  { id: 'yangpyeong', name: '양평', emoji: '🌳', description: '두물머리와 자연 휴양지' },
  { id: 'gangneung', name: '강릉', emoji: '�', description: '커피와 바다의 도시' },
  { id: 'sokcho', name: '속초', emoji: '🦑', description: '설악산과 동해바다' },
  { id: 'gyeongju', name: '경주', emoji: '🏰', description: '천년 고도, 살아있는 박물관' },
  { id: 'busan', name: '부산', emoji: '🏖️', description: '해운대와 광안리 해변' },
  { id: 'yeosu', name: '여수', emoji: '🌅', description: '아름다운 밤바다와 케이블카' },
  { id: 'incheon', name: '인천', emoji: '✈️', description: '월미도와 차이나타운' },
  { id: 'jeonju', name: '전주', emoji: '🏛️', description: '한옥마을과 비빔밥' },
  { id: 'jeju', name: '제주', emoji: '🌴', description: '한국의 하와이, 자연의 보고' },
  { id: 'chuncheon', name: '춘천', emoji: '🦆', description: '닭갈비와 남이섬' },
  { id: 'hongcheon', name: '홍천', emoji: '�', description: '비발디파크와 청정자연' },
  { id: 'taean', name: '태안', emoji: '🏖️', description: '안면도와 서해바다' },
  { id: 'tongyeong', name: '통영', emoji: '🚡', description: '케이블카와 동피랑 벽화마을' },
  { id: 'geoje', name: '거제', emoji: '⚓', description: '해금강과 바람의 언덕' },
  { id: 'namhae', name: '남해', emoji: '🌊', description: '독일마을과 보리암' },
  { id: 'pohang', name: '포항', emoji: '🌅', description: '호미곶과 과메기의 고장' },
  { id: 'andong', name: '안동', emoji: '�', description: '하회마을과 전통문화' },
];

const TRAVEL_COMPANIONS = [
  { id: 'solo', name: '혼자', emoji: '🧳' },
  { id: 'friends', name: '친구와', emoji: '👥' },
  { id: 'couple', name: '연인과', emoji: '💑' },
  { id: 'spouse', name: '배우자와', emoji: '💏' },
  { id: 'children', name: '아이와', emoji: '👨‍👩‍👧' },
  { id: 'parents', name: '부모님과', emoji: '👴👵' },
  { id: 'other', name: '기타', emoji: '👨‍👩‍👧‍👦' },
];

const TRAVEL_STYLES = [
  { id: 'activity', name: '체험 액티비티', emoji: '🎢' },
  { id: 'hotplace', name: 'SNS 핫플레이스', emoji: '📸' },
  { id: 'nature', name: '자연과 함께', emoji: '🏞️' },
  { id: 'tourist', name: '유명 관광지는 필수', emoji: '🗺️' },
  { id: 'healing', name: '여유롭게 힐링', emoji: '🧘' },
  { id: 'culture', name: '문화 예술 역사', emoji: '🎨' },
  { id: 'local', name: '여행지 느낌 물씬', emoji: '🏘️' },
  { id: 'shopping', name: '쇼핑은 열정적으로', emoji: '🛍️' },
  { id: 'food', name: '관광보다 먹방', emoji: '🍜' },
];

export default function CreateTripPage() {
  const navigate = useNavigate();
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(tomorrow);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [tripTitle, setTripTitle] = useState('');
  const [companion, setCompanion] = useState<string>('');
  const [travelStyle, setTravelStyle] = useState<string[]>([]);

  const toggleTravelStyle = (styleId: string) => {
    if (travelStyle.includes(styleId)) {
      setTravelStyle(travelStyle.filter(s => s !== styleId));
    } else {
      setTravelStyle([...travelStyle, styleId]);
    }
  };

  const handleNext = () => {
    if (!selectedCity || !startDate || !endDate) {
      alert('모든 정보를 입력해주세요!');
      return;
    }

    const cityName = KOREAN_CITIES.find(c => c.id === selectedCity)?.name || '';
    const days = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000) + 1;

    // Save to sessionStorage
    sessionStorage.setItem('newTrip', JSON.stringify({
      city: selectedCity,
      cityName,
      startDate,
      endDate,
      days,
      title: tripTitle || `${cityName} ${days}일 여행`,
      companion,
      travelStyle,
    }));

    navigate('/create-trip/select-places');
  };

  const getDayCount = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.ceil((end.getTime() - start.getTime()) / 86400000) + 1;
    return diff > 0 ? diff : 1;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-teal-600">1 / 3 단계</span>
            <span className="text-sm text-gray-500">날짜 & 도시 선택</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-teal-500 rounded-full" style={{ width: '33%' }}></div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-2xl mb-4">
            <Sparkles className="w-8 h-8 text-teal-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            여행 계획을 시작해볼까요?
          </h1>
          <p className="text-lg text-gray-600">
            날짜와 도시를 선택하면 맞춤 장소를 추천해드립니다
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-6">
          {/* Trip Title */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              여행 제목 (선택사항)
            </label>
            <input
              type="text"
              value={tripTitle}
              onChange={(e) => setTripTitle(e.target.value)}
              placeholder="예: 가족과 함께하는 제주도 여행"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Date Selection */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              <Calendar className="inline w-4 h-4 mr-1" />
              여행 기간
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-2">출발일</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base text-gray-900"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-2">복귀일</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base text-gray-900"
                />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              총 <span className="font-semibold text-teal-600">{getDayCount()}일</span> 여행
            </p>
          </div>

          {/* City Selection */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              <MapPin className="inline w-4 h-4 mr-1" />
              여행 도시
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {KOREAN_CITIES.map((city) => (
                <button
                  key={city.id}
                  onClick={() => setSelectedCity(city.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-center ${
                    selectedCity === city.id
                      ? 'border-teal-500 bg-teal-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="text-3xl mb-2">{city.emoji}</div>
                  <div className="font-semibold text-gray-900 mb-1">{city.name}</div>
                  <div className="text-xs text-gray-500 leading-tight">{city.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Travel Companion */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              <Users className="inline w-4 h-4 mr-1" />
              누구와 함께 (선택사항)
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {TRAVEL_COMPANIONS.map((comp) => (
                <button
                  key={comp.id}
                  onClick={() => setCompanion(comp.id)}
                  className={`p-3 rounded-xl border-2 transition-all text-center ${
                    companion === comp.id
                      ? 'border-teal-500 bg-teal-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="text-2xl mb-1">{comp.emoji}</div>
                  <div className="text-xs font-medium text-gray-900">{comp.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Travel Style */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              <Heart className="inline w-4 h-4 mr-1" />
              여행 스타일 (중복 선택 가능)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TRAVEL_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => toggleTravelStyle(style.id)}
                  className={`p-3 rounded-xl border-2 transition-all text-left flex items-center space-x-2 ${
                    travelStyle.includes(style.id)
                      ? 'border-teal-500 bg-teal-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <span className="text-xl">{style.emoji}</span>
                  <span className="text-sm font-medium text-gray-900">{style.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleNext}
            disabled={!selectedCity}
            className="flex items-center space-x-2 px-8 py-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            <span>다음</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
