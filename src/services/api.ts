import axios from 'axios';

// Change this to your backend URL when deploying
// For local dev with physical device, use your machine's IP
// For emulator, use 10.0.2.2 (Android) or localhost (iOS)
const BASE_URL = 'http://10.0.2.2:8081'; // Android emulator default

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Intercept requests to add JWT token
api.interceptors.request.use(
  (config) => {
    // Token is injected per-call via setAuthToken
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Auth ───────────────────────────────────────────────────────────────────

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

export async function register(
  name: string,
  email: string,
  password: string,
  role: 'ADMIN' | 'ANALISTA' = 'ANALISTA'
) {
  await api.post('/api/v1/auth/register', { name, email, password, role });
}

// ─── Vehicles ────────────────────────────────────────────────────────────────

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

// ─── Predictions ─────────────────────────────────────────────────────────────

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
