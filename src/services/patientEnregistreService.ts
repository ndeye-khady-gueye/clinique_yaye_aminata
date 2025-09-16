import { API_BASE_URL } from '@/config/environment';

// Service pour la gestion des patients enregistrés temporairement
export interface PatientEnregistre {
  id?: number;
  nom: string;
  prenom: string;
  telephone?: string;
  email?: string;
  age?: number;
  motif_visite: string;
  observations_notes?: string;
  type_consultation: string;
  prix_consultation: number;
  statut: string;
  date_enregistrement?: string;
  heure_enregistrement?: string;
  profession?: string;
  adresse?: string;
  antecedents_medicaux?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PatientEnregistreCreateData {
  nom: string;
  prenom: string;
  telephone?: string;
  email?: string;
  age?: number;
  motif_visite: string;
  observations_notes?: string;
  type_consultation: string;
  prix_consultation: number;
  profession?: string;
  adresse?: string;
  antecedents_medicaux?: string;
}

export const patientEnregistreService = {
  async getAllPatientsEnregistres(): Promise<PatientEnregistre[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients-enregistres/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.results || data;
    } catch (error) {
      console.error('Erreur lors de la récupération des patients enregistrés:', error);
      throw error;
    }
  },

  async createPatientEnregistre(patientData: PatientEnregistreCreateData): Promise<PatientEnregistre> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients-enregistres/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`);
      }
      
      const data = await response.json();
      return data.patient || data;
    } catch (error) {
      console.error('Erreur lors de la création du patient enregistré:', error);
      throw error;
    }
  },

  async getPatientsEnregistresAujourdhui(): Promise<PatientEnregistre[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients-enregistres/aujourd_hui/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des patients enregistrés aujourd\'hui:', error);
      throw error;
    }
  },

  async updatePatientEnregistre(id: number, patientData: Partial<PatientEnregistre>): Promise<PatientEnregistre> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients-enregistres/${id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du patient enregistré:', error);
      throw error;
    }
  },

  async deletePatientEnregistre(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients-enregistres/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du patient enregistré:', error);
      throw error;
    }
  }
};
