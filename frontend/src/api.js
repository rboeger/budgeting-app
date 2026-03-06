const API_BASE = import.meta.env.DEV ? 'http://localhost:5000/api' : '/api';

// Get auth token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

export const api = {
  // Authentication
  register: async (username, email, password) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    return res.json();
  },
  login: async (username, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return res.json();
  },
  getCurrentUser: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Categories
  getCategories: async () => {
    const res = await fetch(`${API_BASE}/categories`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },
  createCategory: async (name, color) => {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name, color }),
    });
    return res.json();
  },
  updateCategory: async (id, name, color) => {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name, color }),
    });
    return res.json();
  },
  deleteCategory: async (id) => {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Expenses
  getExpenses: async () => {
    const res = await fetch(`${API_BASE}/expenses`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },
  getExpensesByCategory: async (categoryId) => {
    const res = await fetch(`${API_BASE}/expenses/category/${categoryId}`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },
  createExpense: async (categoryId, name, amount, frequency) => {
    const res = await fetch(`${API_BASE}/expenses`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ categoryId, name, amount, frequency }),
    });
    return res.json();
  },
  updateExpense: async (id, categoryId, name, amount, frequency) => {
    const res = await fetch(`${API_BASE}/expenses/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ categoryId, name, amount, frequency }),
    });
    return res.json();
  },
  deleteExpense: async (id) => {
    const res = await fetch(`${API_BASE}/expenses/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Paychecks
  getPaychecks: async () => {
    const res = await fetch(`${API_BASE}/paychecks`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },
  createPaycheck: async (amount, frequency) => {
    const res = await fetch(`${API_BASE}/paychecks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ amount, frequency }),
    });
    return res.json();
  },
  deletePaycheck: async (id) => {
    const res = await fetch(`${API_BASE}/paychecks/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Credit Cards
  getCreditCards: async () => {
    const res = await fetch(`${API_BASE}/credit-cards`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },
  createCreditCard: async (name, balance, interestRate, payoffDate) => {
    const res = await fetch(`${API_BASE}/credit-cards`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name, balance, interestRate, payoffDate }),
    });
    return res.json();
  },
  updateCreditCard: async (id, name, balance, interestRate, payoffDate) => {
    const res = await fetch(`${API_BASE}/credit-cards/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name, balance, interestRate, payoffDate }),
    });
    return res.json();
  },
  deleteCreditCard: async (id) => {
    const res = await fetch(`${API_BASE}/credit-cards/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.json();
  },
};
