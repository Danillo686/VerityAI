import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, AppMode } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  activeMode: AppMode;
  setActiveMode: (mode: AppMode) => void;
  toggleMode: () => void;
  login: (data: { email: string; password: string }) => Promise<void>;
  register: (data: { name: string; email: string; password: string; plan?: string; default_mode?: AppMode }) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('verity_token'));
  const [activeMode, setActiveMode] = useState<AppMode>('empresa');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('verity_token');
      const storedUser = localStorage.getItem('verity_user');

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setActiveMode(parsedUser.default_mode || 'empresa');
          // Optionally verify with server
          api.getMe()
            .then((freshUser) => {
              setUser(freshUser);
              localStorage.setItem('verity_user', JSON.stringify(freshUser));
            })
            .catch(() => {
              // Ignore if server unreachable, keep local session
            });
        } catch (e) {
          localStorage.removeItem('verity_token');
          localStorage.removeItem('verity_user');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const resp = await api.login(data);
      setToken(resp.token);
      setUser(resp.user);
      setActiveMode(resp.user.default_mode || 'empresa');
      localStorage.setItem('verity_token', resp.token);
      localStorage.setItem('verity_user', JSON.stringify(resp.user));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: { name: string; email: string; password: string; plan?: string; default_mode?: AppMode }) => {
    setIsLoading(true);
    try {
      const resp = await api.register(data);
      setToken(resp.token);
      setUser(resp.user);
      setActiveMode(resp.user.default_mode || data.default_mode || 'empresa');
      localStorage.setItem('verity_token', resp.token);
      localStorage.setItem('verity_user', JSON.stringify(resp.user));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('verity_token');
    localStorage.removeItem('verity_user');
  };

  const toggleMode = () => {
    setActiveMode((prev) => (prev === 'empresa' ? 'normal' : 'empresa'));
  };

  const updateUser = async (data: Partial<User>) => {
    const updated = await api.updateMe(data);
    setUser(updated);
    if (updated.default_mode) {
      setActiveMode(updated.default_mode);
    }
    localStorage.setItem('verity_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        activeMode,
        setActiveMode,
        toggleMode,
        login,
        register,
        logout,
        updateUser,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
};
