
import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import { 
  Heart, 
  LogOut, 
  User, 
  Calendar, 
  Users, 
  Settings,
  Home,
  FileText,
  Phone,
  Shield,
  Building
} from 'lucide-react';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getNavigationItems = () => {
    if (!user) return [];

    const baseItems = [
      { path: '/dashboard', icon: Home, label: 'Tableau de bord' }
    ];

    switch (user.role) {
      case 'admin':
        return [
          ...baseItems,
          { path: '/system-config', icon: Settings, label: 'Configuration système' },
          { path: '/all-users', icon: Shield, label: 'Tous les utilisateurs' },
          { path: '/system-reports', icon: FileText, label: 'Rapports système' }
        ];
      case 'responsable_cabinet':
        return [
          ...baseItems,
          { path: '/appointments', icon: Calendar, label: 'Rendez-vous' },
          { path: '/users', icon: Users, label: 'Gestion équipe' },
          { path: '/reports', icon: FileText, label: 'Rapports clinique' },
          { path: '/cabinet-settings', icon: Building, label: 'Paramètres cabinet' }
        ];
      case 'doctor':
        return [
          ...baseItems,
          { path: '/my-appointments', icon: Calendar, label: 'Mes rendez-vous' },
          { path: '/patients', icon: Users, label: 'Mes patients' }
        ];
      case 'receptionist':
        return [
          ...baseItems,
          { path: '/appointments', icon: Calendar, label: 'Rendez-vous' },
          { path: '/patients', icon: Users, label: 'Patients' }
        ];
      case 'patient':
        return [
          ...baseItems,
          { path: '/my-appointments', icon: Calendar, label: 'Mes rendez-vous' },
          { path: '/profile', icon: User, label: 'Mon profil' }
        ];
      default:
        return baseItems;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrateur Système';
      case 'responsable_cabinet': return 'Responsable Cabinet';
      case 'doctor': return 'Docteur';
      case 'receptionist': return 'Réceptionniste';
      case 'patient': return 'Patient';
      default: return role;
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            
            <div className="flex items-center space-x-3">
            <div className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden">
            <img
              src="/lovable-uploads/Logo_page-0001.jpg"
              alt="Logo Clinique"
              className="w-12 h-12 object-contain"
            />
          </div>
              <div>
                <h1 className="text-lg font-bold text-primary dark:text-white">CABINET YAYE AMINATA</h1>
              </div>
            </div>

            {/* User info et actions */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{getRoleLabel(user?.role || '')}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white dark:bg-gray-800 shadow-sm min-h-screen">
          <div className="p-4">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <button
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors ${
                        isActive
                          ? 'bg-gradient-clinic text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
