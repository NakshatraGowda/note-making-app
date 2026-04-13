import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

export const fetchNotes = (params) => API.get('/notes', { params });
export const fetchNote = (id) => API.get(`/notes/${id}`);
export const createNote = (data) => API.post('/notes', data);
export const updateNote = (id, data) => API.put(`/notes/${id}`, data);
export const deleteNote = (id) => API.delete(`/notes/${id}`);
export const togglePin = (id) => API.patch(`/notes/${id}/pin`);
