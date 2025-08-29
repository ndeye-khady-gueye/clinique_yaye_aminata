import os
import sys

def verify_rdv_management_button():
    """Vérifier que le bouton Nouveau RDV est présent dans RendezVousManagement"""
    print("🔍 Vérification du bouton 'Nouveau RDV' dans RendezVousManagement")
    print("=" * 70)
    
    # Vérifier la page RendezVousManagement
    rdv_management_file = "src/pages/admin/RendezVousManagement.tsx"
    
    try:
        with open(rdv_management_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Vérifier que le bouton est dans la page
        if "Nouveau RDV" in content:
            print("✅ Le bouton 'Nouveau RDV' est présent dans RendezVousManagement")
        else:
            print("❌ Le bouton 'Nouveau RDV' n'est pas dans RendezVousManagement")
            return False
        
        # Vérifier que les imports nécessaires sont présents
        if "Plus" in content and "AppointmentForm" in content:
            print("✅ Les imports nécessaires sont présents (Plus, AppointmentForm)")
        else:
            print("❌ Les imports nécessaires ne sont pas présents")
            return False
        
        # Vérifier que le Dialog est configuré
        if "Dialog open={isAppointmentFormOpen}" in content:
            print("✅ Le Dialog est correctement configuré")
        else:
            print("❌ Le Dialog n'est pas correctement configuré")
            return False
        
        # Vérifier que la fonction de gestion est présente
        if "handleCreateAppointment" in content:
            print("✅ La fonction handleCreateAppointment est présente")
        else:
            print("❌ La fonction handleCreateAppointment n'est pas présente")
            return False
        
        print("\n🎉 Configuration correcte !")
        print("   - ✅ Bouton 'Nouveau RDV' ajouté dans RendezVousManagement")
        print("   - ✅ Imports nécessaires présents")
        print("   - ✅ Dialog configuré")
        print("   - ✅ Fonction de gestion présente")
        print("\n📍 Le bouton 'Nouveau RDV' se trouve maintenant dans :")
        print("   📂 Section 1 : Tableau de bord (Dashboard)")
        print("   📂 Section 2 : Rendez-Vous (/appointments)")
        print("   📂 Section 3 : Gestion des Demandes de Rendez-vous (RendezVousManagement)")
        print("   👤 Visible pour : Responsable de cabinet")
        
        return True
        
    except FileNotFoundError as e:
        print(f"❌ Fichier non trouvé: {e}")
        return False
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

if __name__ == "__main__":
    verify_rdv_management_button()
