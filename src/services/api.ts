import { API_BASE_URL } from '@/config/environment';

// Types pour l'API
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  password: string;
  password_confirm: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  tokens: {
    access: string;
    refresh: string;
  };
  user: User;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  tokens: {
    access: string;
    refresh: string;
  };
  user: User;
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;  // Frontend utilise camelCase
  lastName: string;   // Frontend utilise camelCase
  role: UserRole;
  phone?: string;
  speciality?: string;
  avatar?: string;
  is_active: boolean;
  created_at: string;
}

export type UserRole = 'admin' | 'responsable_cabinet' | 'doctor' | 'receptionist' | 'patient';

// Classe pour gérer les appels API
class ApiService {
  private baseURL: string;
  private accessToken: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.accessToken = localStorage.getItem('authToken');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: this.getHeaders(),
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token expiré, essayer de le rafraîchir
          await this.refreshToken();
          // Réessayer la requête
          const retryResponse = await fetch(url, config);
          if (!retryResponse.ok) {
            throw new Error(`HTTP error! status: ${retryResponse.status}`);
          }
          return await retryResponse.json();
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private async refreshToken(): Promise<void> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await fetch(`${this.baseURL}/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        this.accessToken = data.access;
        localStorage.setItem('authToken', data.access);
      } else {
        // Refresh token expiré, déconnexion
        this.logout();
        throw new Error('Refresh token expired');
      }
    } catch (error) {
      this.logout();
      throw error;
    }
  }

  // Authentification
  async login(identifier: string, password: string): Promise<LoginResponse> {
    // Détecter si l'identifiant est un email ou un numéro de téléphone
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(77|76|78|70|75)[0-9]{7}$/;
    
    let payload: any;
    
    if (emailRegex.test(identifier)) {
      // C'est un email
      payload = { identifier: identifier, password };
      console.log('Login payload (email):', payload); // Debug log
    } else if (phoneRegex.test(identifier)) {
      // C'est un numéro de téléphone
      payload = { identifier: identifier, password };
      console.log('Login payload (phone):', payload); // Debug log
    } else {
      // Fallback: envoyer comme identifier (comportement par défaut)
      payload = { identifier: identifier, password };
      console.log('Login payload (fallback):', payload); // Debug log
    }
    
    const response = await this.request<LoginResponse>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (response.success) {
      this.accessToken = response.tokens.access;
      localStorage.setItem('authToken', response.tokens.access);
      localStorage.setItem('refreshToken', response.tokens.refresh);
      localStorage.setItem('userData', JSON.stringify({
        ...response.user,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
      }));
    }

    return response;
  }
  


  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    const response = await this.request<any>('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success) {
      // Adapter les données du backend (snake_case) au frontend (camelCase)
      const adaptedUser: User = {
        ...response.user,
        firstName: response.user.first_name,
        lastName: response.user.last_name,
      };

      const adaptedResponse: RegisterResponse = {
        ...response,
        user: adaptedUser
      };

      this.accessToken = response.tokens.access;
      localStorage.setItem('authToken', response.tokens.access);
      localStorage.setItem('refreshToken', response.tokens.refresh);
      localStorage.setItem('userData', JSON.stringify(adaptedUser));

      return adaptedResponse;
    }

    return response;
  }

  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        await this.request('/auth/logout/', {
          method: 'POST',
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
      } catch (error) {
        console.error('Logout API error:', error);
        // Ne pas re-lancer l'erreur, on continue le nettoyage local
      }
    }

    this.accessToken = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
  }

  async getCurrentUser(): Promise<User> {
    return await this.request<User>('/auth/me/');
  }

  // Utilisateurs
  async getUsers(): Promise<User[]> {
    return await this.request<User[]>('/users/');
  }

  async getDoctors(): Promise<User[]> {
    const response = await this.request<any>('/users/?role=doctor');
    const doctors = response.results || response;
    
    console.log('🔍 Données brutes des médecins depuis API:', doctors);
    
    // Nettoyer et formater les données des médecins
    const formattedDoctors = doctors.map((doctor: any) => {
      // L'API retourne first_name et last_name séparés
      let firstName = doctor.first_name || 'Nom non défini';
      let lastName = doctor.last_name || 'Prénom non défini';
      
      console.log(`🔍 Médecin ID ${doctor.id}:`, {
        first_name: doctor.first_name,
        last_name: doctor.last_name,
        speciality: doctor.speciality
      });
      
      // Nettoyer le first_name s'il contient "Dr."
      if (firstName && firstName.includes('Dr.')) {
        firstName = firstName.replace(/^Dr\.?\s*/i, '').trim();
      }
      
      // Nettoyer le last_name s'il contient "Dr."
      if (lastName && lastName.includes('Dr.')) {
        lastName = lastName.replace(/^Dr\.?\s*/i, '').trim();
      }
      
      const formattedDoctor = {
        ...doctor,
        firstName: firstName,
        lastName: lastName,
        speciality: doctor.speciality || 'Spécialité non définie'
      };
      
      console.log(`✅ Médecin formaté ID ${doctor.id}:`, formattedDoctor);
      
      return formattedDoctor;
    });
    
    // Filtrer les doublons basés sur firstName + lastName
    const uniqueDoctors = formattedDoctors.filter((doctor, index, self) => {
      const nameKey = `${doctor.firstName} ${doctor.lastName}`.toLowerCase();
      const firstIndex = self.findIndex(d => 
        `${d.firstName} ${d.lastName}`.toLowerCase() === nameKey
      );
      return index === firstIndex;
    });
    
    console.log(`🔍 Docteurs après filtrage des doublons: ${uniqueDoctors.length} (sur ${formattedDoctors.length})`);
    
    // Log des doublons supprimés
    const duplicates = formattedDoctors.filter((doctor, index, self) => {
      const nameKey = `${doctor.firstName} ${doctor.lastName}`.toLowerCase();
      const firstIndex = self.findIndex(d => 
        `${d.firstName} ${d.lastName}`.toLowerCase() === nameKey
      );
      return index !== firstIndex;
    });
    
    if (duplicates.length > 0) {
      console.log('⚠️ Doublons supprimés:', duplicates.map(d => `${d.firstName} ${d.lastName} (ID: ${d.id})`));
    }
    
    return uniqueDoctors;
  }

  async createUser(userData: any): Promise<User> {
    return await this.request<User>('/users/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: string, userData: any): Promise<User> {
    return await this.request<User>(`/users/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string): Promise<void> {
    await this.request(`/users/${id}/`, {
      method: 'DELETE',
    });
  }

