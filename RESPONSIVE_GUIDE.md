# Guide des Composants Responsive

Ce guide explique comment utiliser les composants responsive créés pour l'application Clinique Yaye Aminata.

## 🎯 Vue d'ensemble

Tous les composants ont été conçus pour être entièrement responsive et s'adapter automatiquement aux différentes tailles d'écran :
- **Mobile** : < 640px (sm)
- **Tablet** : 640px - 1024px (sm à lg)
- **Desktop** : > 1024px (lg+)

## 📱 Breakpoints personnalisés

Nous avons ajouté un breakpoint `xs` à 475px pour une meilleure granularité :

```css
/* Dans tailwind.config.ts */
screens: {
  'xs': '475px',
  'sm': '640px',
  'md': '768px',
  'lg': '1024px',
  'xl': '1280px',
  '2xl': '1536px',
}
```

## 🧩 Classes utilitaires responsive

### Classes de conteneur
```css
.container-responsive { @apply w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8; }
```

### Classes de grille
```css
.grid-responsive { @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6; }
```

### Classes de texte
```css
.text-responsive { @apply text-sm sm:text-base lg:text-lg; }
.text-responsive-lg { @apply text-lg sm:text-xl lg:text-2xl xl:text-3xl; }
.text-responsive-xl { @apply text-xl sm:text-2xl lg:text-3xl xl:text-4xl; }
```

### Classes de boutons
```css
.btn-responsive { @apply px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-base; }
```

## 🎨 Composants principaux

### 1. ResponsiveDataTable

Tableau responsive avec version mobile en cartes et version desktop en tableau.

```tsx
import { ResponsiveDataTable } from '@/components/ui';

const columns = [
  { key: 'name', title: 'Nom', sortable: true },
  { key: 'email', title: 'Email', sortable: true },
  { key: 'status', title: 'Statut', render: (value) => <Badge>{value}</Badge> }
];

<ResponsiveDataTable
  data={data}
  columns={columns}
  title="Utilisateurs"
  searchable
  sortable
  pagination
  pageSize={10}
  onRowClick={(record) => console.log(record)}
/>
```

### 2. ResponsiveForm

Formulaire responsive avec validation et champs adaptatifs.

```tsx
import { ResponsiveForm } from '@/components/ui';

const fields = [
  { name: 'firstName', label: 'Prénom', type: 'text', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'role', label: 'Rôle', type: 'select', options: [
    { value: 'admin', label: 'Administrateur' },
    { value: 'user', label: 'Utilisateur' }
  ]},
  { name: 'newsletter', label: 'Newsletter', type: 'checkbox' }
];

<ResponsiveForm
  title="Créer un utilisateur"
  fields={fields}
  onSubmit={handleSubmit}
  gridCols={2}
/>
```

### 3. ResponsiveModal

Modal responsive avec différentes tailles et options.

```tsx
import { ResponsiveModal } from '@/components/ui';

<ResponsiveModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirmation"
  description="Êtes-vous sûr de vouloir supprimer cet élément ?"
  size="md"
  showFooter
  confirmLabel="Supprimer"
  cancelLabel="Annuler"
  onConfirm={handleDelete}
  variant="destructive"
>
  <p>Contenu de la modal...</p>
</ResponsiveModal>
```

### 4. ResponsiveMobileNavigation

Navigation mobile avec menu hamburger et sous-menus.

```tsx
import { ResponsiveMobileNavigation } from '@/components/ui';

const items = [
  { id: 'home', label: 'Accueil', icon: <Home />, href: '/' },
  { id: 'users', label: 'Utilisateurs', icon: <Users />, href: '/users' },
  { id: 'settings', label: 'Paramètres', icon: <Settings />, href: '/settings' }
];

<ResponsiveMobileNavigation
  items={items}
  user={{ name: 'John Doe', email: 'john@example.com' }}
  onLogout={handleLogout}
  title="Menu Principal"
/>
```

### 5. ResponsivePagination

Pagination responsive avec contrôles adaptatifs.

```tsx
import { ResponsivePagination } from '@/components/ui';

<ResponsivePagination
  currentPage={currentPage}
  totalPages={totalPages}
  totalItems={totalItems}
  itemsPerPage={itemsPerPage}
  onPageChange={setCurrentPage}
  onItemsPerPageChange={setItemsPerPage}
  showItemsPerPage
  showInfo
  showFirstLast
/>
```

### 6. ResponsiveFilter

Filtres responsive avec différents types de champs.

