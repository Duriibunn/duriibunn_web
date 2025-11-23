import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { User, Lock, LogIn, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [redirectMessage, setRedirectMessage] = useState('');

  useEffect(() => {
    // 리다이렉트 메시지 확인
    const state = location.state as { message?: string; from?: string } | null;
    if (state?.message) {
      setRedirectMessage(state.message);
    }
  }, [location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // username을 이메일 형식으로 변환 (Firebase는 이메일 필요)
      const email = `${username}@duriibunn.app`;
      await signInWithEmailAndPassword(auth, email, password);
      
      // 리다이렉트 경로가 있으면 해당 경로로, 없으면 홈으로
      const state = location.state as { from?: string } | null;
      navigate(state?.from || '/');
    } catch (err: unknown) {
      console.error('Login error:', err);
      
      // Firebase 에러 메시지 한글화
      const firebaseError = err as { code?: string };
      switch (firebaseError.code) {
        case 'auth/invalid-email':
          setError(t('invalidUsername'));
          break;
        case 'auth/user-disabled':
          setError(t('userDisabled'));
          break;
        case 'auth/user-not-found':
          setError(t('userNotFound'));
          break;
        case 'auth/wrong-password':
          setError(t('wrongPassword'));
          break;
        case 'auth/invalid-credential':
          setError(t('invalidCredential'));
          break;
        default:
          setError(t('loginFailed'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-linear-to-br from-blue-50 via-white to-teal-50">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-linear-to-br from-blue-500 to-teal-500">
            <span className="text-2xl font-bold text-white">두</span>
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            {t('loginTitle')}
          </h1>
          <p className="text-gray-600">
            {t('loginSubtitle')}
          </p>
        </div>

        {/* Login Form */}
        <div className="p-8 bg-white border border-gray-100 shadow-xl rounded-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Redirect Message */}
            {redirectMessage && (
              <div className="flex items-center gap-2 p-4 text-sm text-blue-800 border border-blue-200 bg-blue-50 rounded-xl">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{redirectMessage}</span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-4 text-sm text-red-800 border border-red-200 bg-red-50 rounded-xl">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Username Input */}
            <div>
              <label htmlFor="username" className="block mb-2 text-sm font-semibold text-gray-900">
                {t('username')}
              </label>
              <div className="relative">
                <User className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-4 top-1/2" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t('usernamePlaceholder')}
                  className="w-full py-3 pl-12 pr-4 text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-semibold text-gray-900">
                {t('password')}
              </label>
              <div className="relative">
                <Lock className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-4 top-1/2" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('passwordPlaceholder')}
                  className="w-full py-3 pl-12 pr-4 text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
                  required
                />
              </div>
            </div>

            {/* Remember & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-600">{t('rememberMe')}</span>
              </label>
              <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-700">
                {t('forgotPassword')}
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center w-full gap-2 px-6 py-3 font-semibold text-white transition-all shadow-lg bg-linear-to-r from-blue-500 to-teal-500 rounded-xl hover:from-blue-600 hover:to-teal-600 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                  <span>{t('loggingIn')}</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>{t('login')}</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 text-gray-500 bg-white">{t('or')}</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-gray-600">
              {t('noAccount')}{' '}
              <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-700">
                {t('signUp')}
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
            ← {t('backToHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}
