import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { api } from '../api';

export default function PaycheckManager({ paychecks, onPaycheckCreated }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    frequency: 'biweekly',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.createPaycheck(parseFloat(formData.amount), formData.frequency);
      setFormData({ amount: '', frequency: 'biweekly' });
      setShowForm(false);
      onPaycheckCreated();
    } catch (err) {
      alert('Error saving paycheck: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this paycheck?')) {
      try {
        await api.deletePaycheck(id);
        onPaycheckCreated();
      } catch (err) {
        alert('Error deleting paycheck: ' + err.message);
      }
    }
  };

  const calculateMonthly = (amount, frequency, all = false) => {
    if (frequency === 'weekly') {
      return all ? (amount * 52) / 12 : amount * 4;
    } else if (frequency === 'biweekly') {
      return all ? (amount * 26) / 12 : amount * 2;
    }
    return 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white dark:text-[#c0caf5] light:text-slate-900">
          Paychecks
        </h1>
        <button
          onClick={() => {
            setShowForm(true);
            setFormData({ amount: '', frequency: 'biweekly' });
          }}
          className="flex items-center gap-2 bg-blue-500 dark:bg-[#7aa2f7] light:bg-blue-600 hover:bg-blue-600 dark:hover:bg-[#8ab1f7] light:hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus size={20} />
          New Paycheck
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-slate-700 dark:bg-[#2d2d44] light:bg-slate-100 ultra-light:bg-white rounded-lg p-6 border border-slate-600 dark:border-[#3d3d54] light:border-slate-200 ultra-light:border-slate-300">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 dark:text-[#a9b1d6] light:text-slate-700 ultra-light:text-slate-700 mb-2">
                Amount
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                required
                className="w-full bg-slate-600 dark:bg-[#1a1b26] light:bg-white ultra-light:bg-slate-50 border border-slate-500 dark:border-[#3d3d54] light:border-slate-300 ultra-light:border-slate-300 rounded-lg px-4 py-2 text-white dark:text-[#c0caf5] light:text-slate-900 ultra-light:text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 dark:text-[#a9b1d6] light:text-slate-700 ultra-light:text-slate-700 mb-2">
                Frequency
              </label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                className="w-full bg-slate-600 dark:bg-[#1a1b26] light:bg-white ultra-light:bg-slate-50 border border-slate-500 dark:border-[#3d3d54] light:border-slate-300 ultra-light:border-slate-300 rounded-lg px-4 py-2 text-white dark:text-[#c0caf5] light:text-slate-900 ultra-light:text-slate-900 focus:outline-none focus:border-blue-400"
              >
                <option value="weekly">Weekly</option>
                <option value="biweekly">Biweekly</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-500 dark:bg-[#9ece6a] light:bg-green-600 ultra-light:bg-green-600 hover:bg-green-600 dark:hover:bg-[#aade7d] light:hover:bg-green-700 ultra-light:hover:bg-green-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-slate-600 dark:bg-[#1a1b26] light:bg-white ultra-light:bg-slate-200 border border-slate-500 dark:border-[#3d3d54] light:border-slate-300 ultra-light:border-slate-300 hover:bg-slate-500 dark:hover:bg-[#2d2d44] light:hover:bg-slate-50 ultra-light:hover:bg-slate-300 text-white dark:text-[#c0caf5] light:text-slate-900 ultra-light:text-slate-900 px-4 py-2 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Paychecks List */}
      <div className="space-y-4">
        {paychecks.data.map((paycheck) => (
          <div
            key={paycheck.id}
            className="bg-slate-700 dark:bg-[#2d2d44] light:bg-slate-100 ultra-light:bg-white rounded-lg p-6 border border-slate-600 dark:border-[#3d3d54] light:border-slate-200 ultra-light:border-slate-300"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-3 flex-1">
                <div>
                  <p className="text-sm text-slate-400 dark:text-[#a9b1d6] light:text-slate-600 ultra-light:text-slate-600">
                    {paycheck.frequency.charAt(0).toUpperCase() + paycheck.frequency.slice(1)}{' '}
                    Paycheck
                  </p>
                  <p className="text-2xl font-bold text-white dark:text-[#c0caf5] light:text-slate-900 ultra-light:text-slate-900">
                    ${paycheck.amount.toFixed(2)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-600 dark:border-[#3d3d54] light:border-slate-300 ultra-light:border-slate-300">
                  <div>
                    <p className="text-xs text-slate-400 dark:text-[#a9b1d6] light:text-slate-600 ultra-light:text-slate-600">
                      4-Week Monthly
                    </p>
                    <p className="text-lg font-semibold text-green-400 dark:text-[#9ece6a] light:text-green-600 ultra-light:text-green-600">
                      ${calculateMonthly(paycheck.amount, paycheck.frequency, false).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 dark:text-[#a9b1d6] light:text-slate-600">
                      Yearly Average
                    </p>
                    <p className="text-lg font-semibold text-blue-400 dark:text-[#7aa2f7] light:text-blue-600 ultra-light:text-blue-600">
                      ${calculateMonthly(paycheck.amount, paycheck.frequency, true).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDelete(paycheck.id)}
                className="p-2 hover:bg-slate-600 dark:hover:bg-[#1a1b26] light:hover:bg-white ultra-light:hover:bg-slate-50 rounded transition ml-4"
              >
                <Trash2 size={20} className="text-red-400" />
              </button>
            </div>
          </div>
        ))}

        {paychecks.data.length === 0 && !showForm && (
          <div className="bg-slate-700 dark:bg-[#2d2d44] light:bg-slate-100 ultra-light:bg-white rounded-lg p-8 border border-slate-600 dark:border-[#3d3d54] light:border-slate-200 ultra-light:border-slate-300 text-center">
            <p className="text-slate-400 dark:text-[#a9b1d6] light:text-slate-600 ultra-light:text-slate-600 mb-4">
              No paychecks added yet. Add your paycheck to see income calculations.
            </p>
            <button
              onClick={() => {
                setShowForm(true);
                setFormData({ amount: '', frequency: 'biweekly' });
              }}
              className="inline-flex items-center gap-2 bg-blue-500 dark:bg-[#7aa2f7] light:bg-blue-600 hover:bg-blue-600 dark:hover:bg-[#8ab1f7] light:hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              <Plus size={20} />
              Add Paycheck
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