```tsx
import { ResponsiveFilter } from '@/components/ui';

const filterFields = [
  { key: 'search', label: 'Recherche', type: 'text' },
  { key: 'status', label: 'Statut', type: 'select', options: [
    { value: 'active', label: 'Actif' },
    { value: 'inactive', label: 'Inactif' }
  ]},
  { key: 'date', label: 'Date', type: 'date' }
];

<ResponsiveFilter
  title="Filtres"
  fields={filterFields}
  onFilter={handleFilter}
  collapsible
  showActiveFilters
/>
```

### 7. ResponsiveNotification

Système de notifications responsive.

```tsx
import { ResponsiveNotification } from '@/components/ui';

<ResponsiveNotification
  notifications={notifications}
  onMarkAsRead={handleMarkAsRead}
  onRemove={handleRemove}
  position="top-right"
  autoClose
  autoCloseDelay={5000}
  showBadge
/>
```

## 🎯 Composants de cartes spécialisées

### Cartes de métriques
```tsx
import { 
  ResponsiveMetricCard,
  ResponsivePerformanceMetricCard,
  ResponsiveHealthMetricCard 
} from '@/components/ui';

<ResponsiveMetricCard
  title="Utilisateurs actifs"
  value="1,234"
  unit="utilisateurs"
  status="excellent"
  trend={{ value: 12, label: "vs mois dernier", positive: true }}
  icon={<Users className="h-5 w-5" />}
/>
```

### Cartes de contenu
```tsx
import { 
  ResponsiveProfileCard,
  ResponsiveProductCard,
  ResponsiveServiceCard 
} from '@/components/ui';

<ResponsiveProfileCard
  name="Dr. Yaye Aminata"
  title="Médecin généraliste"
  avatar="/avatar.jpg"
  email="yaye@clinique.com"
  phone="+221 77 123 45 67"
  specializations={["Médecine générale", "Pédiatrie"]}
/>
```

## 📐 Grilles et layouts

### ResponsiveGrid
```tsx
import { ResponsiveGrid } from '@/components/ui';

<ResponsiveGrid
  items={data}
  renderItem={(item) => <Card key={item.id}>{item.content}</Card>}
  cols={{ default: 1, sm: 2, lg: 3, xl: 4 }}
  gap={4}
/>
```

### ResponsiveCard
```tsx
import { ResponsiveCard } from '@/components/ui';

<ResponsiveCard
  title="Titre de la carte"
  description="Description de la carte"
  size="md"
  hover
  className="custom-class"
>
  <p>Contenu de la carte</p>
</ResponsiveCard>
```

## 🎨 Personnalisation

### Classes CSS personnalisées
Toutes les classes utilitaires responsive sont définies dans `src/index.css` :

```css
/* Utilisation dans vos composants */
<div className="container-responsive">
  <h1 className="text-responsive-xl">Titre responsive</h1>
  <div className="grid-responsive">
    {/* Contenu de la grille */}
  </div>
</div>
```

### Thème et couleurs
Les composants respectent le thème violet/rose de l'application :
- Couleur primaire : Violet (#8B5CF6)
- Couleur secondaire : Rose (#EC4899)
- Mode sombre supporté

## 🧪 Test de responsivité

Utilisez le composant `ResponsiveTestPage` pour tester tous les composants :

```tsx
import ResponsiveTestPage from '@/components/ResponsiveTestPage';

// Dans votre route de test
<ResponsiveTestPage />
```

## 📱 Bonnes pratiques

1. **Mobile First** : Concevez d'abord pour mobile, puis adaptez pour les écrans plus grands
2. **Touch Friendly** : Assurez-vous que les boutons et liens sont assez grands pour le tactile (min 44px)
3. **Performance** : Utilisez `lazy loading` pour les images et composants lourds
4. **Accessibilité** : Respectez les standards WCAG pour l'accessibilité
5. **Test** : Testez sur de vrais appareils, pas seulement dans les outils de développement

## 🔧 Dépannage

### Problèmes courants

1. **Composant ne s'affiche pas** : Vérifiez les imports et les dépendances
2. **Styles cassés** : Assurez-vous que Tailwind CSS est correctement configuré
3. **Responsive ne fonctionne pas** : Vérifiez que les classes Tailwind sont appliquées

### Debug
```tsx
// Ajoutez des classes de debug pour voir les breakpoints
<div className="bg-red-500 sm:bg-green-500 md:bg-blue-500 lg:bg-yellow-500">
  Test de breakpoints
</div>
```

## 📚 Ressources

- [Documentation Tailwind CSS](https://tailwindcss.com/docs/responsive-design)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [React Responsive Hooks](https://github.com/contra/react-responsive)

---

*Ce guide est maintenu à jour avec les dernières versions des composants. Pour toute question, consultez la documentation du code source.*
