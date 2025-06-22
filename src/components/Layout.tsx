
import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  LogOut, 
  User, 
  Calendar, 
  Users, 
  Settings,
  Home,
  FileText,
  Phone
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
          { path: '/appointments', icon: Calendar, label: 'Rendez-vous' },
          { path: '/users', icon: Users, label: 'Utilisateurs' },
          { path: '/reports', icon: FileText, label: 'Rapports' }
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

  const navigationItems = getNavigationItems();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-clinic rounded-full flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-primary">CABINET YAYE AMINATA</h1>
              </div>
            </div>

            {/* User info et logout */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900"
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
        <nav className="w-64 bg-white shadow-sm min-h-screen">
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
                          : 'text-gray-700 hover:bg-gray-100'
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
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
