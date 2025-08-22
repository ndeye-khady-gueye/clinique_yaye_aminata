import axios from 'axios';

// Configuration axios pour l'API
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré, rediriger vers la page de connexion
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface SystemMetrics {
  users: {
    total: number;
    active: number;
    inactive: number;
    by_role: { role: string; count: number }[];
    growth: { date: string; count: number }[];
  };
  patients: {
    total: number;
  };
  appointments: {
    total: number;
    today: number;
  };
  performance: {
    response_time: number;
    uptime: number;
    errors: number;
    daily_requests: { date: string; requests: number }[];
  };
  system: {
    cpu_usage: number;
    memory_usage: number;
    memory_total: number;
    memory_available: number;
    disk_usage: number;
    disk_total: number;
    disk_free: number;
    database_size: number;
  };
  security: {
    failed_logins: number;
    blocked_ips: number;
    security_events: { type: string; count: number }[];
  };
}

export interface SystemConfig {
  database: {
    type: string;
    host: string;
    port: number;
    name: string;
    status: string;
  };
  security: {
    jwt_expiry: number;
    password_min_length: number;
    enable_two_factor: boolean;
    session_timeout: number;
  };
  performance: {
    cache_enabled: boolean;
    cache_size: number;
    max_connections: number;
    debug_mode: boolean;
  };
  maintenance: {
    auto_backup: boolean;
    backup_frequency: string;
    last_backup: string;
    maintenance_mode: boolean;
  };
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'responsable_cabinet' | 'doctor' | 'receptionist' | 'patient';
  phone?: string;
  is_active: boolean;
  date_joined: string;
  last_login?: string;
  avatar?: string;
}

export interface UserCreateData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  phone?: string;
  password: string;
  password_confirm: string;
}

export interface UserUpdateData {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  role?: string;
  is_active?: boolean;
}

class AdminApiService {
  // Métriques système
  async getSystemMetrics(): Promise<SystemMetrics> {
    const response = await api.get('/admin/system_metrics/');
    return response.data;
  }

  // Configuration système
  async getSystemConfig(): Promise<SystemConfig> {
    const response = await api.get('/admin/system_config/');
    return response.data;
  }

  async updateSystemConfig(config: Partial<SystemConfig>): Promise<{ success: boolean; message: string }> {
    const response = await api.post('/admin/update_system_config/', config);
    return response.data;
  }

  async testDatabaseConnection(): Promise<{ success: boolean; message: string }> {
    const response = await api.post('/admin/test_database_connection/');
    return response.data;
  }

  // Gestion des utilisateurs
  async getAllUsers(): Promise<User[]> {
    let allUsers: User[] = [];
    let page = 1;
    let hasNextPage = true;

    while (hasNextPage) {
      const response = await api.get(`/users/?page=${page}`);
      const data = response.data;
      
      if (data.results) {
        // Pagination activée
        allUsers = [...allUsers, ...data.results];
        hasNextPage = !!data.next; // data.next contient l'URL de la page suivante
        page++;
      } else {
        // Pas de pagination
        allUsers = data;
        hasNextPage = false;
      }
    }

    return allUsers;
  }

  async getUserById(id: number): Promise<User> {
    const response = await api.get(`/users/${id}/`);
    return response.data;
  }

  async createUser(userData: UserCreateData): Promise<User> {
    const response = await api.post('/users/', userData);
    return response.data;
  }

  async updateUser(id: number, userData: UserUpdateData): Promise<User> {
    const response = await api.patch(`/users/${id}/`, userData);
    return response.data;
  }

  async deleteUser(id: number): Promise<void> {
    await api.delete(`/users/${id}/`);
  }

  async toggleUserStatus(id: number): Promise<User> {
    const user = await this.getUserById(id);
    return this.updateUser(id, { is_active: !user.is_active });
  }

  // Statistiques utilisateurs
  async getUserStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    byRole: { role: string; count: number }[];
  }> {
    const users = await this.getAllUsers();
    const total = users.length;
    const active = users.filter(u => u.is_active).length;
    const inactive = total - active;
    
    const roleCounts = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const byRole = Object.entries(roleCounts).map(([role, count]) => ({
      role,
      count
    }));

    return { total, active, inactive, byRole };
  }

  // Export de rapports
  async exportReport(format: 'pdf' | 'excel' | 'csv'): Promise<Blob> {
    const response = await api.get(`/admin/export_report/?format=${format}`, {
      responseType: 'blob'
    });
    return response.data;
  }
}

export const adminApi = new AdminApiService();
