import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

export interface ReportData {
  users: {
    total: number;
    active: number;
    inactive: number;
    by_role: Array<{
      role: string;
      count: number;
      percentage: number;
    }>;
    growth: Array<{
      date: string;
      count: number;
    }>;
  };
  appointments: {
    total: number;
    today: number;
    by_status: Array<{
      status: string;
      count: number;
    }>;
    growth: Array<{
      date: string;
      count: number;
    }>;
  };
  patients: {
    total: number;
    growth: Array<{
      date: string;
      count: number;
    }>;
  };
  performance: {
    response_time: number;
    availability: number;
    errors_today: number;
    daily_requests: Array<{
      date: string;
      requests: number;
    }>;
  };
  notifications: {
    total: number;
    unread: number;
    by_type: Array<{
      type: string;
      count: number;
    }>;
  };
  period: {
    start_date: string;
    end_date: string;
    days: number;
  };
}

export class ExportService {
  static exportToPDF(data: ReportData): void {
    const doc = new jsPDF();
    
    // Titre principal
    doc.setFontSize(20);
    doc.setTextColor(108, 36, 118); // Couleur primaire
    doc.text('Rapport Système - Cabinet Yaye Aminata', 20, 20);
    
    // Date de génération
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 20, 30);
    
    let yPosition = 50;
    
    // Métriques principales
    doc.setFontSize(16);
    doc.setTextColor(108, 36, 118);
    doc.text('Métriques Principales', 20, yPosition);
    yPosition += 15;
    
    // Liste des métriques
    const metrics = [
      `Utilisateurs Totaux: ${data.users.total}`,
      `Utilisateurs Actifs: ${data.users.active}`,
      `Utilisateurs Inactifs: ${data.users.inactive}`,
      `Rendez-vous Totaux: ${data.appointments.total}`,
      `Rendez-vous Aujourd'hui: ${data.appointments.today}`,
      `Patients Totaux: ${data.patients.total}`,
      `Temps de Réponse: ${data.performance.response_time}ms`,
      `Disponibilité: ${data.performance.availability}%`,
      `Erreurs 24h: ${data.performance.errors_today}`,
      `Notifications Totales: ${data.notifications.total}`,
      `Notifications Non Lues: ${data.notifications.unread}`
    ];
    
    metrics.forEach(metric => {
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(metric, 20, yPosition);
      yPosition += 8;
    });
    
    yPosition += 10;
    
    // Utilisateurs par rôle
    if (data.users.by_role.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(108, 36, 118);
      doc.text('Répartition par Rôle', 20, yPosition);
      yPosition += 15;
      
      data.users.by_role.forEach(role => {
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`${role.role}: ${role.count} (${role.percentage}%)`, 20, yPosition);
        yPosition += 8;
      });
      
