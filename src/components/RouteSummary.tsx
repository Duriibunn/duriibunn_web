import type { RouteSegment } from '../types';
import { Clock, Navigation, TrendingUp } from 'lucide-react';
import { formatDuration, formatDistance, calculateRouteSummary } from '../utils/routeUtils';

interface RouteSummaryProps {
  segments: RouteSegment[];
}

export default function RouteSummary({ segments }: RouteSummaryProps) {
  if (segments.length === 0) {
    return null;
  }

  const summary = calculateRouteSummary(segments);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
        <TrendingUp className="h-4 w-4 mr-2" />
        경로 요약
      </h3>
      
      <div className="space-y-3">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center text-blue-600 mb-1">
              <Clock className="h-4 w-4 mr-1" />
              <span className="text-xs font-medium">총 소요시간</span>
            </div>
            <div className="text-lg font-bold text-blue-900">
              {formatDuration(summary.totalDurationMins)}
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex items-center text-green-600 mb-1">
              <Navigation className="h-4 w-4 mr-1" />
              <span className="text-xs font-medium">총 이동거리</span>
            </div>
            <div className="text-lg font-bold text-green-900">
              {formatDistance(summary.totalDistanceMeters)}
            </div>
          </div>
        </div>

        {/* Segment Details */}
        <div className="border-t border-gray-200 pt-3">
          <h4 className="text-xs font-medium text-gray-700 mb-2">구간별 정보</h4>
          <div className="space-y-2">
            {segments.map((segment, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm py-2 border-b last:border-b-0"
              >
                <span className="text-gray-600">구간 {index + 1}</span>
                <div className="text-right">
                  <div className="font-medium text-gray-900">
                    {formatDuration(segment.durationMins)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDistance(segment.distanceMeters)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
