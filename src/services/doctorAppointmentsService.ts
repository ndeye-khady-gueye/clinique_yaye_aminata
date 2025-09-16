import apiService from './api';

import { API_BASE_URL } from '@/config/environment';

// Types pour les rendez-vous
export interface Appointment {
  id: number;
  patient?: {
    id: number;
    user: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      phone?: string;
    };
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
  };
  client_nom?: string;
  client_email?: string;
  client_telephone?: string;
  service: {
    id: number;
    nom: string;
    code: string;
    description?: string;
    prix: number;
  };
  docteur?: {
    id: number;
    first_name: string;
    last_name: string;
    speciality?: string;
  };
  date_souhaitee: string;
  date_confirmee?: string;
  statut: 'en_attente' | 'confirme' | 'assigne' | 'realise' | 'annule';
  message?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Consultation {
  id: number;
  rendez_vous: number;
  symptomes: string;
  diagnostic: string;
  traitement: string;
  observations: string;
  created_at: string;
  updated_at: string;
}

export interface Prescription {
  id: number;
  consultation: number;
  medicaments: string;
  posologie: string;
  duree: string;
  instructions: string;
  created_at: string;
  updated_at: string;
}

// Service pour la gestion des rendez-vous des médecins
class DoctorAppointmentsService {
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
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
      const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('authToken', data.access);
      } else {
        // Refresh token expiré, déconnexion
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
        throw new Error('Refresh token expired');
      }
    } catch (error) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userData');
      throw error;
    }
  }

  // Récupérer les rendez-vous d'aujourd'hui pour le médecin connecté
  async getTodayAppointments(): Promise<Appointment[]> {
    try {
      const response = await this.request<any>('/rendez-vous/aujourd_hui/');
      
      // Gérer la réponse paginée
      if (response && typeof response === 'object') {
        if (Array.isArray(response)) {
          return response;
        } else if (response.results && Array.isArray(response.results)) {
          return response.results;
        }
      }
      
      return [];
    } catch (error) {
      console.error('Erreur lors de la récupération des rendez-vous d\'aujourd\'hui:', error);
      return [];
    }
  }

  // Récupérer tous les rendez-vous du médecin connecté
  async getMyAppointments(): Promise<Appointment[]> {
    try {
      const response = await this.request<any>('/rendez-vous/');
      
      // Gérer la réponse paginée
      if (response && typeof response === 'object') {
        if (Array.isArray(response)) {
          // Si c'est directement un tableau
          return response;
        } else if (response.results && Array.isArray(response.results)) {
          // Si c'est une réponse paginée avec results
          return response.results;
        }
      }
      
      return [];
    } catch (error) {
      console.error('Erreur lors de la récupération des rendez-vous:', error);
      return [];
    }
  }

  // Récupérer les rendez-vous de cette semaine
  async getThisWeekAppointments(): Promise<Appointment[]> {
    try {
      const response = await this.request<Appointment[]>('/rendez-vous/cette_semaine/');
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Erreur lors de la récupération des rendez-vous de la semaine:', error);
      return [];
    }
  }

  // Marquer un rendez-vous comme réalisé
  async markAsCompleted(appointmentId: number, data?: { statut?: string; notes?: string }): Promise<any> {
    try {
      return await this.request(`/rendez-vous/${appointmentId}/marquer_realise/`, {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      });
    } catch (error) {
      console.error('Erreur lors du marquage du rendez-vous comme réalisé:', error);
      throw error;
    }
  }

  // Annuler un rendez-vous
  async cancelAppointment(appointmentId: number): Promise<any> {
    try {
      return await this.request(`/rendez-vous/${appointmentId}/annuler/`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Erreur lors de l\'annulation du rendez-vous:', error);
      throw error;
    }
  }

  // Récupérer les consultations du médecin
  async getMyConsultations(): Promise<Consultation[]> {
    try {
      const response = await this.request<Consultation[]>('/consultations/');
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Erreur lors de la récupération des consultations:', error);
      return [];
    }
  }

  // Créer une consultation
  async createConsultation(consultationData: {
    rendez_vous: number;
    symptomes: string;
    diagnostic: string;
    traitement: string;
    observations: string;
  }): Promise<Consultation> {
    try {
      return await this.request<Consultation>('/consultations/', {
        method: 'POST',
        body: JSON.stringify(consultationData),
      });
    } catch (error) {
      console.error('Erreur lors de la création de la consultation:', error);
      throw error;
    }
  }

  // Récupérer les prescriptions du médecin
  async getMyPrescriptions(): Promise<Prescription[]> {
    try {
      const response = await this.request<Prescription[]>('/prescriptions/');
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Erreur lors de la récupération des prescriptions:', error);
      return [];
    }
  }

  // Créer une prescription
  async createPrescription(prescriptionData: {
    consultation: number;
    medicaments: string;
    posologie: string;
    duree: string;
    instructions: string;
  }): Promise<Prescription> {
    try {
      return await this.request<Prescription>('/prescriptions/', {
        method: 'POST',
        body: JSON.stringify(prescriptionData),
      });
    } catch (error) {
      console.error('Erreur lors de la création de la prescription:', error);
      throw error;
    }
  }

  // Récupérer les statistiques du médecin
  async getDoctorStatistics(): Promise<any> {
    try {
      return await this.request('/statistiques/dashboard/');
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return {
        total_patients: 0,
        total_rdv_aujourd_hui: 0,
        total_docteurs: 0,
        total_consultations_mois: 0,
        revenus_mois: 0
      };
    }
  }

  // Récupérer les détails d'un patient
  async getPatientDetails(patientId: number): Promise<any> {
    try {
      return await this.request(`/patients/${patientId}/`);
    } catch (error) {
      console.error('Erreur lors de la récupération des détails du patient:', error);
      throw error;
    }
  }

  // Récupérer le dossier médical d'un patient
  async getPatientMedicalRecord(patientId: number): Promise<any> {
    try {
      return await this.request(`/patients/${patientId}/dossier_medical/`);
    } catch (error) {
      console.error('Erreur lors de la récupération du dossier médical:', error);
      throw error;
    }
  }
}

// Instance singleton
export const doctorAppointmentsService = new DoctorAppointmentsService();
