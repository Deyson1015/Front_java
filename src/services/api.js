import axios from 'axios';

// Configuración base de la API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

// Crear instancia de axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos de timeout
});

// Interceptor para requests
apiClient.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para responses
apiClient.interceptors.response.use(
  (response) => {
    console.log(`Response received from: ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.data || error.message);
    
    // Manejo específico de errores
    if (error.response?.status === 404) {
      console.error('Recurso no encontrado');
    } else if (error.response?.status === 500) {
      console.error('Error interno del servidor');
    } else if (error.code === 'ECONNABORTED') {
      console.error('Timeout de conexión');
    } else if (error.code === 'ERR_NETWORK') {
      console.error('Error de red - Verificar CORS o conectividad');
    }
    
    return Promise.reject(error);
  }
);

// Servicios específicos para aprendices
export const aprendizService = {
  // Obtener todos los aprendices
  getAll: () => apiClient.get('/aprendiz'),
  
  // Obtener aprendiz por ID
  getById: (id) => apiClient.get(`/aprendiz/${id}`),
  
  // Crear nuevo aprendiz
  create: (data) => apiClient.post('/aprendiz', data),
  
  // Actualizar aprendiz
  update: (id, data) => apiClient.put(`/aprendiz/${id}`, data),
  
  // Eliminar aprendiz
  delete: (id) => apiClient.delete(`/aprendiz/${id}`),
};

export default apiClient;