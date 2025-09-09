// Service pour la gestion des rendez-vous des docteurs
const API_BASE_URL = 'http://127.0.0.1:8000';

export interface DoctorAppointment {
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
  updated_at?: string;
}

export interface DoctorAppointmentUpdate {
  statut?: 'realise' | 'annule' | 'absent';
  notes?: string;
  consultation_report?: string;
}

class DoctorAppointmentsService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  // Récupérer tous les rendez-vous assignés au docteur connecté
  async getMyAppointments(): Promise<DoctorAppointment[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/rendez-vous/`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.results || data;
    } catch (error) {
      console.error('Erreur lors de la récupération des rendez-vous du docteur:', error);
      throw error;
    }
  }

  // Récupérer les rendez-vous d'aujourd'hui du docteur
  async getTodayAppointments(): Promise<DoctorAppointment[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/rendez-vous/aujourd_hui/`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.results || data;
    } catch (error) {
      console.error('Erreur lors de la récupération des rendez-vous d\'aujourd\'hui:', error);
      throw error;
    }
  }

  // Récupérer les rendez-vous de cette semaine du docteur
  async getThisWeekAppointments(): Promise<DoctorAppointment[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/rendez-vous/cette_semaine/`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.results || data;
    } catch (error) {
      console.error('Erreur lors de la récupération des rendez-vous de cette semaine:', error);
      throw error;
    }
  }

  // Récupérer un rendez-vous spécifique
  async getAppointment(id: number): Promise<DoctorAppointment> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/rendez-vous/${id}/`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération du rendez-vous:', error);
      throw error;
    }
  }

  // Marquer un rendez-vous comme réalisé
  async markAsCompleted(id: number, data: DoctorAppointmentUpdate): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/rendez-vous/${id}/marquer_realise/`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors du marquage comme réalisé');
      }

      return result;
    } catch (error) {
      console.error('Erreur lors du marquage comme réalisé:', error);
      throw error;
    }
  }

  // Annuler un rendez-vous
  async cancelAppointment(id: number, reason?: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/rendez-vous/${id}/annuler/`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ reason }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors de l\'annulation du rendez-vous');
      }

      return result;
    } catch (error) {
      console.error('Erreur lors de l\'annulation du rendez-vous:', error);
      throw error;
    }
  }

  // Marquer un patient comme absent (utilise l'endpoint annuler avec une note)
  async markAsAbsent(id: number, notes?: string): Promise<{ success: boolean; message: string }> {
    try {
      // Pour l'instant, on utilise l'endpoint annuler avec une note spéciale
      // TODO: Créer un endpoint spécifique pour marquer comme absent
      const response = await fetch(`${API_BASE_URL}/api/rendez-vous/${id}/annuler/`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ reason: `Patient absent: ${notes || 'Aucune note'}` }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors du marquage comme absent');
      }

      return result;
    } catch (error) {
      console.error('Erreur lors du marquage comme absent:', error);
      throw error;
    }
  }

  // Mettre à jour les notes d'un rendez-vous
  async updateAppointmentNotes(id: number, notes: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/rendez-vous/${id}/`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ notes }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors de la mise à jour des notes');
      }

      return result;
    } catch (error) {
      console.error('Erreur lors de la mise à jour des notes:', error);
      throw error;
    }
  }
}

export const doctorAppointmentsService = new DoctorAppointmentsService();
export type { DoctorAppointment, DoctorAppointmentUpdate };