      yPosition += 10;
    }
    
    // Rendez-vous par statut
    if (data.appointments.by_status.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(108, 36, 118);
      doc.text('Rendez-vous par Statut', 20, yPosition);
      yPosition += 15;
      
      data.appointments.by_status.forEach(status => {
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`${status.status}: ${status.count}`, 20, yPosition);
        yPosition += 8;
      });
      
      yPosition += 10;
    }
    
    // Notifications par type
    if (data.notifications.by_type.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(108, 36, 118);
      doc.text('Notifications par Type', 20, yPosition);
      yPosition += 15;
      
      data.notifications.by_type.forEach(notif => {
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`${notif.type}: ${notif.count}`, 20, yPosition);
        yPosition += 8;
      });
    }
    
    // Sauvegarder le PDF
    doc.save(`rapport-systeme-${new Date().toISOString().split('T')[0]}.pdf`);
  }
  
  static exportToExcel(data: ReportData): void {
    const workbook = XLSX.utils.book_new();
    
    // Feuille 1: Métriques principales
    const metricsData = [
      ['Métrique', 'Valeur'],
      ['Utilisateurs Totaux', data.users.total],
      ['Utilisateurs Actifs', data.users.active],
      ['Utilisateurs Inactifs', data.users.inactive],
      ['Rendez-vous Totaux', data.appointments.total],
      ['Rendez-vous Aujourd\'hui', data.appointments.today],
      ['Patients Totaux', data.patients.total],
      ['Temps de Réponse (ms)', data.performance.response_time],
      ['Disponibilité (%)', data.performance.availability],
      ['Erreurs 24h', data.performance.errors_today],
      ['Notifications Totales', data.notifications.total],
      ['Notifications Non Lues', data.notifications.unread]
    ];
    
    const metricsSheet = XLSX.utils.aoa_to_sheet(metricsData);
    XLSX.utils.book_append_sheet(workbook, metricsSheet, 'Métriques Principales');
    
    // Feuille 2: Utilisateurs par rôle
    if (data.users.by_role.length > 0) {
      const roleData = [
        ['Rôle', 'Nombre', 'Pourcentage'],
        ...data.users.by_role.map(role => [role.role, role.count, role.percentage])
      ];
      const roleSheet = XLSX.utils.aoa_to_sheet(roleData);
      XLSX.utils.book_append_sheet(workbook, roleSheet, 'Utilisateurs par Rôle');
    }
    
    // Feuille 3: Rendez-vous par statut
    if (data.appointments.by_status.length > 0) {
      const statusData = [
        ['Statut', 'Nombre'],
        ...data.appointments.by_status.map(status => [status.status, status.count])
      ];
      const statusSheet = XLSX.utils.aoa_to_sheet(statusData);
      XLSX.utils.book_append_sheet(workbook, statusSheet, 'Rendez-vous par Statut');
    }
    
    // Feuille 4: Croissance des utilisateurs
    if (data.users.growth.length > 0) {
      const growthData = [
        ['Date', 'Nombre d\'utilisateurs'],
        ...data.users.growth.map(growth => [growth.date, growth.count])
      ];
      const growthSheet = XLSX.utils.aoa_to_sheet(growthData);
      XLSX.utils.book_append_sheet(workbook, growthSheet, 'Croissance Utilisateurs');
    }
    
    // Feuille 5: Rendez-vous dans le temps
    if (data.appointments.growth.length > 0) {
      const appointmentGrowthData = [
        ['Date', 'Nombre de rendez-vous'],
        ...data.appointments.growth.map(growth => [growth.date, growth.count])
      ];
      const appointmentGrowthSheet = XLSX.utils.aoa_to_sheet(appointmentGrowthData);
      XLSX.utils.book_append_sheet(workbook, appointmentGrowthSheet, 'Rendez-vous dans le temps');
    }
    
    // Feuille 6: Requêtes quotidiennes
    if (data.performance.daily_requests.length > 0) {
      const requestsData = [
        ['Date', 'Nombre de requêtes'],
        ...data.performance.daily_requests.map(req => [req.date, req.requests])
      ];
      const requestsSheet = XLSX.utils.aoa_to_sheet(requestsData);
      XLSX.utils.book_append_sheet(workbook, requestsSheet, 'Requêtes Quotidiennes');
    }
    
    // Feuille 7: Notifications par type
    if (data.notifications.by_type.length > 0) {
      const notificationData = [
        ['Type', 'Nombre'],
        ...data.notifications.by_type.map(notif => [notif.type, notif.count])
      ];
      const notificationSheet = XLSX.utils.aoa_to_sheet(notificationData);
      XLSX.utils.book_append_sheet(workbook, notificationSheet, 'Notifications par Type');
    }
    
    // Sauvegarder le fichier Excel
    XLSX.writeFile(workbook, `rapport-systeme-${new Date().toISOString().split('T')[0]}.xlsx`);
  }
  
  static exportToCSV(data: ReportData): void {
    let csvContent = 'Rapport Système - Cabinet Yaye Aminata\n';
    csvContent += `Généré le: ${new Date().toLocaleDateString('fr-FR')}\n\n`;
    
    // Métriques principales
    csvContent += 'MÉTRIQUES PRINCIPALES\n';
    csvContent += 'Métrique,Valeur\n';
    csvContent += `Utilisateurs Totaux,${data.users.total}\n`;
    csvContent += `Utilisateurs Actifs,${data.users.active}\n`;
    csvContent += `Utilisateurs Inactifs,${data.users.inactive}\n`;
    csvContent += `Rendez-vous Totaux,${data.appointments.total}\n`;
    csvContent += `Rendez-vous Aujourd'hui,${data.appointments.today}\n`;
    csvContent += `Patients Totaux,${data.patients.total}\n`;
    csvContent += `Temps de Réponse (ms),${data.performance.response_time}\n`;
    csvContent += `Disponibilité (%),${data.performance.availability}\n`;
    csvContent += `Erreurs 24h,${data.performance.errors_today}\n`;
    csvContent += `Notifications Totales,${data.notifications.total}\n`;
    csvContent += `Notifications Non Lues,${data.notifications.unread}\n\n`;
    
    // Utilisateurs par rôle
    if (data.users.by_role.length > 0) {
      csvContent += 'UTILISATEURS PAR RÔLE\n';
      csvContent += 'Rôle,Nombre,Pourcentage\n';
      data.users.by_role.forEach(role => {
        csvContent += `${role.role},${role.count},${role.percentage}%\n`;
      });
      csvContent += '\n';
    }
    
    // Rendez-vous par statut
    if (data.appointments.by_status.length > 0) {
      csvContent += 'RENDEZ-VOUS PAR STATUT\n';
      csvContent += 'Statut,Nombre\n';
      data.appointments.by_status.forEach(status => {
        csvContent += `${status.status},${status.count}\n`;
      });
      csvContent += '\n';
    }
    
    // Croissance des utilisateurs
    if (data.users.growth.length > 0) {
      csvContent += 'CROISSANCE DES UTILISATEURS\n';
      csvContent += 'Date,Nombre d\'utilisateurs\n';
      data.users.growth.forEach(growth => {
        csvContent += `${growth.date},${growth.count}\n`;
      });
      csvContent += '\n';
    }
    
    // Rendez-vous dans le temps
    if (data.appointments.growth.length > 0) {
      csvContent += 'RENDEZ-VOUS DANS LE TEMPS\n';
      csvContent += 'Date,Nombre de rendez-vous\n';
      data.appointments.growth.forEach(growth => {
        csvContent += `${growth.date},${growth.count}\n`;
      });
      csvContent += '\n';
    }
    
    // Requêtes quotidiennes
    if (data.performance.daily_requests.length > 0) {
      csvContent += 'REQUÊTES QUOTIDIENNES\n';
      csvContent += 'Date,Nombre de requêtes\n';
      data.performance.daily_requests.forEach(req => {
        csvContent += `${req.date},${req.requests}\n`;
      });
      csvContent += '\n';
    }
    
    // Notifications par type
    if (data.notifications.by_type.length > 0) {
      csvContent += 'NOTIFICATIONS PAR TYPE\n';
      csvContent += 'Type,Nombre\n';
      data.notifications.by_type.forEach(notif => {
        csvContent += `${notif.type},${notif.count}\n`;
      });
    }
    
    // Créer et télécharger le fichier CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `rapport-systeme-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
