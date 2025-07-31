import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = Cookies.get('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface Cell {
  cellRef: string;
  value: string | number | null;
  formula?: string;
}

export interface Sheet {
  id: string;
  name: string;
  cells: Cell[];
  rowCount: number;
  columnCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSheetRequest {
  name: string;
  rowCount?: number;
  columnCount?: number;
}

export interface UpdateCellsRequest {
  cells: Cell[];
}

export const authApi = {
  login: async (token: string) => {
    Cookies.set('auth_token', token, { expires: 7 });
    return { success: true };
  },
  
  logout: () => {
    Cookies.remove('auth_token');
  },
  
  isAuthenticated: () => {
    return !!Cookies.get('auth_token');
  }
};

export const sheetsApi = {
  createSheet: async (data: CreateSheetRequest): Promise<Sheet> => {
    const response = await api.post('/v1/sheet', data);
    return response.data;
  },
  
  getSheet: async (sheetId: string): Promise<Sheet> => {
    const response = await api.get(`/v1/sheet/${sheetId}`);
    return response.data;
  },
  
  updateSheetData: async (sheetId: string, data: UpdateCellsRequest): Promise<Sheet> => {
    const response = await api.put(`/v1/sheet-data/${sheetId}`, data);
    return response.data;
  }
};

export default api;