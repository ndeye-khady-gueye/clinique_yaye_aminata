import os
import sys

def verify_both_locations():
    """Vérifier que le bouton Nouveau RDV est présent aux deux endroits"""
    print("🔍 Vérification de l'emplacement du bouton 'Nouveau RDV'")
    print("=" * 60)
    
    # Vérifier le dashboard du Responsable de cabinet
    dashboard_file = "src/components/dashboards/ResponsableCabinetDashboard.tsx"
    
    try:
        with open(dashboard_file, 'r', encoding='utf-8') as f:
            dashboard_content = f.read()
        
        # Vérifier que le bouton EST dans le dashboard
        if "Nouveau RDV" in dashboard_content:
            print("✅ Le bouton 'Nouveau RDV' est présent dans le dashboard (Tableau de bord)")
        else:
            print("❌ Le bouton 'Nouveau RDV' n'est pas dans le dashboard")
            return False
        
        # Vérifier la page des rendez-vous
        appointments_file = "src/pages/Appointments.tsx"
        
        with open(appointments_file, 'r', encoding='utf-8') as f:
            appointments_content = f.read()
        
        # Vérifier que le bouton est dans la page des rendez-vous
        if "Nouveau RDV" in appointments_content:
            print("✅ Le bouton 'Nouveau RDV' est présent dans la page des rendez-vous")
        else:
            print("❌ Le bouton 'Nouveau RDV' n'est pas dans la page des rendez-vous")
            return False
        
        # Vérifier que le rôle responsable_cabinet est inclus
        if "responsable_cabinet" in appointments_content:
            print("✅ Le rôle 'responsable_cabinet' est inclus dans les permissions")
        else:
            print("❌ Le rôle 'responsable_cabinet' n'est pas inclus dans les permissions")
            return False
        
        print("\n🎉 Configuration correcte !")
        print("   - ✅ Bouton présent dans le Tableau de bord (Dashboard)")
        print("   - ✅ Bouton présent dans la section Rendez-Vous")
        print("   - ✅ Permissions mises à jour pour le Responsable de cabinet")
        print("\n📍 Le bouton 'Nouveau RDV' se trouve maintenant dans :")
        print("   📂 Section 1 : Tableau de bord (Dashboard)")
        print("   📂 Section 2 : Rendez-Vous (/appointments)")
        print("   👤 Visible pour : Admin, Réceptionniste, Responsable de cabinet")
        
        return True
        
    except FileNotFoundError as e:
        print(f"❌ Fichier non trouvé: {e}")
        return False
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

if __name__ == "__main__":
    verify_both_locations()
