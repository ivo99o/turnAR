import { useState } from 'react';
import { AuthContext } from './auth_context.js';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const t = localStorage.getItem('token');
    if (!t) return null;
    try {
      return JSON.parse(atob(t.split('.')[1]));
    } catch {
      return null;
    }
  });

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(JSON.parse(atob(newToken.split('.')[1])));
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}
