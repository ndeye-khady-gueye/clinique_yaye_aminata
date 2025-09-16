// Configuration des environnements
export const config = {
  development: {
    apiUrl: 'http://127.0.0.1:8000/api',
    frontendUrl: 'http://localhost:8080',
    domain: 'localhost'
  },
  production: {
    apiUrl: 'https://cabinetyayeaminata.com/api',
    frontendUrl: 'https://cabinetyayeaminata.com',
    domain: 'cabinetyayeaminata.com'
  }
};

// Détermine l'environnement actuel
const isDevelopment = import.meta.env.DEV;
const environment = isDevelopment ? 'development' : 'production';

// Exporte la configuration active
export const API_BASE_URL = config[environment].apiUrl;
export const FRONTEND_URL = config[environment].frontendUrl;
export const DOMAIN = config[environment].domain;

// Configuration pour les services
export const getApiUrl = () => API_BASE_URL;
export const getFrontendUrl = () => FRONTEND_URL;
export const getDomain = () => DOMAIN;
