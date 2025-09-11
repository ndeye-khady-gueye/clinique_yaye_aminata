import React, { useState } from 'react';
import ResponsiveDataTable from './ui/ResponsiveDataTable';
import ResponsiveForm from './ui/ResponsiveForm';
import ResponsiveModal from './ui/ResponsiveModal';
import ResponsiveMobileNavigation from './ui/ResponsiveMobileNavigation';
import ResponsivePagination from './ui/ResponsivePagination';
import ResponsiveFilter from './ui/ResponsiveFilter';
import ResponsiveNotification from './ui/ResponsiveNotification';
import ResponsiveCard from './ui/ResponsiveCard';
import ResponsiveButton from './ui/ResponsiveButton';
import ResponsiveGrid from './ui/ResponsiveGrid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  CheckCircle, 
  AlertCircle,
  Users,
  Calendar,
  FileText,
  Settings
} from 'lucide-react';

const ResponsiveTestPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Test de notification',
      message: 'Ceci est un test de notification responsive',
      type: 'success' as const,
      timestamp: new Date(),
      read: false
    }
  ]);

  // Données de test pour la table
  const tableData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Inactive' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Moderator', status: 'Active' },
  ];

  const tableColumns = [
    { key: 'name', title: 'Nom', sortable: true },
    { key: 'email', title: 'Email', sortable: true },
    { key: 'role', title: 'Rôle', sortable: true },
    { key: 'status', title: 'Statut', sortable: true, render: (value: string) => (
      <Badge variant={value === 'Active' ? 'default' : 'secondary'}>
        {value}
      </Badge>
    ) }
  ];

  // Champs de test pour le formulaire
  const formFields = [
    { name: 'firstName', label: 'Prénom', type: 'text' as const, required: true },
    { name: 'lastName', label: 'Nom', type: 'text' as const, required: true },
    { name: 'email', label: 'Email', type: 'email' as const, required: true },
    { name: 'role', label: 'Rôle', type: 'select' as const, options: [
      { value: 'admin', label: 'Administrateur' },
      { value: 'user', label: 'Utilisateur' },
      { value: 'moderator', label: 'Modérateur' }
    ]},
    { name: 'newsletter', label: 'Recevoir la newsletter', type: 'checkbox' as const },
    { name: 'description', label: 'Description', type: 'textarea' as const }
  ];

  // Champs de test pour les filtres
  const filterFields = [
    { key: 'search', label: 'Recherche', type: 'text' as const, placeholder: 'Rechercher...' },
    { key: 'role', label: 'Rôle', type: 'select' as const, options: [
      { value: 'admin', label: 'Administrateur' },
      { value: 'user', label: 'Utilisateur' },
      { value: 'moderator', label: 'Modérateur' }
    ]},
    { key: 'status', label: 'Statut', type: 'radio' as const, options: [
      { value: 'active', label: 'Actif' },
      { value: 'inactive', label: 'Inactif' }
    ]},
    { key: 'date', label: 'Date', type: 'date' as const }
  ];

  // Éléments de navigation de test
  const navigationItems = [
    { id: 'home', label: 'Accueil', icon: <Users className="h-4 w-4" />, href: '/' },
    { id: 'calendar', label: 'Calendrier', icon: <Calendar className="h-4 w-4" />, href: '/calendar' },
    { id: 'documents', label: 'Documents', icon: <FileText className="h-4 w-4" />, href: '/documents' },
    { id: 'settings', label: 'Paramètres', icon: <Settings className="h-4 w-4" />, href: '/settings' }
  ];

  const handleFormSubmit = (data: Record<string, any>) => {
    console.log('Form submitted:', data);
    setNotifications(prev => [...prev, {
      id: Date.now().toString(),
      title: 'Formulaire soumis',
      message: 'Les données ont été enregistrées avec succès',
      type: 'success',
      timestamp: new Date(),
      read: false
    }]);
  };

  const handleFilter = (filters: Record<string, any>) => {
    console.log('Filters applied:', filters);
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const handleRemoveNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header de test */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Test de Responsivité
              </h1>
              <Badge variant="outline" className="hidden sm:inline-flex">
                <CheckCircle className="h-3 w-3 mr-1" />
                Responsive
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="hidden sm:flex items-center space-x-1 text-sm text-gray-500">
                <Smartphone className="h-4 w-4" />
                <span>Mobile</span>
              </div>
              <div className="hidden md:flex items-center space-x-1 text-sm text-gray-500">
                <Tablet className="h-4 w-4" />
                <span>Tablet</span>
              </div>
              <div className="hidden lg:flex items-center space-x-1 text-sm text-gray-500">
                <Monitor className="h-4 w-4" />
                <span>Desktop</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Test de grille responsive */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Test de Grille Responsive
            </h2>
            <ResponsiveGrid
              items={[
                { id: '1', title: 'Card 1', content: 'Contenu de la première carte' },
                { id: '2', title: 'Card 2', content: 'Contenu de la deuxième carte' },
                { id: '3', title: 'Card 3', content: 'Contenu de la troisième carte' },
                { id: '4', title: 'Card 4', content: 'Contenu de la quatrième carte' },
                { id: '5', title: 'Card 5', content: 'Contenu de la cinquième carte' },
                { id: '6', title: 'Card 6', content: 'Contenu de la sixième carte' }
              ]}
              renderItem={(item) => (
                <ResponsiveCard key={item.id} className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400">{item.content}</p>
                  </CardContent>
                </ResponsiveCard>
              )}
            />
          </section>

          {/* Test de boutons responsive */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Test de Boutons Responsive
            </h2>
            <div className="flex flex-wrap gap-4">
              <ResponsiveButton variant="default" size="sm">
                Petit
              </ResponsiveButton>
              <ResponsiveButton variant="outline" size="md">
                Moyen
              </ResponsiveButton>
              <ResponsiveButton variant="destructive" size="lg">
                Grand
              </ResponsiveButton>
              <ResponsiveButton variant="ghost" size="sm" fullWidth>
                Pleine largeur
              </ResponsiveButton>
            </div>
          </section>

          {/* Test de formulaire responsive */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Test de Formulaire Responsive
            </h2>
            <ResponsiveForm
              title="Formulaire de Test"
              description="Testez la responsivité du formulaire"
              fields={formFields}
              onSubmit={handleFormSubmit}
              gridCols={2}
            />
          </section>

          {/* Test de table responsive */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Test de Table Responsive
            </h2>
            <ResponsiveDataTable
              data={tableData}
              columns={tableColumns}
              title="Tableau de Test"
              searchable
              sortable
              pagination
              pageSize={2}
            />
          </section>

          {/* Test de filtres responsive */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Test de Filtres Responsive
            </h2>
            <ResponsiveFilter
              title="Filtres de Test"
              fields={filterFields}
              onFilter={handleFilter}
              collapsible
            />
          </section>

          {/* Test de pagination responsive */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Test de Pagination Responsive
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <ResponsivePagination
                currentPage={currentPage}
                totalPages={10}
                totalItems={100}
                itemsPerPage={10}
                onPageChange={setCurrentPage}
                showItemsPerPage
                showInfo
                showFirstLast
              />
            </div>
          </section>

          {/* Test de modal responsive */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Test de Modal Responsive
            </h2>
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => setIsModalOpen(true)}>
                Ouvrir Modal
              </Button>
            </div>
            <ResponsiveModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="Modal de Test"
              description="Testez la responsivité de la modal"
              size="lg"
            >
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  Ceci est le contenu de la modal. Elle s'adapte automatiquement à la taille de l'écran.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
                    <h3 className="font-medium">Colonne 1</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Contenu de la première colonne
                    </p>
                  </div>
                  <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
                    <h3 className="font-medium">Colonne 2</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Contenu de la deuxième colonne
                    </p>
                  </div>
                </div>
              </div>
            </ResponsiveModal>
          </section>

          {/* Test de navigation mobile */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Test de Navigation Mobile
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <ResponsiveMobileNavigation
                items={navigationItems}
                user={{
                  name: 'John Doe',
                  email: 'john@example.com',
                  role: 'Administrateur'
                }}
                notifications={3}
                title="Menu Principal"
              />
            </div>
          </section>
        </div>
      </div>

      {/* Notifications de test */}
      <ResponsiveNotification
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onRemove={handleRemoveNotification}
        onMarkAllAsRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
        onRemoveAll={() => setNotifications([])}
        showBadge
        showSettings
        position="top-right"
        autoClose
        autoCloseDelay={3000}
      />
    </div>
  );
};

export default ResponsiveTestPage;
