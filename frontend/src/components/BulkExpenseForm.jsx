import { useState } from 'react';
import { X, Plus, Upload } from 'lucide-react';
import { api } from '../api';

export default function BulkExpenseForm({ categories, onClose, onSuccess }) {
  const [mode, setMode] = useState('quick'); // 'quick' or 'csv'
  const [categoryId, setCategoryId] = useState('');
  const [expenses, setExpenses] = useState([{ name: '', amount: '', frequency: 'monthly' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [csvInput, setCsvInput] = useState('');
  const [csvError, setCsvError] = useState('');

  const addExpenseRow = () => {
    setExpenses([...expenses, { name: '', amount: '', frequency: 'monthly' }]);
  };

  const updateExpense = (index, field, value) => {
    const updated = [...expenses];
    updated[index] = { ...updated[index], [field]: value };
    setExpenses(updated);
  };

  const removeExpense = (index) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  const handleQuickSubmit = async (e) => {
    e.preventDefault();
    if (!categoryId) {
      setError('Please select a category');
      return;
    }

    const validExpenses = expenses.filter(exp => exp.name && exp.amount);
    if (validExpenses.length === 0) {
      setError('Please add at least one expense with name and amount');
      return;
    }

    setLoading(true);
    setError('');

    try {
      for (const expense of validExpenses) {
        await api.createExpense(
          parseInt(categoryId),
          expense.name,
          parseFloat(expense.amount),
          expense.frequency
        );
      }
      setExpenses([{ name: '', amount: '', frequency: 'monthly' }]);
      setCategoryId('');
      onSuccess();
    } catch (err) {
      setError('Error adding expenses: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCSVSubmit = async (e) => {
    e.preventDefault();
    if (!categoryId) {
      setError('Please select a category');
      return;
    }

    if (!csvInput.trim()) {
      setCsvError('Please paste CSV data');
      return;
    }

    const lines = csvInput.trim().split('\n');
    const expensesList = [];

    try {
      for (const line of lines) {
        if (!line.trim()) continue;
        
        const [name, amount, frequency = 'monthly'] = line.split(',').map(s => s.trim());
        
        if (!name || !amount) {
          throw new Error(`Invalid row: "${line}". Format: Name, Amount, [Frequency]`);
        }

        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount)) {
          throw new Error(`Invalid amount in row: "${line}"`);
        }

        expensesList.push({ name, amount: parsedAmount, frequency: frequency || 'monthly' });
      }

      if (expensesList.length === 0) {
        setCsvError('No valid expenses found');
        return;
      }

      setLoading(true);
      setCsvError('');
      setError('');

      for (const expense of expensesList) {
        await api.createExpense(
          parseInt(categoryId),
          expense.name,
          expense.amount,
          expense.frequency
        );
      }

      setCsvInput('');
      setCategoryId('');
      onSuccess();
    } catch (err) {
      setCsvError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-slate-800 dark:bg-[#2d2d44] light:bg-white ultra-light:bg-slate-50 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700 dark:border-[#3d3d54] light:border-slate-200 ultra-light:border-slate-300">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-700 dark:border-[#3d3d54] light:border-slate-200 ultra-light:border-slate-300 sticky top-0 bg-slate-800 dark:bg-[#2d2d44] light:bg-white ultra-light:bg-slate-50">
          <h2 className="text-xl font-bold text-white dark:text-[#c0caf5] light:text-slate-900 ultra-light:text-slate-900">
            Add Multiple Expenses
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-700 dark:hover:bg-[#3d3d54] light:hover:bg-slate-100 ultra-light:hover:bg-slate-200 rounded transition"
          >
            <X size={24} className="text-slate-400 dark:text-[#a9b1d6] light:text-slate-600 ultra-light:text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 dark:text-[#a9b1d6] light:text-slate-700 ultra-light:text-slate-700 mb-2">
              Category (applies to all expenses)
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-slate-700 dark:bg-[#1a1b26] light:bg-slate-50 ultra-light:bg-white border border-slate-600 dark:border-[#3d3d54] light:border-slate-300 ultra-light:border-slate-400 rounded-lg px-4 py-2 text-white dark:text-[#c0caf5] light:text-slate-900 ultra-light:text-slate-900 focus:outline-none focus:border-blue-400"
            >
              <option value="">Select a category...</option>
              {categories.data.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Mode Toggle */}
          <div className="flex gap-2 border-b border-slate-700 dark:border-[#3d3d54] light:border-slate-200 ultra-light:border-slate-300 pb-4">
            <button
              onClick={() => setMode('quick')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                mode === 'quick'
                  ? 'bg-blue-500 dark:bg-[#7aa2f7] light:bg-blue-600 ultra-light:bg-blue-600 text-white'
                  : 'bg-slate-700 dark:bg-[#3d3d54] light:bg-slate-200 ultra-light:bg-slate-200 text-slate-300 dark:text-[#a9b1d6] light:text-slate-700 ultra-light:text-slate-700'
              }`}
            >
              <Plus size={18} className="inline mr-2" />
              Quick Add
            </button>
            <button
              onClick={() => setMode('csv')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                mode === 'csv'
                  ? 'bg-blue-500 dark:bg-[#7aa2f7] light:bg-blue-600 ultra-light:bg-blue-600 text-white'
                  : 'bg-slate-700 dark:bg-[#3d3d54] light:bg-slate-200 ultra-light:bg-slate-200 text-slate-300 dark:text-[#a9b1d6] light:text-slate-700 ultra-light:text-slate-700'
              }`}
            >
              <Upload size={18} className="inline mr-2" />
              CSV Import
            </button>
          </div>

          {/* Quick Add Mode */}
          {mode === 'quick' && (
            <form onSubmit={handleQuickSubmit} className="space-y-4">
              {expenses.map((expense, idx) => (
                <div key={idx} className="flex gap-3 items-end">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Expense name"
                      value={expense.name}
                      onChange={(e) => updateExpense(idx, 'name', e.target.value)}
                      className="w-full bg-slate-700 dark:bg-[#1a1b26] light:bg-slate-50 ultra-light:bg-white border border-slate-600 dark:border-[#3d3d54] light:border-slate-300 ultra-light:border-slate-400 rounded-lg px-3 py-2 text-white dark:text-[#c0caf5] light:text-slate-900 ultra-light:text-slate-900 placeholder-slate-500 text-sm"
                    />
                  </div>
                  <div className="w-24">
                    <input
                      type="number"
                      placeholder="Amount"
                      step="0.01"
                      value={expense.amount}
                      onChange={(e) => updateExpense(idx, 'amount', e.target.value)}
                      className="w-full bg-slate-700 dark:bg-[#1a1b26] light:bg-slate-50 ultra-light:bg-white border border-slate-600 dark:border-[#3d3d54] light:border-slate-300 ultra-light:border-slate-400 rounded-lg px-3 py-2 text-white dark:text-[#c0caf5] light:text-slate-900 ultra-light:text-slate-900 placeholder-slate-500 text-sm"
                    />
                  </div>
                  <div className="w-32">
                    <select
                      value={expense.frequency}
                      onChange={(e) => updateExpense(idx, 'frequency', e.target.value)}
                      className="w-full bg-slate-700 dark:bg-[#1a1b26] light:bg-slate-50 ultra-light:bg-white border border-slate-600 dark:border-[#3d3d54] light:border-slate-300 ultra-light:border-slate-400 rounded-lg px-3 py-2 text-white dark:text-[#c0caf5] light:text-slate-900 ultra-light:text-slate-900 text-sm"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                  {expenses.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExpense(idx)}
                      className="p-2 text-red-400 hover:bg-red-500/20 rounded transition"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              ))}

              {error && (
                <div className="bg-red-500/10 border border-red-500 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={addExpenseRow}
                  className="flex-1 border border-dashed border-slate-600 dark:border-[#3d3d54] light:border-slate-300 ultra-light:border-slate-400 rounded-lg py-2 text-slate-400 dark:text-[#a9b1d6] light:text-slate-600 ultra-light:text-slate-600 hover:bg-slate-700 dark:hover:bg-[#2d2d44] light:hover:bg-slate-100 ultra-light:hover:bg-slate-100 transition"
                >
                  + Add Another
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-500 dark:bg-[#9ece6a] light:bg-green-600 ultra-light:bg-green-600 hover:bg-green-600 dark:hover:bg-[#aade7d] light:hover:bg-green-700 ultra-light:hover:bg-green-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50 font-medium"
                >
                  {loading ? 'Adding...' : `Add ${expenses.filter(e => e.name && e.amount).length} Expense(s)`}
                </button>
              </div>
            </form>
          )}

          {/* CSV Mode */}
          {mode === 'csv' && (
            <form onSubmit={handleCSVSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 dark:text-[#a9b1d6] light:text-slate-700 ultra-light:text-slate-700 mb-2">
                  CSV Format (one per line): Name, Amount, [Frequency]
                </label>
                <p className="text-xs text-slate-400 dark:text-[#a9b1d6] light:text-slate-600 ultra-light:text-slate-600 mb-3">
                  Example:<br/>
                  Groceries, 50, weekly<br/>
                  Netflix, 15.99, monthly<br/>
                  Amazon Prime, 139, yearly
                </p>
                <textarea
                  value={csvInput}
                  onChange={(e) => setCsvInput(e.target.value)}
                  placeholder="Paste CSV data here..."
                  rows="6"
                  className="w-full bg-slate-700 dark:bg-[#1a1b26] light:bg-slate-50 ultra-light:bg-white border border-slate-600 dark:border-[#3d3d54] light:border-slate-300 ultra-light:border-slate-400 rounded-lg px-4 py-2 text-white dark:text-[#c0caf5] light:text-slate-900 ultra-light:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-blue-400 font-mono text-sm"
                />
              </div>

              {(error || csvError) && (
                <div className="bg-red-500/10 border border-red-500 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{error || csvError}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCsvInput('');
                    setCsvError('');
                  }}
                  className="flex-1 bg-slate-700 dark:bg-[#3d3d54] light:bg-slate-200 ultra-light:bg-slate-200 hover:bg-slate-600 dark:hover:bg-[#4d4d64] light:hover:bg-slate-300 ultra-light:hover:bg-slate-300 text-white dark:text-[#c0caf5] light:text-slate-900 ultra-light:text-slate-900 px-4 py-2 rounded-lg transition"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-500 dark:bg-[#9ece6a] light:bg-green-600 ultra-light:bg-green-600 hover:bg-green-600 dark:hover:bg-[#aade7d] light:hover:bg-green-700 ultra-light:hover:bg-green-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50 font-medium"
                >
                  {loading ? 'Importing...' : 'Import Expenses'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
