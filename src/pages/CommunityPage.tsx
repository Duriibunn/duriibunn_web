import { Users, Heart, MessageCircle } from 'lucide-react';

export default function CommunityPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">커뮤니티</h1>
        <p className="text-gray-600">다른 사용자들의 여행 경로를 둘러보세요</p>
      </div>

      {/* Coming Soon */}
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          커뮤니티 기능 준비 중
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          다른 사용자들의 여행 경로를 공유하고, 좋아요와 댓글을 남길 수 있는 기능을 준비하고 있습니다.
        </p>

        {/* Feature Preview */}
        <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-4 border border-gray-200 rounded-lg">
            <Users className="h-8 w-8 text-blue-600 mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">경로 공유</h3>
            <p className="text-sm text-gray-600">
              나만의 여행 경로를 다른 사용자와 공유
            </p>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <Heart className="h-8 w-8 text-red-500 mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">좋아요</h3>
            <p className="text-sm text-gray-600">
              마음에 드는 경로에 좋아요 표시
            </p>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <MessageCircle className="h-8 w-8 text-green-600 mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">댓글</h3>
            <p className="text-sm text-gray-600">
              여행 팁과 후기를 댓글로 공유
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
