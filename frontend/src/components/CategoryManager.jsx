import { useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { api } from '../api';

export default function CategoryManager({ categories, onCategoryCreated }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', color: '#7aa2f7' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        await api.updateCategory(editingId, formData.name, formData.color);
      } else {
        await api.createCategory(formData.name, formData.color);
      }

      setFormData({ name: '', color: '#7aa2f7' });
      setEditingId(null);
      setShowForm(false);
      onCategoryCreated();
    } catch (err) {
      alert('Error saving category: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setFormData({ name: category.name, color: category.color });
    setEditingId(category.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await api.deleteCategory(id);
        onCategoryCreated();
      } catch (err) {
        alert('Error deleting category: ' + err.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white dark:text-[#c0caf5] light:text-slate-900">
          Categories
        </h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({ name: '', color: '#7aa2f7' });
          }}
          className="flex items-center gap-2 bg-blue-500 dark:bg-[#7aa2f7] light:bg-blue-600 hover:bg-blue-600 dark:hover:bg-[#8ab1f7] light:hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus size={20} />
          New Category
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-slate-700 dark:bg-[#2d2d44] light:bg-slate-100 ultra-light:bg-white rounded-lg p-6 border border-slate-600 dark:border-[#3d3d54] light:border-slate-200 ultra-light:border-slate-300">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 dark:text-[#a9b1d6] light:text-slate-700 ultra-light:text-slate-700 mb-2">
                Category Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="E.g., Bills, Subscriptions, Wants"
                required
                className="w-full bg-slate-600 dark:bg-[#1a1b26] light:bg-white ultra-light:bg-slate-50 border border-slate-500 dark:border-[#3d3d54] light:border-slate-300 ultra-light:border-slate-300 rounded-lg px-4 py-2 text-white dark:text-[#c0caf5] light:text-slate-900 ultra-light:text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 dark:text-[#a9b1d6] light:text-slate-700 ultra-light:text-slate-700 mb-2">
                Color
              </label>
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full h-10 rounded-lg cursor-pointer"
              />
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

      {/* Categories List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.data.map((category) => (
          <div
            key={category.id}
            className="bg-slate-700 dark:bg-[#2d2d44] light:bg-slate-100 ultra-light:bg-white rounded-lg p-4 border border-slate-600 dark:border-[#3d3d54] light:border-slate-200 ultra-light:border-slate-300 flex items-start justify-between group hover:border-blue-400 transition"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-5 h-5 rounded"
                style={{ backgroundColor: category.color }}
              />
              <h3 className="font-semibold text-white dark:text-[#c0caf5] light:text-slate-900 ultra-light:text-slate-900">
                {category.name}
              </h3>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
              <button
                onClick={() => handleEdit(category)}
                className="p-1 hover:bg-slate-600 dark:hover:bg-[#1a1b26] light:hover:bg-white ultra-light:hover:bg-slate-50 rounded transition"
              >
                <Edit2 size={16} className="text-blue-400 dark:text-[#7aa2f7] light:text-blue-600 ultra-light:text-blue-600" />
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                className="p-1 hover:bg-slate-600 dark:hover:bg-[#1a1b26] light:hover:bg-white rounded transition"
              >
                <Trash2 size={16} className="text-red-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {categories.data.length === 0 && !showForm && (
        <div className="bg-slate-700 dark:bg-[#2d2d44] light:bg-slate-100 ultra-light:bg-white rounded-lg p-8 border border-slate-600 dark:border-[#3d3d54] light:border-slate-200 ultra-light:border-slate-300 text-center">
          <p className="text-slate-400 dark:text-[#a9b1d6] light:text-slate-600 ultra-light:text-slate-600 mb-4">
            No categories yet. Create one to get started!
          </p>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setFormData({ name: '', color: '#7aa2f7' });
            }}
            className="inline-flex items-center gap-2 bg-blue-500 dark:bg-[#7aa2f7] light:bg-blue-600 hover:bg-blue-600 dark:hover:bg-[#8ab1f7] light:hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            <Plus size={20} />
            Create Category
          </button>
        </div>
      )}
    </div>
  );
}
