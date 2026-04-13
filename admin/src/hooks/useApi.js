import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';

// TODO: Move BASE_URL to a config file or environment variable
const BASE_URL = 'http://localhost:3001/api';

export function useApi() {
  const { token, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(
    async (path, options = {}) => {
      setLoading(true);
      setError(null);

      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      };

      try {
        const response = await fetch(`${BASE_URL}${path}`, { ...options, headers });

        if (response.status === 401) {
          logout();
          throw new Error('Session expired');
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Something went wrong');
        }

        return data;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token, logout],
  );

  return { request, loading, error };
}
