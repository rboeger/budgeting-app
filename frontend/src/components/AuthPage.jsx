import { useState } from 'react';
import { useTheme } from '../hooks';
import { LogIn } from 'lucide-react';

export default function AuthPage({ onLogin }) {
  const { theme } = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onLogin(formData, isLogin);
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className={theme}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-[#1a1b26] dark:via-[#16161e] dark:to-[#1a1b26] light:from-slate-50 light:via-white light:to-slate-100 ultra-light:from-white ultra-light:via-slate-25 ultra-light:to-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-slate-800 dark:bg-[#2d2d44] light:bg-white ultra-light:bg-slate-50 rounded-lg shadow-2xl p-8 border border-slate-700 dark:border-[#3d3d54] light:border-slate-200 ultra-light:border-slate-300">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 dark:from-[#7aa2f7] dark:to-[#bb9af7] light:from-blue-500 light:to-purple-600 ultra-light:from-blue-500 ultra-light:to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">💰</span>
              </div>
              <h1 className="text-3xl font-bold text-white dark:text-[#c0caf5] light:text-slate-900 ultra-light:text-slate-900 mb-2">
                Budget Dashboard
              </h1>
              <p className="text-slate-400 dark:text-[#a9b1d6] light:text-slate-600 ultra-light:text-slate-600">
                {isLogin ? 'Sign in to your account' : 'Create a new account'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-slate-300 dark:text-[#a9b1d6] light:text-slate-700 ultra-light:text-slate-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter your username"
                  required
                  className="w-full bg-slate-700 dark:bg-[#1a1b26] light:bg-slate-50 ultra-light:bg-white border border-slate-600 dark:border-[#3d3d54] light:border-slate-300 ultra-light:border-slate-400 rounded-lg px-4 py-2 text-white dark:text-[#c0caf5] light:text-slate-900 ultra-light:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                />
              </div>

              {/* Email - Only for signup */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 dark:text-[#a9b1d6] light:text-slate-700 ultra-light:text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required={!isLogin}
                    className="w-full bg-slate-700 dark:bg-[#1a1b26] light:bg-slate-50 ultra-light:bg-white border border-slate-600 dark:border-[#3d3d54] light:border-slate-300 ultra-light:border-slate-400 rounded-lg px-4 py-2 text-white dark:text-[#c0caf5] light:text-slate-900 ultra-light:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                  />
                </div>
              )}

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-300 dark:text-[#a9b1d6] light:text-slate-700 ultra-light:text-slate-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                  className="w-full bg-slate-700 dark:bg-[#1a1b26] light:bg-slate-50 ultra-light:bg-white border border-slate-600 dark:border-[#3d3d54] light:border-slate-300 ultra-light:border-slate-400 rounded-lg px-4 py-2 text-white dark:text-[#c0caf5] light:text-slate-900 ultra-light:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                />
              </div>

              {/* Confirm Password - Only for signup */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 dark:text-[#a9b1d6] light:text-slate-700 ultra-light:text-slate-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    required={!isLogin}
                    className="w-full bg-slate-700 dark:bg-[#1a1b26] light:bg-slate-50 ultra-light:bg-white border border-slate-600 dark:border-[#3d3d54] light:border-slate-300 ultra-light:border-slate-400 rounded-lg px-4 py-2 text-white dark:text-[#c0caf5] light:text-slate-900 ultra-light:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                  />
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 dark:bg-[#7aa2f7] light:bg-blue-600 ultra-light:bg-blue-600 hover:bg-blue-600 dark:hover:bg-[#8ab1f7] light:hover:bg-blue-700 ultra-light:hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2"
              >
                <LogIn size={20} />
                {loading
                  ? 'please wait...'
                  : isLogin
                  ? 'Sign In'
                  : 'Create Account'}
              </button>
            </form>

            {/* Toggle Login/Signup */}
            <div className="mt-6 text-center">
              <p className="text-slate-400 dark:text-[#a9b1d6] light:text-slate-600">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                    setFormData({
                      username: '',
                      email: '',
                      password: '',
                      confirmPassword: '',
                    });
                  }}
                  className="text-blue-400 dark:text-[#7aa2f7] light:text-blue-600 hover:underline font-semibold"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>

          {/* Demo Info */}
          <div className="mt-6 text-center text-sm text-slate-400 dark:text-[#a9b1d6] light:text-slate-600">
            <p>Create an account or sign in to get started</p>
          </div>
        </div>
      </div>
    </div>
  );
}
