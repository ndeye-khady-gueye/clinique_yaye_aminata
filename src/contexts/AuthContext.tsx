import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService, User, RegisterRequest } from '@/services/api';

export type UserRole = 'admin' | 'responsable_cabinet' | 'doctor' | 'receptionist' | 'patient';

interface AuthContextType {
  user: User | null;
  login: (identifier: string, password: string) => Promise<boolean>; // email OU phone
  register: (userData: RegisterRequest) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger l’utilisateur depuis le localStorage au démarrage
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (identifier: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    console.log('AuthContext login - identifier:', identifier, 'password:', password ? '[HIDDEN]' : 'undefined'); // Debug log
    try {
      const response = await apiService.login(identifier, password);

      if (response.success) {
        setUser(response.user);
        setIsLoading(false);
        return true;
      }
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (userData: RegisterRequest): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await apiService.register(userData);
      if (response.success) {
        setUser(response.user);
        setIsLoading(false);
        return true;
      }
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Register error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
