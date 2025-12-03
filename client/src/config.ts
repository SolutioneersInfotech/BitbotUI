export type EnvName = 'development' | 'lab' | 'production';

const mode = (import.meta.env.VITE_APP_ENV as EnvName) || (import.meta.env.MODE as EnvName) || 'development';

const defaults: Record<EnvName, { API_BASE_URL: string; AUTH_BASE_URL: string }> = {
  development: { API_BASE_URL: 'http://localhost:3000/api', AUTH_BASE_URL: 'http://localhost:3000/auth' },
  lab: { API_BASE_URL: 'https://predator-production.up.railway.app/api/', AUTH_BASE_URL: 'https://lab.api.example.com/auth' },
  production: { API_BASE_URL: 'https://predator-production.up.railway.app/api/', AUTH_BASE_URL: 'https://auth.example.com' }
};


const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || defaults[mode].API_BASE_URL;
const AUTH_BASE_URL = (import.meta.env.VITE_AUTH_BASE_URL as string) || defaults[mode].AUTH_BASE_URL;

export const CONFIG = {
  ENV: mode,
  API_BASE_URL,
  AUTH_BASE_URL
};

export const { ENV, API_BASE_URL: BASE_API_URL, AUTH_BASE_URL: BASE_AUTH_URL } = CONFIG;
