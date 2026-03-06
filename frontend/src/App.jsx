import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useTheme, useFetch, useAuth } from './hooks';
import { api } from './api';
import Header from './components/Header';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import CategoryManager from './components/CategoryManager';
import ExpenseManager from './components/ExpenseManager';
import PaycheckManager from './components/PaycheckManager';
import CreditCardManager from './components/CreditCardManager';
import './App.css';

export default function App() {
  const { theme } = useTheme();
  const { user, loading, register, login, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = useFetch(() => (user ? api.getCategories() : Promise.resolve([])), [user]);
  const expenses = useFetch(() => (user ? api.getExpenses() : Promise.resolve([])), [user]);
  const paychecks = useFetch(() => (user ? api.getPaychecks() : Promise.resolve([])), [user]);
  const creditCards = useFetch(() => (user ? api.getCreditCards() : Promise.resolve([])), [user]);

  const handleAuthSubmit = async (formData, isLogin) => {
    if (isLogin) {
      const success = await login(formData.username, formData.password);
      if (!success) throw new Error('Login failed');
    } else {
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      const success = await register(formData.username, formData.email, formData.password);
      if (!success) throw new Error('Registration failed');
    }
  };

  const handleCategoryCreated = () => {
    categories.refetch();
  };

  const handleExpenseCreated = () => {
    expenses.refetch();
    categories.refetch();
  };

  const handlePaycheckCreated = () => {
    paychecks.refetch();
  };

  const handleCardCreated = () => {
    creditCards.refetch();
  };

  // Show loading screen
  if (loading) {
    return (
      <div className={theme}>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-[#1a1b26] dark:via-[#16161e] dark:to-[#1a1b26] light:from-slate-50 light:via-white light:to-slate-100 ultra-light:from-white ultra-light:via-slate-25 ultra-light:to-slate-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 dark:from-[#7aa2f7] dark:to-[#bb9af7] light:from-blue-500 light:to-purple-600 ultra-light:from-blue-500 ultra-light:to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
              <span className="text-white font-bold text-2xl">💰</span>
            </div>
            <p className="text-slate-400 dark:text-[#a9b1d6] light:text-slate-600 ultra-light:text-slate-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show auth page if not logged in
  if (!user) {
    return <AuthPage onLogin={handleAuthSubmit} />;
  }

  return (
    <div className={theme}>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-[#1a1b26] dark:via-[#16161e] dark:to-[#1a1b26] light:from-slate-50 light:via-white light:to-slate-100 ultra-light:from-white ultra-light:via-white ultra-light:to-slate-50">
        <Header onLogout={logout} />

        <nav className="border-b border-slate-700 dark:border-[#2d2d44] light:border-slate-200 ultra-light:border-slate-300 sticky top-16 z-40 bg-slate-800/80 dark:bg-[#16161e]/80 light:bg-white/80 ultra-light:bg-slate-50/80 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-0">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-3 font-medium border-b-2 transition ${
                  activeTab === 'dashboard'
                    ? 'border-blue-400 dark:border-[#7aa2f7] light:border-blue-600 ultra-light:border-blue-600 text-blue-400 dark:text-[#7aa2f7] light:text-blue-600 ultra-light:text-blue-600'
                    : 'border-transparent text-slate-400 dark:text-[#a9b1d6] light:text-slate-600 ultra-light:text-slate-600 hover:text-slate-300 dark:hover:text-slate-200 light:hover:text-slate-700 ultra-light:hover:text-slate-700'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('expenses')}
                className={`px-4 py-3 font-medium border-b-2 transition ${
                  activeTab === 'expenses'
                    ? 'border-blue-400 dark:border-[#7aa2f7] light:border-blue-600 ultra-light:border-blue-600 text-blue-400 dark:text-[#7aa2f7] light:text-blue-600 ultra-light:text-blue-600'
                    : 'border-transparent text-slate-400 dark:text-[#a9b1d6] light:text-slate-600 ultra-light:text-slate-600 hover:text-slate-300 dark:hover:text-slate-200 light:hover:text-slate-700 ultra-light:hover:text-slate-700'
                }`}
              >
                Expenses
              </button>
              <button
                onClick={() => setActiveTab('paychecks')}
                className={`px-4 py-3 font-medium border-b-2 transition ${
                  activeTab === 'paychecks'
                    ? 'border-blue-400 dark:border-[#7aa2f7] light:border-blue-600 ultra-light:border-blue-600 text-blue-400 dark:text-[#7aa2f7] light:text-blue-600 ultra-light:text-blue-600'
                    : 'border-transparent text-slate-400 dark:text-[#a9b1d6] light:text-slate-600 ultra-light:text-slate-600 hover:text-slate-300 dark:hover:text-slate-200 light:hover:text-slate-700 ultra-light:hover:text-slate-700'
                }`}
              >
                Paychecks
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`px-4 py-3 font-medium border-b-2 transition ${
                  activeTab === 'categories'
                    ? 'border-blue-400 dark:border-[#7aa2f7] light:border-blue-600 ultra-light:border-blue-600 text-blue-400 dark:text-[#7aa2f7] light:text-blue-600 ultra-light:text-blue-600'
                    : 'border-transparent text-slate-400 dark:text-[#a9b1d6] light:text-slate-600 ultra-light:text-slate-600 hover:text-slate-300 dark:hover:text-slate-200 light:hover:text-slate-700 ultra-light:hover:text-slate-700'
                }`}
              >
                Categories
              </button>
              <button
                onClick={() => setActiveTab('credit-cards')}
                className={`px-4 py-3 font-medium border-b-2 transition ${
                  activeTab === 'credit-cards'
                    ? 'border-blue-400 dark:border-[#7aa2f7] light:border-blue-600 ultra-light:border-blue-600 text-blue-400 dark:text-[#7aa2f7] light:text-blue-600 ultra-light:text-blue-600'
                    : 'border-transparent text-slate-400 dark:text-[#a9b1d6] light:text-slate-600 ultra-light:text-slate-600 hover:text-slate-300 dark:hover:text-slate-200 light:hover:text-slate-700 ultra-light:hover:text-slate-700'
                }`}
              >
                Credit Cards
              </button>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center justify-between py-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-slate-700 dark:hover:bg-[#2d2d44] light:hover:bg-slate-200 ultra-light:hover:bg-slate-100 transition"
              >
                {mobileMenuOpen ? (
                  <X size={24} className="text-slate-300 dark:text-[#a9b1d6] light:text-slate-700 ultra-light:text-slate-700" />
                ) : (
                  <Menu size={24} className="text-slate-300 dark:text-[#a9b1d6] light:text-slate-700 ultra-light:text-slate-700" />
                )}
              </button>
              <span className="text-sm font-medium text-slate-300 dark:text-[#a9b1d6] light:text-slate-700 ultra-light:text-slate-700">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')}
              </span>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
              <div className="md:hidden border-t border-slate-700 dark:border-[#3d3d54] light:border-slate-300 ultra-light:border-slate-300 py-2">
                {[
                  { id: 'dashboard', label: 'Dashboard' },
                  { id: 'expenses', label: 'Expenses' },
                  { id: 'paychecks', label: 'Paychecks' },
                  { id: 'categories', label: 'Categories' },
                  { id: 'credit-cards', label: 'Credit Cards' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 transition ${
                      activeTab === item.id
                        ? 'bg-slate-700 dark:bg-[#2d2d44] light:bg-blue-50 ultra-light:bg-blue-50 text-blue-400 dark:text-[#7aa2f7] light:text-blue-600 ultra-light:text-blue-600 font-medium'
                        : 'text-slate-400 dark:text-[#a9b1d6] light:text-slate-700 ultra-light:text-slate-700 hover:bg-slate-700 dark:hover:bg-[#2d2d44] light:hover:bg-slate-100 ultra-light:hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        <main className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
          {activeTab === 'dashboard' && (
            <Dashboard
              categories={categories}
              expenses={expenses}
              paychecks={paychecks}
              creditCards={creditCards}
            />
          )}
          {activeTab === 'expenses' && (
            <ExpenseManager
              categories={categories}
              expenses={expenses}
              onExpenseCreated={handleExpenseCreated}
            />
          )}
          {activeTab === 'paychecks' && (
            <PaycheckManager
              paychecks={paychecks}
              onPaycheckCreated={handlePaycheckCreated}
            />
          )}
          {activeTab === 'categories' && (
            <CategoryManager
              categories={categories}
              onCategoryCreated={handleCategoryCreated}
            />
          )}
          {activeTab === 'credit-cards' && (
            <CreditCardManager
              creditCards={creditCards}
              onCardCreated={handleCardCreated}
            />
          )}
        </main>
      </div>
    </div>
  );
}
