import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiService, { User, RegisterRequest } from '@/services/api';

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

  // Charger l'utilisateur depuis le localStorage au démarrage
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    console.log('AuthContext - Token:', token ? 'Present' : 'Absent');
    console.log('AuthContext - UserData:', userData ? 'Present' : 'Absent');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        console.log('AuthContext - User loaded:', parsedUser);
        
        // Vérifier si le token est encore valide en testant l'API
        apiService.getCurrentUser().then(() => {
          console.log('AuthContext - Token valide, utilisateur connecté');
        }).catch((error) => {
          console.log('AuthContext - Token expiré, déconnexion automatique:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('userData');
          setUser(null);
        });
      } catch (error) {
        console.error('AuthContext - Erreur lors du chargement des données utilisateur:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
      }
    } else {
      console.log('AuthContext - Aucun token ou données utilisateur trouvés');
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
      // Même en cas d'erreur, on nettoie l'état local
    } finally {
      // Nettoyer l'état local dans tous les cas
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
