import { useState } from 'react';
import { Settings, LogOut } from 'lucide-react';
import { useTheme } from '../hooks';

export default function Header({ onLogout }) {
  const { theme, setTheme } = useTheme();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const themes = [
    { id: 'dark', label: 'Dark (Tokyo Night)', icon: '🌙' },
    { id: 'light', label: 'Light (Clean)', icon: '☀️' },
    { id: 'ultra-light', label: 'Ultra Light', icon: '✨' },
  ];

  const handleLogout = () => {
    onLogout();
    setShowLogoutConfirm(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-700 dark:border-[#2d2d44] light:border-slate-200 ultra-light:border-slate-300 bg-slate-800/90 dark:bg-[#16161e]/90 light:bg-white/90 ultra-light:bg-slate-50/90 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 dark:from-[#7aa2f7] dark:to-[#bb9af7] light:from-blue-500 light:to-purple-600 ultra-light:from-blue-500 ultra-light:to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">💰</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white dark:text-[#c0caf5] light:text-slate-900 ultra-light:text-slate-900">
              Budget Dashboard
            </h1>
            <p className="text-xs text-slate-400 dark:text-[#a9b1d6] light:text-slate-600 ultra-light:text-slate-600">
              Manage your finances
            </p>
          </div>
        </div>

        <div className="flex gap-2 items-center">
          {/* Theme Settings */}
          <div className="relative">
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="p-2 rounded-lg bg-slate-700 dark:bg-[#2d2d44] light:bg-slate-100 ultra-light:bg-slate-200 hover:bg-slate-600 dark:hover:bg-[#3d3d54] light:hover:bg-slate-200 ultra-light:hover:bg-slate-300 transition"
              title="Theme settings"
            >
              <Settings size={20} className="text-slate-300 dark:text-[#a9b1d6] light:text-slate-700 ultra-light:text-slate-700" />
            </button>

            {showThemeMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-800 dark:bg-[#2d2d44] light:bg-white ultra-light:bg-slate-50 border border-slate-700 dark:border-[#3d3d54] light:border-slate-200 ultra-light:border-slate-300 rounded-lg shadow-lg z-50">
                <div className="p-3 border-b border-slate-700 dark:border-[#3d3d54] light:border-slate-200 ultra-light:border-slate-300">
                  <p className="text-xs font-semibold text-slate-400 dark:text-[#a9b1d6] light:text-slate-600 ultra-light:text-slate-600 uppercase tracking-wider">
                    Theme
                  </p>
                </div>
                <div className="py-2 space-y-1">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTheme(t.id);
                        setShowThemeMenu(false);
                      }}
                      className={`w-full px-4 py-3 text-left text-sm flex items-center gap-3 transition ${
                        theme === t.id
                          ? 'bg-blue-500 dark:bg-[#7aa2f7] light:bg-blue-100 ultra-light:bg-blue-100 text-white dark:text-white light:text-blue-900 ultra-light:text-blue-900 font-medium'
                          : 'text-slate-300 dark:text-[#a9b1d6] light:text-slate-700 ultra-light:text-slate-700 hover:bg-slate-700 dark:hover:bg-[#3d3d54] light:hover:bg-slate-50 ultra-light:hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-lg">{t.icon}</span>
                      <span>{t.label}</span>
                      {theme === t.id && (
                        <span className="ml-auto text-sm">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="p-2 rounded-lg bg-slate-700 dark:bg-[#2d2d44] light:bg-slate-100 ultra-light:bg-slate-200 hover:bg-slate-600 dark:hover:bg-[#3d3d54] light:hover:bg-slate-200 ultra-light:hover:bg-slate-300 transition"
            title="Sign out"
          >
            <LogOut size={20} className="text-red-400" />
          </button>
        </div>
      </div>

      {/* Logout confirmation modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 dark:bg-[#2d2d44] light:bg-white ultra-light:bg-slate-50 rounded-lg p-6 max-w-sm mx-4 border border-slate-700 dark:border-[#3d3d54] light:border-slate-200 ultra-light:border-slate-300">
            <h2 className="text-lg font-bold text-white dark:text-[#c0caf5] light:text-slate-900 ultra-light:text-slate-900 mb-2">
              Sign Out?
            </h2>
            <p className="text-slate-400 dark:text-[#a9b1d6] light:text-slate-600 ultra-light:text-slate-600 mb-6">
              Are you sure you want to sign out? You'll need to log in again to access your budget.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded-lg bg-slate-700 dark:bg-[#3d3d54] light:bg-slate-200 ultra-light:bg-slate-200 text-white dark:text-[#c0caf5] light:text-slate-900 ultra-light:text-slate-900 hover:bg-slate-600 dark:hover:bg-[#4d4d64] light:hover:bg-slate-300 ultra-light:hover:bg-slate-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
