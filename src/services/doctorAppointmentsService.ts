const API_BASE_URL = 'http://127.0.0.1:8000';

class DoctorAppointmentsService {
  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('Token d\'authentification manquant. Veuillez vous reconnecter.');
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expiré ou invalide
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.href = '/login';
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Récupérer tous les rendez-vous du docteur
  async getMyAppointments() {
    try {
      const data = await this.makeRequest('/api/rendez-vous/');
      return data.results || data;
    } catch (error) {
      console.error('Erreur lors de la récupération des rendez-vous:', error);
      throw error;
    }
  }

  // Récupérer les rendez-vous d'aujourd'hui
  async getTodayAppointments() {
    try {
      const data = await this.makeRequest('/api/rendez-vous/aujourd_hui/');
      return data.results || data;
    } catch (error) {
      console.error('Erreur lors de la récupération des rendez-vous du jour:', error);
      throw error;
    }
  }

  // Récupérer les rendez-vous de cette semaine
  async getThisWeekAppointments() {
    try {
      const data = await this.makeRequest('/api/rendez-vous/cette_semaine/');
      return data.results || data;
    } catch (error) {
      console.error('Erreur lors de la récupération des rendez-vous de la semaine:', error);
      throw error;
    }
  }

  // Marquer un rendez-vous comme réalisé
  async markAsCompleted(appointmentId: number) {
    try {
      const data = await this.makeRequest(`/api/rendez-vous/${appointmentId}/marquer_realise/`, {
        method: 'POST',
      });
      return data;
    } catch (error) {
      console.error('Erreur lors de la réalisation du rendez-vous:', error);
      throw error;
    }
  }

  // Annuler un rendez-vous
  async cancelAppointment(appointmentId: number) {
    try {
      const data = await this.makeRequest(`/api/rendez-vous/${appointmentId}/annuler/`, {
        method: 'POST',
      });
      return data;
    } catch (error) {
      console.error('Erreur lors de l\'annulation du rendez-vous:', error);
      throw error;
    }
  }

  // Marquer un rendez-vous comme absent
  async markAsAbsent(appointmentId: number) {
    try {
      const data = await this.makeRequest(`/api/rendez-vous/${appointmentId}/marquer_absent/`, {
        method: 'POST',
      });
      return data;
    } catch (error) {
      console.error('Erreur lors du marquage d\'absence:', error);
      throw error;
    }
  }

  // Mettre à jour les notes d'un rendez-vous
  async updateAppointmentNotes(appointmentId: number, notes: string) {
    try {
      const data = await this.makeRequest(`/api/rendez-vous/${appointmentId}/`, {
        method: 'PUT',
        body: JSON.stringify({ notes }),
      });
      return data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour des notes:', error);
      throw error;
    }
  }

  // Récupérer les statistiques du docteur
  async getDoctorStatistics() {
    try {
      const data = await this.makeRequest('/api/statistiques/docteur/');
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  }
}

export const doctorAppointmentsService = new DoctorAppointmentsService();
