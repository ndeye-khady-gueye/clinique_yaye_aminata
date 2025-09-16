
import React, { useState } from 'react';
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
  Building,
  Menu,
  X
} from 'lucide-react';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
          { path: '/user-management', icon: Users, label: 'Gestion utilisateurs' },
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
          { path: '/my-appointments', icon: Calendar, label: 'Mes rendez-vous' }
        ];
      case 'receptionist':
        return [
          ...baseItems,
          { path: '/patients', icon: Users, label: 'Patients' }
        ];
      case 'patient':
        return [
          { path: '/patient-dashboard', icon: Heart, label: 'Mon tableau de bord' },
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
      {/* Header - Responsive avec menu mobile */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo - Responsive */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center overflow-hidden">
                <img
                  src="/lovable-uploads/Logo_page-0001.jpg"
                  alt="Logo Clinique"
                  className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-sm sm:text-base lg:text-lg font-bold text-primary dark:text-white">
                  CABINET YAYE AMINATA
                </h1>
              </div>
              {/* Logo mobile compact */}
              <div className="sm:hidden">
                <h1 className="text-xs font-bold text-primary dark:text-white">
                  CYA
                </h1>
              </div>
            </div>

            {/* User info et actions - Responsive */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <ThemeToggle />
              
              {/* User info - Masqué sur mobile très petit */}
              <div className="hidden xs:block text-right">
                <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate max-w-24 sm:max-w-none">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-24 sm:max-w-none">
                  {getRoleLabel(user?.role || '')}
                </p>
              </div>
              
              {/* Bouton déconnexion - Responsive */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white text-xs sm:text-sm"
              >
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Déconnexion</span>
              </Button>

              {/* Menu mobile */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar - Responsive avec overlay mobile */}
        <nav className={`
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-white dark:bg-gray-800 shadow-lg lg:shadow-sm
          transition-transform duration-300 ease-in-out
          lg:min-h-screen
        `}>
          {/* Overlay mobile */}
          {isMobileMenuOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
              onClick={toggleMobileMenu}
            />
          )}
          
          <div className="p-4 h-full overflow-y-auto">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <button
                      onClick={() => {
                        navigate(item.path);
                        setIsMobileMenuOpen(false); // Fermer le menu mobile après navigation
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors ${
                        isActive
                          ? 'bg-gradient-clinic text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Main content - Responsive avec padding adaptatif */}
        <main className="flex-1 p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
