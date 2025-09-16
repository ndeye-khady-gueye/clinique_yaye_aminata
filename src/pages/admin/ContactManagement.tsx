import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { contactApi } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Mail, 
  Clock, 
  CheckCircle, 
  MessageSquare, 
  Eye, 
  Reply, 
  Archive,
  Search,
  Filter
} from "lucide-react";

interface ContactMessage {
  id: number;
  nom: string;
  email: string;
  sujet: string;
  message: string;
  date_heure_souhaitee: string | null;
  statut: 'nouveau' | 'lu' | 'repondu' | 'traite';
  created_at: string;
  updated_at: string;
}

interface ContactStats {
  total_messages: number;
  nouveaux_messages: number;
  messages_lus: number;
  messages_repondus: number;
  messages_traites: number;
}

const ContactManagement = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [stats, setStats] = useState<ContactStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'responsable_cabinet') {
      loadMessages();
      loadStats();
    }
  }, [user]);

  const loadMessages = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await contactApi.getMessages(token || "");
      setMessages(response.results || response);
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les messages de contact",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await contactApi.getMessageStats(token || "");
      setStats(response);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  const handleStatusChange = async (messageId: number, newStatus: string) => {
    try {
      const token = localStorage.getItem('authToken');
      let response;
      switch (newStatus) {
        case 'lu':
          response = await contactApi.markAsRead(messageId, token || "");
          break;
        case 'repondu':
          response = await contactApi.markAsReplied(messageId, token || "");
          break;
        case 'traite':
          response = await contactApi.markAsProcessed(messageId, token || "");
          break;
        default:
          return;
      }

      toast({
        title: "Succès",
        description: `Message marqué comme ${newStatus}`,
      });

      // Recharger les messages et stats
      loadMessages();
      loadStats();
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut du message",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      nouveau: { color: "bg-blue-100 text-blue-800", icon: Mail },
      lu: { color: "bg-yellow-100 text-yellow-800", icon: Eye },
      repondu: { color: "bg-green-100 text-green-800", icon: Reply },
      traite: { color: "bg-gray-100 text-gray-800", icon: CheckCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.sujet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || message.statut === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (user?.role !== 'admin' && user?.role !== 'responsable_cabinet') {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">
              Vous n'avez pas les permissions pour accéder à cette page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Gestion des Messages de Contact</h1>
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center">
                <Mail className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0" />
                <div className="ml-2 sm:ml-4 min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{stats.total_messages}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center">
                <Mail className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0" />
                <div className="ml-2 sm:ml-4 min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Nouveaux</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">{stats.nouveaux_messages}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center">
                <Eye className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600 flex-shrink-0" />
                <div className="ml-2 sm:ml-4 min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Lus</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-600">{stats.messages_lus}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center">
                <Reply className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 flex-shrink-0" />
                <div className="ml-2 sm:ml-4 min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Répondus</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">{stats.messages_repondus}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600 flex-shrink-0" />
                <div className="ml-2 sm:ml-4 min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Traités</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-600">{stats.messages_traites}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtres */}
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher dans les messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="nouveau">Nouveaux</SelectItem>
                  <SelectItem value="lu">Lus</SelectItem>
                  <SelectItem value="repondu">Répondus</SelectItem>
                  <SelectItem value="traite">Traités</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des messages */}
      <div className="space-y-3 sm:space-y-4">
        {loading ? (
          <Card>
            <CardContent className="p-4 sm:p-6">
              <p className="text-center text-gray-500 text-sm sm:text-base">Chargement des messages...</p>
            </CardContent>
          </Card>
        ) : filteredMessages.length === 0 ? (
          <Card>
            <CardContent className="p-4 sm:p-6">
              <p className="text-center text-gray-500 text-sm sm:text-base">Aucun message trouvé</p>
            </CardContent>
          </Card>
        ) : (
          filteredMessages.map((message) => (
            <Card key={message.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-4 lg:space-y-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{message.nom}</h3>
                      {getStatusBadge(message.statut)}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-1 break-all">{message.email}</p>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2">
                      <Clock className="inline w-3 h-3 mr-1" />
                      {formatDate(message.created_at)}
                    </p>
                    <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">{message.sujet}</h4>
                    <p className="text-gray-700 line-clamp-2 text-sm sm:text-base">{message.message}</p>
                    {message.date_heure_souhaitee && (
                      <p className="text-xs sm:text-sm text-blue-600 mt-2">
                        <Clock className="inline w-3 h-3 mr-1" />
                        Date souhaitée: {formatDate(message.date_heure_souhaitee)}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2 lg:ml-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedMessage(message)}
                          className="w-full sm:w-auto"
                        >
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          <span className="hidden xs:inline">Voir</span>
                          <span className="xs:hidden">Voir</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-base sm:text-lg">Détails du message</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3 sm:space-y-4">
                          <div>
                            <label className="text-xs sm:text-sm font-medium text-gray-700">Nom</label>
                            <p className="text-gray-900 text-sm sm:text-base">{message.nom}</p>
                          </div>
                          <div>
                            <label className="text-xs sm:text-sm font-medium text-gray-700">Email/Téléphone</label>
                            <p className="text-gray-900 text-sm sm:text-base break-all">{message.email}</p>
                          </div>
                          <div>
                            <label className="text-xs sm:text-sm font-medium text-gray-700">Sujet</label>
                            <p className="text-gray-900 text-sm sm:text-base">{message.sujet}</p>
                          </div>
                          <div>
                            <label className="text-xs sm:text-sm font-medium text-gray-700">Message</label>
                            <p className="text-gray-900 whitespace-pre-wrap text-sm sm:text-base">{message.message}</p>
                          </div>
                          {message.date_heure_souhaitee && (
                            <div>
                              <label className="text-xs sm:text-sm font-medium text-gray-700">Date souhaitée</label>
                              <p className="text-gray-900 text-sm sm:text-base">{formatDate(message.date_heure_souhaitee)}</p>
                            </div>
                          )}
                          <div>
                            <label className="text-xs sm:text-sm font-medium text-gray-700">Notes</label>
                            <Textarea
                              placeholder="Ajouter des notes..."
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              rows={3}
                              className="text-sm"
                            />
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <div className="flex flex-col gap-1">
                      {message.statut === 'nouveau' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(message.id, 'lu')}
                          className="w-full sm:w-auto"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          <span className="hidden xs:inline">Marquer lu</span>
                          <span className="xs:hidden">Lu</span>
                        </Button>
                      )}
                      {message.statut === 'lu' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(message.id, 'repondu')}
                          className="w-full sm:w-auto"
                        >
                          <Reply className="w-3 h-3 mr-1" />
                          <span className="hidden xs:inline">Marquer répondu</span>
                          <span className="xs:hidden">Répondu</span>
                        </Button>
                      )}
                      {message.statut === 'repondu' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(message.id, 'traite')}
                          className="w-full sm:w-auto"
                        >
                          <Archive className="w-3 h-3 mr-1" />
                          <span className="hidden xs:inline">Marquer traité</span>
                          <span className="xs:hidden">Traité</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ContactManagement;
