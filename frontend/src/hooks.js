import { useState, useEffect } from 'react';
import { api } from './api';

// Auth hook
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      api.getCurrentUser()
        .then((data) => {
          if (data.error) {
            localStorage.removeItem('auth_token');
            setUser(null);
          } else {
            setUser(data);
          }
        })
        .catch(() => {
          localStorage.removeItem('auth_token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const register = async (username, email, password) => {
    setError(null);
    try {
      const data = await api.register(username, email, password);
      if (data.error) {
        setError(data.error);
        return false;
      }
      localStorage.setItem('auth_token', data.access_token);
      setUser(data.user);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const login = async (username, password) => {
    setError(null);
    try {
      const data = await api.login(username, password);
      if (data.error) {
        setError(data.error);
        return false;
      }
      localStorage.setItem('auth_token', data.access_token);
      setUser(data.user);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  return { user, loading, error, register, login, logout };
};

// Theme hook - now uses context to share state
import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  const { theme, changeTheme } = context;
  return { 
    theme, 
    setTheme: changeTheme,
    isDark: theme === 'dark' 
  };
};

// Fetch data hook
export const useFetch = (fn, dependencies = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = async () => {
    setLoading(true);
    try {
      const result = await fn();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, dependencies);

  return { data, loading, error, refetch };
};
