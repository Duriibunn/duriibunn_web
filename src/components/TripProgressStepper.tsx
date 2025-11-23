import { Check, MapPin, Calendar, Star, Route } from 'lucide-react';

interface TripStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
}

const TRIP_STEPS: TripStep[] = [
  {
    id: 1,
    title: '도시 선택',
    description: '여행지를 정해주세요',
    icon: <MapPin className="w-5 h-5" />,
    path: '/trip/select-city'
  },
  {
    id: 2,
    title: '여행 기간',
    description: '언제 떠나시나요?',
    icon: <Calendar className="w-5 h-5" />,
    path: '/trip/select-dates'
  },
  {
    id: 3,
    title: '장소 추천',
    description: '어디에 가볼까요?',
    icon: <Star className="w-5 h-5" />,
    path: '/trip/recommendations'
  },
  {
    id: 4,
    title: '일정 생성',
    description: '완벽한 여행 계획',
    icon: <Route className="w-5 h-5" />,
    path: '/trip/schedule'
  }
];

interface TripProgressStepperProps {
  currentStep: number;
  className?: string;
}

export default function TripProgressStepper({ currentStep, className = '' }: TripProgressStepperProps) {
  return (
    <div className={`w-full ${className}`}>
      {/* Mobile: Horizontal Progress Bar */}
      <div className="block md:hidden mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            단계 {currentStep} / {TRIP_STEPS.length}
          </span>
          <span className="text-sm font-medium text-primary-600">
            {Math.round((currentStep / TRIP_STEPS.length) * 100)}% 완료
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / TRIP_STEPS.length) * 100}%` }}
          />
        </div>
        <div className="mt-3 text-center">
          <h3 className="font-semibold text-gray-900">{TRIP_STEPS[currentStep - 1]?.title}</h3>
          <p className="text-sm text-gray-600">{TRIP_STEPS[currentStep - 1]?.description}</p>
        </div>
      </div>

      {/* Desktop: Step-by-step Progress */}
      <div className="hidden md:block">
        <nav aria-label="일정 생성 진행률">
          <ol className="flex items-center justify-center space-x-8">
            {TRIP_STEPS.map((step, index) => (
              <li key={step.id} className="flex items-center">
                <div className="flex flex-col items-center group">
                  {/* Step Circle */}
                  <div
                    className={`
                      flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-200
                      ${currentStep > step.id 
                        ? 'bg-primary-500 border-primary-500 text-white' 
                        : currentStep === step.id 
                        ? 'border-primary-500 bg-white text-primary-500 ring-4 ring-primary-100' 
                        : 'border-gray-300 bg-white text-gray-400'
                      }
                    `}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      step.icon
                    )}
                  </div>

                  {/* Step Info */}
                  <div className="mt-3 text-center">
                    <h3 
                      className={`
                        font-semibold text-sm
                        ${currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'}
                      `}
                    >
                      {step.title}
                    </h3>
                    <p 
                      className={`
                        text-xs mt-1
                        ${currentStep >= step.id ? 'text-gray-600' : 'text-gray-400'}
                      `}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Connector Line */}
                {index < TRIP_STEPS.length - 1 && (
                  <div
                    className={`
                      w-16 h-1 mx-4 transition-all duration-300
                      ${currentStep > step.id ? 'bg-primary-500' : 'bg-gray-300'}
                    `}
                  />
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
}

// TRIP_STEPS and TripStep are internal to this component