  // Patients
  async getPatients(): Promise<any[]> {
    const response = await this.request<any>('/patients/');
    return response.results || response;
  }

  async getPatient(id: string): Promise<any> {
    return await this.request<any>(`/patients/${id}/`);
  }

  async createPatient(patientData: any): Promise<any> {
    return await this.request<any>('/patients/', {
      method: 'POST',
      body: JSON.stringify(patientData),
    });
  }

  async updatePatient(id: string, patientData: any): Promise<any> {
    return await this.request<any>(`/patients/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(patientData),
    });
  }

  async deletePatient(id: string): Promise<void> {
    await this.request(`/patients/${id}/`, {
      method: 'DELETE',
    });
  }

  // Services
  async getServices(): Promise<any[]> {
    return await this.request<any[]>('/services/');
  }

  async getActiveServices(): Promise<any[]> {
    return await this.request<any[]>('/services/actifs/');
  }

  // Rendez-vous
  async getRendezVous(): Promise<any[]> {
    const response = await this.request<any>('/rendez-vous/');
    // Gérer la pagination Django qui retourne {results: [...]}
    if (response && typeof response === 'object' && 'results' in response) {
      return response.results;
    }
    // Si c'est déjà un tableau, le retourner tel quel
    if (Array.isArray(response)) {
      return response;
    }
    // Sinon, retourner un tableau vide
    return [];
  }

  async getRendezVousAujourdHui(): Promise<any[]> {
    const response = await this.request<any>('/rendez-vous/aujourd_hui/');
    if (response && typeof response === 'object' && 'results' in response) {
      return response.results;
    }
    if (Array.isArray(response)) {
      return response;
    }
    return [];
  }

  async getRendezVousCetteSemaine(): Promise<any[]> {
    const response = await this.request<any>('/rendez-vous/cette_semaine/');
    if (response && typeof response === 'object' && 'results' in response) {
      return response.results;
    }
    if (Array.isArray(response)) {
      return response;
    }
    return [];
  }

  async createRendezVous(rdvData: any): Promise<any> {
    return await this.request<any>('/rendez-vous/', {
      method: 'POST',
      body: JSON.stringify(rdvData),
    });
  }

  async updateRendezVous(id: string, rdvData: any): Promise<any> {
    return await this.request<any>(`/rendez-vous/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(rdvData),
    });
  }

  async confirmerRendezVous(id: string): Promise<any> {
    return await this.request<any>(`/rendez-vous/${id}/confirmer/`, {
      method: 'POST',
    });
  }

  async annulerRendezVous(id: string): Promise<any> {
    return await this.request<any>(`/rendez-vous/${id}/annuler/`, {
      method: 'POST',
    });
  }

  // Consultations
  async getConsultations(): Promise<any[]> {
    return await this.request<any[]>('/consultations/');
  }

  async createConsultation(consultationData: any): Promise<any> {
    return await this.request<any>('/consultations/', {
      method: 'POST',
      body: JSON.stringify(consultationData),
    });
  }

  // Prescriptions
  async getPrescriptions(): Promise<any[]> {
    return await this.request<any[]>('/prescriptions/');
  }

  async createPrescription(prescriptionData: any): Promise<any> {
    return await this.request<any>('/prescriptions/', {
      method: 'POST',
      body: JSON.stringify(prescriptionData),
    });
  }

  // Paiements
  async getPaiements(): Promise<any[]> {
    return await this.request<any[]>('/paiements/');
  }

  async createPaiement(paiementData: any): Promise<any> {
    return await this.request<any>('/paiements/', {
      method: 'POST',
      body: JSON.stringify(paiementData),
    });
  }

  // Dossiers médicaux
  async getDossiersMedicaux(): Promise<any[]> {
    return await this.request<any[]>('/dossiers-medicaux/');
  }

  async getDossierMedical(id: string): Promise<any> {
    return await this.request<any>(`/dossiers-medicaux/${id}/`);
  }

  // Statistiques
  async getStatistiques(): Promise<any> {
    return await this.request<any>('/statistiques/dashboard/');
  }

  // Récupérer le profil patient
  async getPatientProfile(): Promise<any> {
    return await this.request<any>('/patients/profile/');
  }

  // Mettre à jour le profil patient
  async updatePatientProfile(profileData: any): Promise<any> {
    return await this.request<any>('/patients/update_profile/', {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    });
  }

  // Changer le mot de passe
  async changePassword(passwordData: { current_password: string; new_password: string }): Promise<any> {
    return await this.request<any>('/auth/change-password/', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });
  }
}

