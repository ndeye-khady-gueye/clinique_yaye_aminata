import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  User, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  UserCheck,
  UserX,
  Eye,
  MapPin
} from "lucide-react";
import { useState, useEffect } from "react";

interface Appointment {
  id: number;
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
    speciality?: string;
  };
  statut: 'en_attente' | 'confirme' | 'assigne' | 'realise' | 'annule' | 'absent';
  notes?: string;
  prix_consultation?: number;
  created_at: string;
}

const PatientAppointmentsDashboard = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    fetchAppointments();
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      en_attente: { color: "bg-yellow-100 text-yellow-800", icon: AlertCircle, text: "En attente" },
      confirme: { color: "bg-blue-100 text-blue-800", icon: CheckCircle, text: "Confirmé" },
      assigne: { color: "bg-purple-100 text-purple-800", icon: UserCheck, text: "Assigné" },
      realise: { color: "bg-green-100 text-green-800", icon: CheckCircle, text: "Réalisé" },
      annule: { color: "bg-red-100 text-red-800", icon: XCircle, text: "Annulé" },
      absent: { color: "bg-gray-100 text-gray-800", icon: UserX, text: "Absent" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.en_attente;
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </Badge>
    );
  };

  const getStatusDescription = (status: string) => {
    const descriptions = {
      en_attente: "Votre demande de rendez-vous a été reçue et est en cours de traitement.",
      confirme: "Votre rendez-vous a été confirmé. Veuillez vous présenter à l'heure indiquée.",
      assigne: "Un médecin a été assigné à votre rendez-vous.",
      realise: "Ce rendez-vous a été réalisé avec succès.",
      annule: "Ce rendez-vous a été annulé. Veuillez nous contacter pour reprogrammer.",
      absent: "Vous n'êtes pas venu à ce rendez-vous.",
    };
    return descriptions[status as keyof typeof descriptions] || "";
  };

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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mes Rendez-vous</h1>
        <p className="text-gray-600 mt-2">
          Consultez l'état de vos rendez-vous et leurs détails
        </p>
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
          <CardTitle>Historique des Rendez-vous</CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun rendez-vous</h3>
              <p className="text-gray-600">
                Vous n'avez pas encore de rendez-vous. Contactez-nous pour en prendre un.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Médecin</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{appointment.service.nom}</p>
                        <p className="text-sm text-gray-500">{appointment.service.prix} FCFA</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {appointment.date_confirmee ? (
                        <div>
                          <p className="font-medium">
                            {new Date(appointment.date_confirmee).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(appointment.date_confirmee).toLocaleTimeString()}
                          </p>
                        </div>
                      ) : appointment.date_souhaitee ? (
                        <div>
                          <p className="font-medium">
                            {new Date(appointment.date_souhaitee).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(appointment.date_souhaitee).toLocaleTimeString()}
                          </p>
                          <p className="text-xs text-yellow-600">(Souhaitée)</p>
                        </div>
                      ) : (
                        <span className="text-gray-400">À confirmer</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(appointment.statut)}
                    </TableCell>
                    <TableCell>
                      {appointment.docteur ? (
                        <div>
                          <p className="font-medium">
                            Dr. {appointment.docteur.first_name} {appointment.docteur.last_name}
                          </p>
                          {appointment.docteur.speciality && (
                            <p className="text-sm text-gray-500">{appointment.docteur.speciality}</p>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">Non assigné</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedAppointment(appointment)}
                          >
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
                          {selectedAppointment && (
                            <div className="space-y-6">
                              {/* Statut */}
                              <div className="flex items-center gap-3">
                                {getStatusBadge(selectedAppointment.statut)}
                                <p className="text-sm text-gray-600">
                                  {getStatusDescription(selectedAppointment.statut)}
                                </p>
                              </div>

                              {/* Service */}
                              <div>
                                <h4 className="font-semibold text-lg mb-2">Service</h4>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                  <p className="font-medium">{selectedAppointment.service.nom}</p>
                                  <p className="text-gray-600">{selectedAppointment.service.prix} FCFA</p>
                                </div>
                              </div>

                              {/* Dates */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {selectedAppointment.date_souhaitee && (
                                  <div>
                                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                                      <Clock className="w-4 h-4" />
                                      Date souhaitée
                                    </h4>
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                      <p className="font-medium">
                                        {new Date(selectedAppointment.date_souhaitee).toLocaleDateString()}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        {new Date(selectedAppointment.date_souhaitee).toLocaleTimeString()}
                                      </p>
                                    </div>
                                  </div>
                                )}

                                {selectedAppointment.date_confirmee && (
                                  <div>
                                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                                      <Calendar className="w-4 h-4" />
                                      Date confirmée
                                    </h4>
                                    <div className="bg-green-50 p-3 rounded-lg">
                                      <p className="font-medium">
                                        {new Date(selectedAppointment.date_confirmee).toLocaleDateString()}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        {new Date(selectedAppointment.date_confirmee).toLocaleTimeString()}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Médecin */}
                              {selectedAppointment.docteur && (
                                <div>
                                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Médecin assigné
                                  </h4>
                                  <div className="bg-purple-50 p-3 rounded-lg">
                                    <p className="font-medium">
                                      Dr. {selectedAppointment.docteur.first_name} {selectedAppointment.docteur.last_name}
                                    </p>
                                    {selectedAppointment.docteur.speciality && (
                                      <p className="text-sm text-gray-600">{selectedAppointment.docteur.speciality}</p>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Message */}
                              {selectedAppointment.message && (
                                <div>
                                  <h4 className="font-semibold mb-2">Message</h4>
                                  <div className="bg-gray-50 p-3 rounded-lg">
                                    <p>{selectedAppointment.message}</p>
                                  </div>
                                </div>
                              )}

                              {/* Notes */}
                              {selectedAppointment.notes && (
                                <div>
                                  <h4 className="font-semibold mb-2">Notes du cabinet</h4>
                                  <div className="bg-yellow-50 p-3 rounded-lg">
                                    <p>{selectedAppointment.notes}</p>
                                  </div>
                                </div>
                              )}

                              {/* Prix */}
                              {selectedAppointment.prix_consultation && (
                                <div>
                                  <h4 className="font-semibold mb-2">Prix de consultation</h4>
                                  <div className="bg-green-50 p-3 rounded-lg">
                                    <p className="font-medium text-lg">
                                      {selectedAppointment.prix_consultation} FCFA
                                    </p>
                                  </div>
                                </div>
                              )}

                              {/* Date de création */}
                              <div className="text-sm text-gray-500">
                                Demande créée le {new Date(selectedAppointment.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientAppointmentsDashboard;
