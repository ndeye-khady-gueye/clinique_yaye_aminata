import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  UserCheck,
  UserX,
  Edit,
  Eye
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

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

interface Doctor {
  id: number;
  first_name: string;
  last_name: string;
  speciality?: string;
}

const AppointmentManagementDashboard = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [confirmData, setConfirmData] = useState({
    date_confirmee: "",
    notes: "",
    prix_consultation: ""
  });

  // Charger les rendez-vous et les médecins
  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/rendez-vous/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des rendez-vous:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await fetch('/api/users/?role=doctor', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setDoctors(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des médecins:', error);
    }
  };

  const handleConfirmAppointment = async () => {
    if (!selectedAppointment || !confirmData.date_confirmee) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/rendez-vous/${selectedAppointment.id}/confirmer/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({
          date_confirmee: confirmData.date_confirmee,
          notes: confirmData.notes,
          prix_consultation: confirmData.prix_consultation || selectedAppointment.service.prix,
        }),
      });

      if (response.ok) {
        toast({
          title: "Succès !",
          description: "Rendez-vous confirmé et notification envoyée.",
        });
        setIsConfirmDialogOpen(false);
        setConfirmData({ date_confirmee: "", notes: "", prix_consultation: "" });
        fetchAppointments();
      } else {
        const data = await response.json();
        toast({
          title: "Erreur",
          description: data.message || "Erreur lors de la confirmation.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la confirmation du rendez-vous.",
        variant: "destructive",
      });
    }
  };

  const handleAssignDoctor = async (appointmentId: number, doctorId: number) => {
    try {
      const response = await fetch(`/api/rendez-vous/${appointmentId}/assigner_medecin/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({ docteur_id: doctorId }),
      });

      if (response.ok) {
        toast({
          title: "Succès !",
          description: "Médecin assigné avec succès.",
        });
        fetchAppointments();
      } else {
        const data = await response.json();
        toast({
          title: "Erreur",
          description: data.message || "Erreur lors de l'assignation.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'assignation du médecin.",
        variant: "destructive",
      });
    }
  };

  const handleCancelAppointment = async (appointmentId: number) => {
    try {
      const response = await fetch(`/api/rendez-vous/${appointmentId}/annuler/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Succès !",
          description: "Rendez-vous annulé et notification envoyée.",
        });
        fetchAppointments();
      } else {
        const data = await response.json();
        toast({
          title: "Erreur",
          description: data.message || "Erreur lors de l'annulation.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'annulation du rendez-vous.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      en_attente: { color: "bg-yellow-100 text-yellow-800", icon: AlertCircle },
      confirme: { color: "bg-blue-100 text-blue-800", icon: CheckCircle },
      assigne: { color: "bg-purple-100 text-purple-800", icon: UserCheck },
      realise: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      annule: { color: "bg-red-100 text-red-800", icon: XCircle },
      absent: { color: "bg-gray-100 text-gray-800", icon: UserX },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.en_attente;
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getClientInfo = (appointment: Appointment) => {
    if (appointment.patient) {
      return {
        name: `${appointment.patient.user.first_name} ${appointment.patient.user.last_name}`,
        email: appointment.patient.user.email,
        phone: appointment.patient.user.phone,
        type: "Patient"
      };
    } else {
      return {
        name: appointment.client_nom || "N/A",
        email: appointment.client_email || "N/A",
        phone: appointment.client_telephone || "N/A",
        type: "Client"
      };
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (selectedStatus === 'all') return true;
    return appointment.statut === selectedStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Rendez-vous</h1>
          <p className="text-gray-600 mt-2">
            Gérez les demandes de rendez-vous et confirmez les créneaux
          </p>
        </div>
        <div className="flex gap-4">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les RDV</SelectItem>
              <SelectItem value="en_attente">En attente</SelectItem>
              <SelectItem value="confirme">Confirmés</SelectItem>
              <SelectItem value="assigne">Assignés</SelectItem>
              <SelectItem value="realise">Réalisés</SelectItem>
              <SelectItem value="annule">Annulés</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {appointments.filter(a => a.statut === 'en_attente').length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmés</p>
                <p className="text-2xl font-bold text-blue-600">
                  {appointments.filter(a => a.statut === 'confirme').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Réalisés</p>
                <p className="text-2xl font-bold text-green-600">
                  {appointments.filter(a => a.statut === 'realise').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {appointments.length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table des rendez-vous */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Rendez-vous</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client/Patient</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Date souhaitée</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Médecin</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.map((appointment) => {
                const clientInfo = getClientInfo(appointment);
                return (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{clientInfo.name}</p>
                        <p className="text-sm text-gray-500">{clientInfo.type}</p>
                        <p className="text-sm text-gray-500">{clientInfo.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{appointment.service.nom}</p>
                        <p className="text-sm text-gray-500">{appointment.service.prix} FCFA</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {appointment.date_souhaitee ? (
                        <div>
                          <p className="font-medium">
                            {new Date(appointment.date_souhaitee).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(appointment.date_souhaitee).toLocaleTimeString()}
                          </p>
                        </div>
                      ) : (
                        <span className="text-gray-400">Non spécifiée</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(appointment.statut)}
                    </TableCell>
                    <TableCell>
                      {appointment.docteur ? (
                        <span>Dr. {appointment.docteur.first_name} {appointment.docteur.last_name}</span>
                      ) : (
                        <span className="text-gray-400">Non assigné</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Détails du Rendez-vous</DialogTitle>
                              <DialogDescription>
                                Consultez les informations complètes de ce rendez-vous.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold">Informations Client</h4>
                                <p><strong>Nom:</strong> {clientInfo.name}</p>
                                <p><strong>Type:</strong> {clientInfo.type}</p>
                                <p><strong>Email:</strong> {clientInfo.email}</p>
                                <p><strong>Téléphone:</strong> {clientInfo.phone}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold">Service</h4>
                                <p><strong>Service:</strong> {appointment.service.nom}</p>
                                <p><strong>Prix:</strong> {appointment.service.prix} FCFA</p>
                              </div>
                              {appointment.message && (
                                <div>
                                  <h4 className="font-semibold">Message</h4>
                                  <p>{appointment.message}</p>
                                </div>
                              )}
                              {appointment.notes && (
                                <div>
                                  <h4 className="font-semibold">Notes</h4>
                                  <p>{appointment.notes}</p>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>

                        {appointment.statut === 'en_attente' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedAppointment(appointment);
                                setIsConfirmDialogOpen(true);
                              }}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelAppointment(appointment.id)}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}

                        {appointment.statut === 'confirme' && !appointment.docteur && (
                          <Select onValueChange={(doctorId) => handleAssignDoctor(appointment.id, parseInt(doctorId))}>
                            <SelectTrigger className="w-40">
                              <SelectValue placeholder="Assigner" />
                            </SelectTrigger>
                            <SelectContent>
                              {doctors.map((doctor) => (
                                <SelectItem key={doctor.id} value={doctor.id.toString()}>
                                  Dr. {doctor.first_name} {doctor.last_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog de confirmation */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer le Rendez-vous</DialogTitle>
            <DialogDescription>
              Confirmez ce rendez-vous en assignant une date et un médecin. Le patient sera notifié.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="date_confirmee">Date et heure confirmées *</Label>
              <Input
                id="date_confirmee"
                type="datetime-local"
                value={confirmData.date_confirmee}
                onChange={(e) => setConfirmData(prev => ({ ...prev, date_confirmee: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="prix_consultation">Prix de consultation (FCFA)</Label>
              <Input
                id="prix_consultation"
                type="number"
                value={confirmData.prix_consultation}
                onChange={(e) => setConfirmData(prev => ({ ...prev, prix_consultation: e.target.value }))}
                placeholder={selectedAppointment?.service.prix.toString()}
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes (optionnel)</Label>
              <Textarea
                id="notes"
                value={confirmData.notes}
                onChange={(e) => setConfirmData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Notes pour le rendez-vous..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleConfirmAppointment}>
                Confirmer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentManagementDashboard;
