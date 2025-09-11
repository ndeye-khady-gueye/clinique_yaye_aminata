import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  CheckCircle, 
  AlertTriangle,
  Eye,
  Settings,
  Download,
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  Phone,
  Mail
} from 'lucide-react';

const ResponsiveTestComponent: React.FC = () => {
  const [currentBreakpoint, setCurrentBreakpoint] = useState('mobile');

  // Simuler la détection de breakpoint
  const getCurrentBreakpoint = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 475) return 'mobile';
      if (width < 640) return 'xs';
      if (width < 768) return 'sm';
      if (width < 1024) return 'md';
      if (width < 1280) return 'lg';
      if (width < 1536) return 'xl';
      return '2xl';
    }
    return 'mobile';
  };

  React.useEffect(() => {
    const handleResize = () => {
      setCurrentBreakpoint(getCurrentBreakpoint());
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Appel initial

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const breakpointInfo = {
    mobile: { icon: Smartphone, label: 'Mobile', width: '< 475px', color: 'bg-blue-100 text-blue-800' },
    xs: { icon: Smartphone, label: 'XS', width: '475px+', color: 'bg-green-100 text-green-800' },
    sm: { icon: Tablet, label: 'SM', width: '640px+', color: 'bg-yellow-100 text-yellow-800' },
    md: { icon: Tablet, label: 'MD', width: '768px+', color: 'bg-orange-100 text-orange-800' },
    lg: { icon: Monitor, label: 'LG', width: '1024px+', color: 'bg-purple-100 text-purple-800' },
    xl: { icon: Monitor, label: 'XL', width: '1280px+', color: 'bg-pink-100 text-pink-800' },
    '2xl': { icon: Monitor, label: '2XL', width: '1536px+', color: 'bg-red-100 text-red-800' }
  };

  const currentInfo = breakpointInfo[currentBreakpoint as keyof typeof breakpointInfo];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header avec indicateur de breakpoint */}
        <Card className="card-responsive">
          <CardHeader className="pb-3 xs:pb-4 sm:pb-6">
            <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between space-y-2 xs:space-y-0">
              <div>
                <CardTitle className="text-sm xs:text-base sm:text-lg text-gray-900 dark:text-white">
                  Test de Responsivité
                </CardTitle>
                <CardDescription className="text-xs xs:text-sm text-gray-600 dark:text-gray-400">
                  Vérification des breakpoints et des composants responsive
                </CardDescription>
              </div>
              <Badge className={`${currentInfo.color} text-xs xs:text-sm px-2 py-1`}>
                <currentInfo.icon className="h-3 w-3 xs:h-4 xs:w-4 mr-1" />
                {currentInfo.label} - {currentInfo.width}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Grille de test responsive */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 xs:gap-4">
          {Array.from({ length: 12 }, (_, i) => (
            <Card key={i} className="card-responsive-compact">
              <CardContent className="p-3 xs:p-4">
                <div className="text-center">
                  <div className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 bg-gradient-clinic rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white text-xs xs:text-sm font-bold">{i + 1}</span>
                  </div>
                  <h3 className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">
                    Card {i + 1}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Responsive
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Test des boutons responsive */}
        <Card className="card-responsive">
          <CardHeader className="pb-3 xs:pb-4 sm:pb-6">
            <CardTitle className="text-sm xs:text-base sm:text-lg text-gray-900 dark:text-white">
              Boutons Responsive
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 xs:gap-4">
              <Button className="btn-responsive w-full xs:w-auto">
                <Eye className="h-3 w-3 xs:h-4 xs:w-4 mr-1 xs:mr-2" />
                <span className="hidden xs:inline">Voir détails</span>
                <span className="xs:hidden">Voir</span>
              </Button>
              <Button variant="outline" className="btn-responsive w-full xs:w-auto">
                <Settings className="h-3 w-3 xs:h-4 xs:w-4 mr-1 xs:mr-2" />
                <span className="hidden xs:inline">Paramètres</span>
                <span className="xs:hidden">⚙️</span>
              </Button>
              <Button variant="secondary" className="btn-responsive w-full xs:w-auto">
                <Download className="h-3 w-3 xs:h-4 xs:w-4 mr-1 xs:mr-2" />
                <span className="hidden xs:inline">Télécharger</span>
                <span className="xs:hidden">📥</span>
              </Button>
              <Button variant="destructive" className="btn-responsive w-full xs:w-auto">
                <span className="hidden xs:inline">Supprimer</span>
                <span className="xs:hidden">🗑️</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Test des formulaires responsive */}
        <Card className="card-responsive">
          <CardHeader className="pb-3 xs:pb-4 sm:pb-6">
            <CardTitle className="text-sm xs:text-base sm:text-lg text-gray-900 dark:text-white">
              Formulaires Responsive
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="form-responsive">
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 xs:gap-4">
                <div>
                  <label className="label-responsive block mb-1">Nom</label>
                  <Input 
                    placeholder="Votre nom"
                    className="input-responsive"
                  />
                </div>
                <div>
                  <label className="label-responsive block mb-1">Email</label>
                  <Input 
                    type="email"
                    placeholder="votre@email.com"
                    className="input-responsive"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 xs:gap-4">
                <div>
                  <label className="label-responsive block mb-1">Téléphone</label>
                  <Input 
                    placeholder="77 123 45 67"
                    className="input-responsive"
                  />
                </div>
                <div>
                  <label className="label-responsive block mb-1">Date</label>
                  <Input 
                    type="date"
                    className="input-responsive"
                  />
                </div>
              </div>
              <div>
                <label className="label-responsive block mb-1">Message</label>
                <textarea 
                  placeholder="Votre message..."
                  className="input-responsive min-h-[80px] xs:min-h-[100px]"
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test des tableaux responsive */}
        <Card className="card-responsive">
          <CardHeader className="pb-3 xs:pb-4 sm:pb-6">
            <CardTitle className="text-sm xs:text-base sm:text-lg text-gray-900 dark:text-white">
              Tableau Responsive
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 xs:p-3 sm:p-6">
            <div className="table-responsive">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-3 py-2 text-xs xs:px-4 xs:py-3 xs:text-sm font-medium text-gray-700 dark:text-gray-300">Nom</th>
                    <th className="hidden xs:table-cell px-3 py-2 text-xs xs:px-4 xs:py-3 xs:text-sm font-medium text-gray-700 dark:text-gray-300">Email</th>
                    <th className="px-3 py-2 text-xs xs:px-4 xs:py-3 xs:text-sm font-medium text-gray-700 dark:text-gray-300">Téléphone</th>
                    <th className="hidden sm:table-cell px-3 py-2 text-xs xs:px-4 xs:py-3 xs:text-sm font-medium text-gray-700 dark:text-gray-300">Date</th>
                    <th className="px-3 py-2 text-xs xs:px-4 xs:py-3 xs:text-sm font-medium text-gray-700 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {Array.from({ length: 5 }, (_, i) => (
                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-3 py-2 text-xs xs:px-4 xs:py-3 xs:text-sm text-gray-900 dark:text-white">
                        <div className="font-medium">Utilisateur {i + 1}</div>
                        <div className="xs:hidden text-gray-500 dark:text-gray-400">user{i + 1}@email.com</div>
                      </td>
                      <td className="hidden xs:table-cell px-3 py-2 text-xs xs:px-4 xs:py-3 xs:text-sm text-gray-600 dark:text-gray-400">
                        user{i + 1}@email.com
                      </td>
                      <td className="px-3 py-2 text-xs xs:px-4 xs:py-3 xs:text-sm text-gray-600 dark:text-gray-400">
                        77 123 45 6{i}
                      </td>
                      <td className="hidden sm:table-cell px-3 py-2 text-xs xs:px-4 xs:py-3 xs:text-sm text-gray-600 dark:text-gray-400">
                        2024-01-{String(i + 1).padStart(2, '0')}
                      </td>
                      <td className="px-3 py-2 text-xs xs:px-4 xs:py-3 xs:text-sm">
                        <div className="flex items-center space-x-1 xs:space-x-2">
                          <Button size="sm" variant="outline" className="text-xs px-2 py-1">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs px-2 py-1">
                            <Settings className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Test des icônes responsive */}
        <Card className="card-responsive">
          <CardHeader className="pb-3 xs:pb-4 sm:pb-6">
            <CardTitle className="text-sm xs:text-base sm:text-lg text-gray-900 dark:text-white">
              Icônes Responsive
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 xs:gap-6">
              <div className="text-center">
                <User className="icon-responsive mx-auto mb-2 text-gray-600 dark:text-gray-400" />
                <p className="text-xs text-gray-500 dark:text-gray-400">User</p>
              </div>
              <div className="text-center">
                <Phone className="icon-responsive mx-auto mb-2 text-gray-600 dark:text-gray-400" />
                <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
              </div>
              <div className="text-center">
                <Mail className="icon-responsive mx-auto mb-2 text-gray-600 dark:text-gray-400" />
                <p className="text-xs text-gray-500 dark:text-gray-400">Mail</p>
              </div>
              <div className="text-center">
                <Calendar className="icon-responsive mx-auto mb-2 text-gray-600 dark:text-gray-400" />
                <p className="text-xs text-gray-500 dark:text-gray-400">Calendar</p>
              </div>
              <div className="text-center">
                <Clock className="icon-responsive mx-auto mb-2 text-gray-600 dark:text-gray-400" />
                <p className="text-xs text-gray-500 dark:text-gray-400">Clock</p>
              </div>
              <div className="text-center">
                <Search className="icon-responsive mx-auto mb-2 text-gray-600 dark:text-gray-400" />
                <p className="text-xs text-gray-500 dark:text-gray-400">Search</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Indicateur de performance responsive */}
        <Card className="card-responsive">
          <CardHeader className="pb-3 xs:pb-4 sm:pb-6">
            <CardTitle className="text-sm xs:text-base sm:text-lg text-gray-900 dark:text-white">
              Performance Responsive
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4 xs:gap-6">
              <div className="text-center">
                <CheckCircle className="h-8 w-8 xs:h-10 xs:w-10 text-green-500 mx-auto mb-2" />
                <h3 className="text-sm xs:text-base font-medium text-gray-900 dark:text-white">Mobile First</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Design optimisé mobile</p>
              </div>
              <div className="text-center">
                <CheckCircle className="h-8 w-8 xs:h-10 xs:w-10 text-green-500 mx-auto mb-2" />
                <h3 className="text-sm xs:text-base font-medium text-gray-900 dark:text-white">Flexible</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">S'adapte à tous les écrans</p>
              </div>
              <div className="text-center">
                <CheckCircle className="h-8 w-8 xs:h-10 xs:w-10 text-green-500 mx-auto mb-2" />
                <h3 className="text-sm xs:text-base font-medium text-gray-900 dark:text-white">Accessible</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Facile à utiliser</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResponsiveTestComponent;

