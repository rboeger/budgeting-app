import { useState } from 'react';
import { Plus, Edit2, Trash2, X, ChevronDown, Upload } from 'lucide-react';
import { api } from '../api';
import BulkExpenseForm from './BulkExpenseForm';

export default function ExpenseManager({ categories, expenses, onExpenseCreated }) {
  const [showForm, setShowForm] = useState(false);
  const [showBulkForm, setShowBulkForm] = useState(false);
  const [formData, setFormData] = useState({
    categoryId: '',
    name: '',
    amount: '',
    frequency: 'monthly',
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Filter and sort state
  const [filterCategory, setFilterCategory] = useState('');
  const [filterFrequency, setFilterFrequency] = useState('');
  const [sortBy, setSortBy] = useState('category');
  const [sortOrder, setSortOrder] = useState('asc');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        await api.updateExpense(
          editingId,
          parseInt(formData.categoryId),
          formData.name,
          parseFloat(formData.amount),
          formData.frequency
        );
      } else {
        await api.createExpense(
          parseInt(formData.categoryId),
          formData.name,
          parseFloat(formData.amount),
          formData.frequency
        );
      }

      setFormData({
        categoryId: '',
        name: '',
        amount: '',
        frequency: 'monthly',
      });
      setEditingId(null);
      setShowForm(false);
      onExpenseCreated();
    } catch (err) {
      alert('Error saving expense: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (expense) => {
    setFormData({
      categoryId: expense.categoryId,
      name: expense.name,
      amount: expense.amount,
      frequency: expense.frequency,
    });
    setEditingId(expense.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      try {
        await api.deleteExpense(id);
        onExpenseCreated();
      } catch (err) {
        alert('Error deleting expense: ' + err.message);
      }
    }
  };

  // Filter and sort expenses
  const filteredExpenses = expenses.data
    .filter((expense) => {
      if (filterCategory && expense.categoryId !== parseInt(filterCategory)) return false;
      if (filterFrequency && expense.frequency !== filterFrequency) return false;
      return true;
    })
    .sort((a, b) => {
      let aVal, bVal;
      
      switch (sortBy) {
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case 'amount':
          aVal = a.amount;
          bVal = b.amount;
          break;
        case 'category':
          aVal = a.categoryName?.toLowerCase() || '';
          bVal = b.categoryName?.toLowerCase() || '';
          break;
        case 'frequency':
          aVal = a.frequency;
          bVal = b.frequency;
          break;
        default:
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
      }
      
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white dark:text-[#c0caf5] light:text-slate-900 ultra-light:text-slate-900">
          Expenses
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowBulkForm(true)}
            className="flex items-center gap-2 bg-purple-500 dark:bg-[#bb9af7] light:bg-purple-600 ultra-light:bg-purple-600 hover:bg-purple-600 dark:hover:bg-[#cab9f7] light:hover:bg-purple-700 ultra-light:hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition"
            title="Add multiple expenses at once"
          >
            <Upload size={20} />
            Bulk Add
          </button>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setFormData({
                categoryId: '',
                name: '',
                amount: '',
                frequency: 'monthly',
              });
            }}
            className="flex items-center gap-2 bg-blue-500 dark:bg-[#7aa2f7] light:bg-blue-600 ultra-light:bg-blue-600 hover:bg-blue-600 dark:hover:bg-[#8ab1f7] light:hover:bg-blue-700 ultra-light:hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            <Plus size={20} />
            New Expense
          </button>
        </div>
      </div>

      {/* Filter and Sort Controls */}
      <div className="bg-slate-700 dark:bg-[#2d2d44] light:bg-slate-100 ultra-light:bg-white rounded-lg p-4 border border-slate-600 dark:border-[#3d3d54] light:border-slate-200 ultra-light:border-slate-300">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 dark:text-[#a9b1d6] light:text-slate-700 ultra-light:text-slate-700 mb-2">
              Filter by Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full bg-slate-600 dark:bg-[#1a1b26] light:bg-white ultra-light:bg-slate-50 border border-slate-500 dark:border-[#3d3d54] light:border-slate-300 ultra-light:border-slate-300 rounded-lg px-3 py-1 text-sm text-white dark:text-[#c0caf5] light:text-slate-900 ultra-light:text-slate-900 focus:outline-none focus:border-blue-400"
            >
              <option value="">All Categories</option>
              {categories.data.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 dark:text-[#a9b1d6] light:text-slate-700 ultra-light:text-slate-700 mb-2">
              Filter by Frequency
            </label>
            <select
              value={filterFrequency}
              onChange={(e) => setFilterFrequency(e.target.value)}
              className="w-full bg-slate-600 dark:bg-[#1a1b26] light:bg-white ultra-light:bg-slate-50 border border-slate-500 dark:border-[#3d3d54] light:border-slate-300 ultra-light:border-slate-300 rounded-lg px-3 py-1 text-sm text-white dark:text-[#c0caf5] light:text-slate-900 ultra-light:text-slate-900 focus:outline-none focus:border-blue-400"
            >
              <option value="">All Frequencies</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 dark:text-[#a9b1d6] light:text-slate-700 ultra-light:text-slate-700 mb-2">
              Sort by
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-slate-600 dark:bg-[#1a1b26] light:bg-white ultra-light:bg-slate-50 border border-slate-500 dark:border-[#3d3d54] light:border-slate-300 ultra-light:border-slate-300 rounded-lg px-3 py-1 text-sm text-white dark:text-[#c0caf5] light:text-slate-900 ultra-light:text-slate-900 focus:outline-none focus:border-blue-400"
            >
              <option value="category">Category</option>
              <option value="name">Name</option>
              <option value="amount">Amount</option>
              <option value="frequency">Frequency</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 dark:text-[#a9b1d6] light:text-slate-700 ultra-light:text-slate-700 mb-2">
              Order
            </label>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="w-full bg-slate-600 dark:bg-[#1a1b26] light:bg-white ultra-light:bg-slate-50 border border-slate-500 dark:border-[#3d3d54] light:border-slate-300 ultra-light:border-slate-300 hover:bg-slate-500 dark:hover:bg-[#2d2d44] light:hover:bg-slate-50 ultra-light:hover:bg-slate-100 rounded-lg px-3 py-1 text-sm text-white dark:text-[#c0caf5] light:text-slate-900 ultra-light:text-slate-900 transition flex items-center justify-center gap-2"
            >
              {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
            </button>
          </div>
        </div>
        <p className="text-xs text-slate-400 dark:text-[#a9b1d6] light:text-slate-600 ultra-light:text-slate-600 mt-3">
          Showing {filteredExpenses.length} of {expenses.data.length} expenses
        </p>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-slate-700 dark:bg-[#2d2d44] light:bg-slate-100 ultra-light:bg-white rounded-lg p-6 border border-slate-600 dark:border-[#3d3d54] light:border-slate-200 ultra-light:border-slate-300">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 dark:text-[#a9b1d6] light:text-slate-700 ultra-light:text-slate-700 mb-2">
                Category
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                required
                className="w-full bg-slate-600 dark:bg-[#1a1b26] light:bg-white ultra-light:bg-slate-50 border border-slate-500 dark:border-[#3d3d54] light:border-slate-300 ultra-light:border-slate-300 rounded-lg px-4 py-2 text-white dark:text-[#c0caf5] light:text-slate-900 ultra-light:text-slate-900 focus:outline-none focus:border-blue-400"
              >
                <option value="">Select a category</option>
                {categories.data.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 dark:text-[#a9b1d6] light:text-slate-700 mb-2">
                Expense Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="E.g., Netflix, Gym, Car Payment"
                required
                className="w-full bg-slate-600 dark:bg-[#1a1b26] light:bg-white border border-slate-500 dark:border-[#3d3d54] light:border-slate-300 rounded-lg px-4 py-2 text-white dark:text-[#c0caf5] light:text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 dark:text-[#a9b1d6] light:text-slate-700 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  required
                  className="w-full bg-slate-600 dark:bg-[#1a1b26] light:bg-white border border-slate-500 dark:border-[#3d3d54] light:border-slate-300 rounded-lg px-4 py-2 text-white dark:text-[#c0caf5] light:text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 dark:text-[#a9b1d6] light:text-slate-700 mb-2">
                  Frequency
                </label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  className="w-full bg-slate-600 dark:bg-[#1a1b26] light:bg-white border border-slate-500 dark:border-[#3d3d54] light:border-slate-300 rounded-lg px-4 py-2 text-white dark:text-[#c0caf5] light:text-slate-900 focus:outline-none focus:border-blue-400"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-500 dark:bg-[#9ece6a] light:bg-green-600 hover:bg-green-600 dark:hover:bg-[#aade7d] light:hover:bg-green-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="flex-1 bg-slate-600 dark:bg-[#1a1b26] light:bg-white border border-slate-500 dark:border-[#3d3d54] light:border-slate-300 hover:bg-slate-500 dark:hover:bg-[#2d2d44] light:hover:bg-slate-50 text-white dark:text-[#c0caf5] light:text-slate-900 px-4 py-2 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Expenses Table - Desktop View */}
      <div className="hidden md:block bg-slate-700 dark:bg-[#2d2d44] light:bg-slate-100 rounded-lg border border-slate-600 dark:border-[#3d3d54] light:border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-600 dark:bg-[#1a1b26] light:bg-white border-b border-slate-600 dark:border-[#3d3d54] light:border-slate-300">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300 dark:text-[#a9b1d6] light:text-slate-700">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300 dark:text-[#a9b1d6] light:text-slate-700">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300 dark:text-[#a9b1d6] light:text-slate-700">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300 dark:text-[#a9b1d6] light:text-slate-700">
                  Frequency
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-slate-300 dark:text-[#a9b1d6] light:text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense) => (
                <tr
                  key={expense.id}
                  className="border-b border-slate-600 dark:border-[#3d3d54] light:border-slate-300 hover:bg-slate-600 dark:hover:bg-[#3d3d54] light:hover:bg-white transition"
                >
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded"
                        style={{
                          backgroundColor:
                            categories.data.find((c) => c.id === expense.categoryId)?.color || '#888',
                        }}
                      />
                      <span className="text-white dark:text-[#c0caf5] light:text-slate-900">
                        {expense.categoryName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-white dark:text-[#c0caf5] light:text-slate-900">
                    {expense.name}
                  </td>
                  <td className="px-6 py-3 text-white dark:text-[#c0caf5] light:text-slate-900 font-semibold">
                    ${expense.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-3">
                    <span className="inline-block bg-slate-600 dark:bg-[#1a1b26] light:bg-white px-2 py-1 rounded text-xs text-slate-300 dark:text-[#a9b1d6] light:text-slate-700">
                      {expense.frequency}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(expense)}
                        className="p-1 hover:bg-slate-500 dark:hover:bg-[#2d2d44] light:hover:bg-slate-200 rounded transition"
                      >
                        <Edit2 size={16} className="text-blue-400 dark:text-[#7aa2f7] light:text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="p-1 hover:bg-slate-500 dark:hover:bg-[#2d2d44] light:hover:bg-slate-200 rounded transition"
                      >
                        <Trash2 size={16} className="text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expenses Cards - Mobile View */}
      <div className="md:hidden space-y-3">
        {filteredExpenses.map((expense) => (
          <div
            key={expense.id}
            className="bg-slate-700 dark:bg-[#2d2d44] light:bg-slate-100 rounded-lg p-4 border border-slate-600 dark:border-[#3d3d54] light:border-slate-200"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{
                    backgroundColor:
                      categories.data.find((c) => c.id === expense.categoryId)?.color || '#888',
                  }}
                />
                <span className="text-sm font-medium text-slate-400 dark:text-[#a9b1d6] light:text-slate-700">
                  {expense.categoryName}
                </span>
              </div>
              <span className="text-xs bg-slate-600 dark:bg-[#1a1b26] light:bg-white px-2 py-1 rounded text-slate-300 dark:text-[#a9b1d6] light:text-slate-700">
                {expense.frequency}
              </span>
            </div>
            <p className="text-white dark:text-[#c0caf5] light:text-slate-900 font-semibold mb-2">
              {expense.name}
            </p>
            <p className="text-lg font-bold text-blue-400 dark:text-[#7aa2f7] light:text-blue-600 mb-3">
              ${expense.amount.toFixed(2)}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => handleEdit(expense)}
                className="p-2 hover:bg-slate-600 dark:hover:bg-[#3d3d54] light:hover:bg-white rounded transition"
              >
                <Edit2 size={16} className="text-blue-400 dark:text-[#7aa2f7] light:text-blue-600" />
              </button>
              <button
                onClick={() => handleDelete(expense.id)}
                className="p-2 hover:bg-slate-600 dark:hover:bg-[#3d3d54] light:hover:bg-white rounded transition"
              >
                <Trash2 size={16} className="text-red-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredExpenses.length === 0 && !showForm && (
        <div className="text-center py-8">
          <p className="text-slate-400 dark:text-[#a9b1d6] light:text-slate-600 mb-4">
            {expenses.data.length === 0 ? 'No expenses yet. Create one to get started!' : 'No expenses match your filters.'}
          </p>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingId(null);
                setFormData({
                  categoryId: '',
                  name: '',
                  amount: '',
                  frequency: 'monthly',
                });
              }}
              className="inline-flex items-center gap-2 bg-blue-500 dark:bg-[#7aa2f7] light:bg-blue-600 hover:bg-blue-600 dark:hover:bg-[#8ab1f7] light:hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              <Plus size={20} />
              Create Expense
            </button>
          </div>
        )}

      {showBulkForm && (
        <BulkExpenseForm
          categories={categories}
          onClose={() => setShowBulkForm(false)}
          onSuccess={() => {
            setShowBulkForm(false);
            onExpenseCreated();
          }}
        />
      )}
    </div>
  );
}