// Instance singleton
const apiService = new ApiService(API_BASE_URL);

// API pour les contacts
export const contactApi = {
  createMessage: async (data: {
    nom: string;
    email: string;
    sujet: string;
    message: string;
    date_heure_souhaitee?: string | null;
  }) => {
    const response = await fetch(`${API_BASE_URL}/contacts/create_message/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de l\'envoi du message');
    }
    
    return response.json();
  },

  getMessages: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/contacts/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des messages');
    }
    
    return response.json();
  },

  getMessageStats: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/contacts/statistiques/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des statistiques');
    }
    
    return response.json();
  },

  markAsRead: async (messageId: number, token: string) => {
    const response = await fetch(`${API_BASE_URL}/contacts/${messageId}/marquer_comme_lu/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors du marquage du message');
    }
    
    return response.json();
  },

  markAsReplied: async (messageId: number, token: string) => {
    const response = await fetch(`${API_BASE_URL}/contacts/${messageId}/marquer_comme_repondu/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors du marquage du message');
    }
    
    return response.json();
  },

  markAsProcessed: async (messageId: number, token: string) => {
    const response = await fetch(`${API_BASE_URL}/contacts/${messageId}/marquer_comme_traite/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors du marquage du message');
    }
    
    return response.json();
  },
};

// Fonction utilitaire pour récupérer le token
const getToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Service pour la gestion des rendez-vous par le responsable
export const rdvResponsableApi = {
  // Récupérer toutes les demandes en attente
  getDemandesEnAttente: async (): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/rdv-responsable/demandes_en_attente/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des demandes');
    }
    
    return response.json();
  },

  // Confirmer un rendez-vous
  confirmerRendezVous: async (data: {
    rendez_vous_id: number;
    docteur_id?: number;
    date_confirmee?: string;
    notes?: string;
    envoyer_notification?: boolean;
  }): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/rdv-responsable/confirmer_rendez_vous/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur lors de la confirmation');
    }
    
    return response.json();
  },

  // Modifier un rendez-vous
  modifierRendezVous: async (data: {
    rendez_vous_id: number;
    date_confirmee: string;
    docteur_id?: number;
    notes?: string;
    raison_modification?: string;
  }): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/rdv-responsable/modifier_rendez_vous/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur lors de la modification');
    }
    
    return response.json();
  },

  // Créer un patient à partir d'un rendez-vous
  creerPatient: async (data: {
    rendez_vous_id: number;
    username: string;
    password: string;
    password_confirm: string;
    date_naissance: string;
    profession?: string;
    situation_matrimoniale?: string;
    nombre_enfants?: number;
    personne_contact?: string;
    telephone_urgence?: string;
    adresse?: string;
    groupe_sanguin?: string;
    allergies?: string;
    antecedents_medicaux?: string;
  }): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/rdv-responsable/creer_patient/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur lors de la création du patient');
    }
    
    return response.json();
  },

  // Récupérer les statistiques
  getStatistiques: async (): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/rdv-responsable/statistiques/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des statistiques');
    }
    
    return response.json();
  },

  // Récupérer tous les rendez-vous
  getAllRendezVous: async (): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/rdv-responsable/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des rendez-vous');
    }
    
    return response.json();
  },

  // Supprimer un rendez-vous
  supprimerRendezVous: async (rdvId: number): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/rdv-responsable/supprimer_rendez_vous/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ rendez_vous_id: rdvId }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur lors de la suppression');
    }
    
    return response.json();
  },
};

export default apiService;

