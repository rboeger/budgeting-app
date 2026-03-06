import { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { api } from '../api';

export default function CreditCardManager({ creditCards, onCardCreated }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    balance: '',
    interestRate: '',
    payoffDate: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Calculate monthly payment
  const calculateMonthlyPayment = (balance, annualRate, payoffDate) => {
    const principal = parseFloat(balance) || 0;
    const annualRatePercent = parseFloat(annualRate) || 0;
    const monthlyRate = annualRatePercent / 100 / 12;

    // Calculate months until payoff date
    const today = new Date();
    const payoff = new Date(payoffDate);
    const monthsDiff =
      (payoff.getFullYear() - today.getFullYear()) * 12 +
      (payoff.getMonth() - today.getMonth());

    if (monthsDiff <= 0) {
      return 0;
    }

    // If interest rate is 0, simple division
    if (monthlyRate === 0) {
      return principal / monthsDiff;
    }

    // Standard amortization formula
    const numerator = principal * (monthlyRate * Math.pow(1 + monthlyRate, monthsDiff));
    const denominator = Math.pow(1 + monthlyRate, monthsDiff) - 1;
    return numerator / denominator;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        await api.updateCreditCard(
          editingId,
          formData.name,
          parseFloat(formData.balance),
          parseFloat(formData.interestRate),
          formData.payoffDate
        );
      } else {
        await api.createCreditCard(
          formData.name,
          parseFloat(formData.balance),
          parseFloat(formData.interestRate),
          formData.payoffDate
        );
      }

      setFormData({
        name: '',
        balance: '',
        interestRate: '',
        payoffDate: '',
      });
      setEditingId(null);
      setShowForm(false);
      onCardCreated();
    } catch (err) {
      alert('Error saving card: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (card) => {
    setFormData({
      name: card.name,
      balance: card.balance,
      interestRate: card.interestRate,
      payoffDate: card.payoffDate,
    });
    setEditingId(card.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this credit card?')) {
      try {
        await api.deleteCreditCard(id);
        onCardCreated();
      } catch (err) {
        alert('Error deleting card: ' + err.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white dark:text-[#c0caf5] light:text-slate-900">
          Credit Cards
        </h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({
              name: '',
              balance: '',
              interestRate: '',
              payoffDate: '',
            });
          }}
          className="flex items-center gap-2 bg-blue-500 dark:bg-[#7aa2f7] light:bg-blue-600 hover:bg-blue-600 dark:hover:bg-[#8ab1f7] light:hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus size={20} />
          New Card
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-slate-700 dark:bg-[#2d2d44] light:bg-slate-100 ultra-light:bg-white rounded-lg p-6 border border-slate-600 dark:border-[#3d3d54] light:border-slate-200 ultra-light:border-slate-300">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 dark:text-[#a9b1d6] light:text-slate-700 ultra-light:text-slate-700 mb-2">
                Card Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="E.g., Visa, Mastercard, Amex"
                required
                className="w-full bg-slate-600 dark:bg-[#1a1b26] light:bg-white ultra-light:bg-slate-50 border border-slate-500 dark:border-[#3d3d54] light:border-slate-300 ultra-light:border-slate-300 rounded-lg px-4 py-2 text-white dark:text-[#c0caf5] light:text-slate-900 ultra-light:text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 dark:text-[#a9b1d6] light:text-slate-700 ultra-light:text-slate-700 mb-2">
                  Balance
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.balance}
                  onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                  placeholder="0.00"
                  required
                  className="w-full bg-slate-600 dark:bg-[#1a1b26] light:bg-white ultra-light:bg-slate-50 border border-slate-500 dark:border-[#3d3d54] light:border-slate-300 ultra-light:border-slate-300 rounded-lg px-4 py-2 text-white dark:text-[#c0caf5] light:text-slate-900 ultra-light:text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 dark:text-[#a9b1d6] light:text-slate-700 ultra-light:text-slate-700 mb-2">
                  Annual Interest Rate (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.interestRate}
                  onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                  placeholder="0.00"
                  required
                  className="w-full bg-slate-600 dark:bg-[#1a1b26] light:bg-white ultra-light:bg-slate-50 border border-slate-500 dark:border-[#3d3d54] light:border-slate-300 ultra-light:border-slate-300 rounded-lg px-4 py-2 text-white dark:text-[#c0caf5] light:text-slate-900 ultra-light:text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 dark:text-[#a9b1d6] light:text-slate-700 ultra-light:text-slate-700 mb-2">
                Target Payoff Date
              </label>
              <input
                type="date"
                value={formData.payoffDate}
                onChange={(e) => setFormData({ ...formData, payoffDate: e.target.value })}
                required
                className="w-full bg-slate-600 dark:bg-[#1a1b26] light:bg-white ultra-light:bg-slate-50 border border-slate-500 dark:border-[#3d3d54] light:border-slate-300 ultra-light:border-slate-300 rounded-lg px-4 py-2 text-white dark:text-[#c0caf5] light:text-slate-900 ultra-light:text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400"
              />
            </div>

            {formData.balance && formData.interestRate && formData.payoffDate && (
              <div className="bg-slate-600 dark:bg-[#1a1b26] light:bg-white ultra-light:bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-400 dark:text-[#a9b1d6] light:text-slate-600 ultra-light:text-slate-600">
                  Calculated Monthly Payment
                </p>
                <p className="text-xl font-bold text-green-400 dark:text-[#9ece6a] light:text-green-600 ultra-light:text-green-600">
                  ${calculateMonthlyPayment(
                    formData.balance,
                    formData.interestRate,
                    formData.payoffDate
                  ).toFixed(2)}
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-500 dark:bg-[#9ece6a] light:bg-green-600 ultra-light:bg-green-600 hover:bg-green-600 dark:hover:bg-[#aade7d] light:hover:bg-green-700 ultra-light:hover:bg-green-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="flex-1 bg-slate-600 dark:bg-[#1a1b26] light:bg-white ultra-light:bg-slate-200 border border-slate-500 dark:border-[#3d3d54] light:border-slate-300 ultra-light:border-slate-300 hover:bg-slate-500 dark:hover:bg-[#2d2d44] light:hover:bg-slate-50 ultra-light:hover:bg-slate-300 text-white dark:text-[#c0caf5] light:text-slate-900 ultra-light:text-slate-900 px-4 py-2 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Credit Cards List */}
      <div className="space-y-4">
        {creditCards.data.map((card) => {
          const monthlyPayment = calculateMonthlyPayment(
            card.balance,
            card.interestRate,
            card.payoffDate
          );
          return (
            <div
              key={card.id}
              className="bg-slate-700 dark:bg-[#2d2d44] light:bg-slate-100 ultra-light:bg-white rounded-lg p-6 border border-slate-600 dark:border-[#3d3d54] light:border-slate-200 ultra-light:border-slate-300 group hover:border-blue-400 transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white dark:text-[#c0caf5] light:text-slate-900 ultra-light:text-slate-900">
                    {card.name}
                  </h3>
                  <p className="text-sm text-slate-400 dark:text-[#a9b1d6] light:text-slate-600 ultra-light:text-slate-600">
                    Payoff by {new Date(card.payoffDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => handleEdit(card)}
                    className="p-2 hover:bg-slate-600 dark:hover:bg-[#1a1b26] light:hover:bg-white ultra-light:hover:bg-slate-50 rounded transition"
                  >
                    <Edit2 size={16} className="text-blue-400 dark:text-[#7aa2f7] light:text-blue-600 ultra-light:text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(card.id)}
                    className="p-2 hover:bg-slate-600 dark:hover:bg-[#1a1b26] light:hover:bg-white rounded transition"
                  >
                    <Trash2 size={16} className="text-red-400" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-slate-400 dark:text-[#a9b1d6] light:text-slate-600">
                    Balance
                  </p>
                  <p className="text-lg font-bold text-red-400">
                    ${card.balance.toFixed(2)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400 dark:text-[#a9b1d6] light:text-slate-600">
                    Interest Rate
                  </p>
                  <p className="text-lg font-bold text-orange-400">
                    {card.interestRate.toFixed(2)}%
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400 dark:text-[#a9b1d6] light:text-slate-600">
                    Monthly Payment
                  </p>
                    <p className="text-lg font-bold text-blue-400 dark:text-[#7aa2f7] light:text-blue-600 ultra-light:text-blue-600">
                    ${monthlyPayment.toFixed(2)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400 dark:text-[#a9b1d6] light:text-slate-600">
                    Months to Payoff
                  </p>
                  <p className="text-lg font-bold text-green-400 dark:text-[#9ece6a] light:text-green-600">
                    {Math.max(
                      1,
                      Math.ceil(
                        (new Date(card.payoffDate) - new Date()) / (1000 * 60 * 60 * 24 * 30)
                      )
                    )}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {creditCards.data.length === 0 && !showForm && (
        <div className="bg-slate-700 dark:bg-[#2d2d44] light:bg-slate-100 ultra-light:bg-white rounded-lg p-8 border border-slate-600 dark:border-[#3d3d54] light:border-slate-200 ultra-light:border-slate-300 text-center">
          <p className="text-slate-400 dark:text-[#a9b1d6] light:text-slate-600 ultra-light:text-slate-600 mb-4">
            No credit cards yet. Add one to track payoff plans.
          </p>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setFormData({
                name: '',
                balance: '',
                interestRate: '',
                payoffDate: '',
              });
            }}
            className="inline-flex items-center gap-2 bg-blue-500 dark:bg-[#7aa2f7] light:bg-blue-600 hover:bg-blue-600 dark:hover:bg-[#8ab1f7] light:hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            <Plus size={20} />
            Add Credit Card
          </button>
        </div>
      )}
    </div>
  );
}
