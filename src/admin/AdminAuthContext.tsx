import React, { createContext, useContext, useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { api, type AdminUser } from '../services/api';

interface AdminAuthContextType {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const STORAGE_KEY = 'roha_admin_auth_user';
const TOKEN_KEY = 'roha_admin_auth_token';

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
      const savedToken = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);

      // Purge legacy mock token fallback so genuine admin authentication is enforced
      if (savedToken === 'roha_studio_session_token') {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(TOKEN_KEY);
        setUser(null);
        setToken(null);
      } else if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } else {
        setUser(null);
        setToken(null);
      }
    } catch (e) {
      console.error('Failed to parse saved admin session', e);
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (username: string, password: string, rememberMe: boolean = true) => {
    const res = await api.adminLogin(username, password);
    setUser(res.user);
    setToken(res.token);

    if (rememberMe) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(res.user));
      localStorage.setItem(TOKEN_KEY, res.token);
      sessionStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
    } else {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(res.user));
      sessionStorage.setItem(TOKEN_KEY, res.token);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-[#091113] flex flex-col items-center justify-center text-slate-400 font-mono text-xs select-none">
        <div className="relative mb-5">
          <div className="w-12 h-12 border-2 border-cyan-500/20 rounded-full" />
          <div className="w-12 h-12 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin absolute inset-0" />
        </div>
        <span className="tracking-[0.25em] uppercase text-cyan-300 font-semibold text-[11px]">
          Authenticating Studio Session...
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
