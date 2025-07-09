
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'admin' | 'responsable_cabinet' | 'doctor' | 'receptionist' | 'patient';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  speciality?: string; // Pour les docteurs
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
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

  // Simuler la vérification du token au chargement
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulation d'API - À remplacer par l'intégration Django
    const mockUsers: User[] = [
      {
        id: '1',
        email: 'admin@dev.clinique.sn',
        firstName: 'Super',
        lastName: 'Admin',
        role: 'admin'
      },
      {
        id: '2',
        email: 'responsable@clinique.sn',
        firstName: 'Mme Fatou',
        lastName: 'Seck',
        role: 'responsable_cabinet'
      },
      {
        id: '3',
        email: 'dr.diop@clinique.sn',
        firstName: 'Dr. Fatou',
        lastName: 'Diop',
        role: 'doctor',
        speciality: 'Cardiologie'
      },
      {
        id: '4',
        email: 'reception@clinique.sn',
        firstName: 'Aïssatou',
        lastName: 'Fall',
        role: 'receptionist'
      },
      {
        id: '5',
        email: 'patient@example.com',
        firstName: 'Mamadou',
        lastName: 'Ba',
        role: 'patient',
        phone: '+221 77 123 45 67'
      }
    ];

    // Simulation d'authentification
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === '123456') {
      const token = 'mock-jwt-token-' + foundUser.id;
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(foundUser));
      setUser(foundUser);
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
