import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

// Add request interceptor for logging
API.interceptors.request.use((config) => {
  console.log('API Request:', config.method.toUpperCase(), config.url);
  return config;
});

// Add response interceptor for error handling
API.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);

export const fetchNotes = (params) => API.get('/notes', { params });
export const fetchNote = (id) => API.get(`/notes/${id}`);
export const createNote = (data) => API.post('/notes', data);
export const updateNote = (id, data) => API.put(`/notes/${id}`, data);
export const deleteNote = (id) => API.delete(`/notes/${id}`);
export const togglePin = (id) => API.patch(`/notes/${id}/pin`);
