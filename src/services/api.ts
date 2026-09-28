import axios from 'axios';

const DEV_FALLBACK = 'http://10.0.2.2:8081'; 
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || (__DEV__ ? DEV_FALLBACK : '');

if (!__DEV__ && !BASE_URL.startsWith('https://')) {
  throw new Error('EXPO_PUBLIC_API_URL deve ser uma URL https:// em builds de release.');
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});



let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url: string = error?.config?.url ?? '';
    const isAuthRoute = url.includes('/api/v1/auth/');
    if (status === 401 && !isAuthRoute && onUnauthorized) {
      onUnauthorized();
    }
    return Promise.reject(error);
  }
);



export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

export async function login(email: string, password: string) {
  const { data } = await api.post('/api/v1/auth/login', { email, password });
  return data as { token: string };
}


export async function register(name: string, email: string, password: string) {
  await api.post('/api/v1/auth/register', { name, email, password });
}


export interface CompareRequest {
  brand: string;
  model: string;
  version: string;
  targetAttributes: string[];
}

export interface CompareResponse {
  id: number;
  brand: string;
  model: string;
  version: string;
  technicalSpec: string; // JSON string from AI
  createdAt: string;
}

export async function compareVehicle(payload: CompareRequest) {
  const { data } = await api.post<CompareResponse>('/api/v1/vehicles/compare', payload);
  return data;
}



export interface PredictionRequest {
  vin: string;
  customerName: string;
  customerEmail: string;
  phone: string;
  retentionScore: number;
}

export interface PredictionResponse {
  id: number;
  vin: string;
  customerName: string;
  customerEmail: string;
  phone: string;
  retentionScore: number;
  predictionDate: string;
}

export async function savePrediction(payload: PredictionRequest) {
  const { data } = await api.post<PredictionResponse>('/api/v1/predictions', payload);
  return data;
}

export async function getPredictionByVin(vin: string) {
  const { data } = await api.get<PredictionResponse>(`/api/v1/predictions/${vin}`);
  return data;
}

export async function listPredictions(page = 0, size = 10) {
  const { data } = await api.get('/api/v1/predictions', {
    params: { page, size },
  });
  return data as {
    content: PredictionResponse[];
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

export default api;
