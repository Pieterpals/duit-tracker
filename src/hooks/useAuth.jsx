import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

// Hardcoded users — simple auth for personal tracker
const USERS = [
  { id: 'ricky',  name: 'Ricky',  password: '123123' },
  { id: 'andrea', name: 'Andrea', password: '123123' },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('duit_user');
    if (saved) {
      try { return JSON.parse(saved); } catch { return null; }
    }
    return null;
  });

  const login = useCallback((username, password) => {
    const found = USERS.find(
      (u) => u.name.toLowerCase() === username.toLowerCase() && u.password === password
    );
    if (!found) return { success: false, error: 'Username atau password salah' };

    const userData = { id: found.id, name: found.name };
    setUser(userData);
    localStorage.setItem('duit_user', JSON.stringify(userData));
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('duit_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
