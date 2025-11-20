// Loading spinner component
export default function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-12 w-12 border-2',
    lg: 'h-16 w-16 border-4',
  };

  return (
    <div className={`animate-spin rounded-full ${sizeClasses[size]} border-b-primary-500 border-t-transparent border-l-transparent border-r-transparent`} />
  );
}

// Full-screen loading overlay
export function LoadingOverlay({ message }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
      <LoadingSpinner size="lg" />
      {message && <p className="mt-4 text-gray-700 font-medium">{message}</p>}
    </div>
  );
}
