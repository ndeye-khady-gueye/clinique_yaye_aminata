// Service pour la gestion des patients
export interface Patient {
  id?: number;
  user: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  date_naissance: string;
  profession?: string;
  situation_matrimoniale?: string;
  nombre_enfants?: number;
  personne_contact?: string;
  telephone_urgence?: string;
  adresse: string;
  groupe_sanguin?: string;
  allergies?: string;
  antecedents_medicaux?: string;
  created_at?: string;
}

export interface PatientCreateData {
  user_data: {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password: string;
    password_confirm: string;
  };
  date_naissance: string;
  profession?: string;
  situation_matrimoniale?: string;
  nombre_enfants?: number;
  personne_contact?: string;
  telephone_urgence?: string;
  adresse: string;
  groupe_sanguin?: string;
  allergies?: string;
  antecedents_medicaux?: string;
}

export const patientService = {
  // Récupérer tous les patients
  async getAllPatients(): Promise<Patient[]> {
    try {
      const response = await fetch('/api/patients/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des patients');
      }
      
      const data = await response.json();
      return data.results || data;
    } catch (error) {
      console.error('Erreur lors de la récupération des patients:', error);
      throw error;
    }
  },

  // Créer un nouveau patient
  async createPatient(patientData: PatientCreateData): Promise<Patient> {
    try {
      const response = await fetch('/api/patients/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(patientData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erreur lors de la création du patient: ${JSON.stringify(errorData)}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création du patient:', error);
      throw error;
    }
  },

  // Récupérer un patient par ID
  async getPatientById(id: number): Promise<Patient> {
    try {
      const response = await fetch(`/api/patients/${id}/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du patient');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération du patient:', error);
      throw error;
    }
  },

  // Mettre à jour un patient
  async updatePatient(id: number, patientData: Partial<Patient>): Promise<Patient> {
    try {
      const response = await fetch(`/api/patients/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(patientData)
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du patient');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du patient:', error);
      throw error;
    }
  },

  // Supprimer un patient
  async deletePatient(id: number): Promise<void> {
    try {
      const response = await fetch(`/api/patients/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du patient');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du patient:', error);
      throw error;
    }
  },

  // Récupérer le dossier médical d'un patient
  async getMedicalRecord(patientId: number) {
    try {
      const response = await fetch(`/api/patients/${patientId}/dossier_medical/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du dossier médical');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération du dossier médical:', error);
      throw error;
    }
  }
};
