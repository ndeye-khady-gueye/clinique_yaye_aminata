const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

interface AppointmentRequest {
  client_nom: string;
  client_email?: string;
  client_telephone?: string;
  service: string;
  message?: string;
  date_souhaitee?: string;
}

interface AppointmentUpdate {
  date_confirmee?: string;
  docteur?: number;
  statut?: string;
  notes?: string;
  prix_consultation?: number;
}

interface Appointment {
  id: number;
  patient?: {
    user: {
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
    };
  };
  client_nom?: string;
  client_email?: string;
  client_telephone?: string;
  service: {
    id: number;
    nom: string;
    prix: number;
  };
  message?: string;
  date_souhaitee?: string;
  date_confirmee?: string;
  docteur?: {
    id: number;
    first_name: string;
    last_name: string;
  };
  statut: 'en_attente' | 'confirme' | 'assigne' | 'realise' | 'annule' | 'absent';
  notes?: string;
  prix_consultation?: number;
  created_at: string;
}

interface Service {
  id: number;
  code: string;
  nom: string;
  description: string;
  prix: number;
  duree_consultation: number;
}

interface Doctor {
  id: number;
  first_name: string;
  last_name: string;
  speciality?: string;
}

class AppointmentApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  // Créer une demande de rendez-vous (public)
  async createAppointmentRequest(data: AppointmentRequest): Promise<{ success: boolean; message: string; rdv: Appointment }> {
    const response = await fetch(`${API_BASE_URL}/api/rendez-vous/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Erreur lors de la création du rendez-vous');
    }

    return result;
  }

  // Récupérer tous les rendez-vous (authentifié)
  async getAppointments(): Promise<Appointment[]> {
    const response = await fetch(`${API_BASE_URL}/api/rendez-vous/`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des rendez-vous');
    }

    return response.json();
  }

  // Récupérer les rendez-vous en attente (Responsable)
  async getPendingAppointments(): Promise<Appointment[]> {
    const response = await fetch(`${API_BASE_URL}/api/rendez-vous/en_attente/`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des rendez-vous en attente');
    }

    return response.json();
  }

  // Récupérer un rendez-vous spécifique
  async getAppointment(id: number): Promise<Appointment> {
    const response = await fetch(`${API_BASE_URL}/api/rendez-vous/${id}/`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération du rendez-vous');
    }

    return response.json();
  }

  // Mettre à jour un rendez-vous
  async updateAppointment(id: number, data: AppointmentUpdate): Promise<{ success: boolean; message: string; rdv: Appointment }> {
    const response = await fetch(`${API_BASE_URL}/api/rendez-vous/${id}/`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Erreur lors de la mise à jour du rendez-vous');
    }

    return result;
  }

  // Confirmer un rendez-vous (Responsable)
  async confirmAppointment(id: number, data: { date_confirmee: string; notes?: string; prix_consultation?: number }): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/rendez-vous/${id}/confirmer/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Erreur lors de la confirmation du rendez-vous');
    }

    return result;
  }

  // Assigner un médecin (Responsable)
  async assignDoctor(appointmentId: number, doctorId: number): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/rendez-vous/${appointmentId}/assigner_medecin/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ docteur_id: doctorId }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Erreur lors de l\'assignation du médecin');
    }

    return result;
  }

  // Marquer comme réalisé (Médecin)
  async markAsCompleted(id: number): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/rendez-vous/${id}/marquer_realise/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Erreur lors du marquage comme réalisé');
    }

    return result;
  }

  // Annuler un rendez-vous
  async cancelAppointment(id: number): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/rendez-vous/${id}/annuler/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Erreur lors de l\'annulation du rendez-vous');
    }

    return result;
  }

  // Récupérer les services
  async getServices(): Promise<Service[]> {
    const response = await fetch(`${API_BASE_URL}/api/services/`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des services');
    }

    return response.json();
  }

  // Récupérer les médecins
  async getDoctors(): Promise<Doctor[]> {
    const response = await fetch(`${API_BASE_URL}/api/users/?role=doctor`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des médecins');
    }

    return response.json();
  }

  // Récupérer les rendez-vous d'aujourd'hui
  async getTodayAppointments(): Promise<Appointment[]> {
    const response = await fetch(`${API_BASE_URL}/api/rendez-vous/aujourd_hui/`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des rendez-vous d\'aujourd\'hui');
    }

    return response.json();
  }

  // Récupérer les rendez-vous de cette semaine
  async getThisWeekAppointments(): Promise<Appointment[]> {
    const response = await fetch(`${API_BASE_URL}/api/rendez-vous/cette_semaine/`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des rendez-vous de cette semaine');
    }

    return response.json();
  }
}

export const appointmentApi = new AppointmentApiService();
export type { Appointment, AppointmentRequest, AppointmentUpdate, Service, Doctor };
