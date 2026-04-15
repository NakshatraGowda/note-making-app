import { useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';

const sortNotes = (notes, sort) => {
  const pinned = notes.filter(n => n.pinned);
  const regular = notes.filter(n => !n.pinned);
  const sorter = (a, b) => {
    switch (sort) {
      case 'updated_asc': return new Date(a.updated_at) - new Date(b.updated_at);
      case 'title_asc': return a.title.localeCompare(b.title);
      case 'title_desc': return b.title.localeCompare(a.title);
      default: return new Date(b.updated_at) - new Date(a.updated_at);
    }
  };
  return [...pinned.sort(sorter), ...regular.sort(sorter)];
};

export const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('updated_desc');

  const loadNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.fetchNotes({ search: search || undefined });
      if (res.data && res.data.data) {
        setNotes(res.data.data);
      } else {
        setError('Invalid response format from server');
      }
    } catch (e) {
      console.error('Error loading notes:', e);
      const errorMsg = e.response?.data?.error || e.message || 'Failed to load notes';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(loadNotes, 300);
    return () => clearTimeout(timer);
  }, [loadNotes]);

  const addNote = async (data) => {
    try {
      const res = await api.createNote(data);
      setNotes(prev => [res.data.data, ...prev]);
      return res.data.data;
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to save note';
      throw new Error(errorMsg);
    }
  };

  const editNote = async (id, data) => {
    try {
      const res = await api.updateNote(id, data);
      setNotes(prev => prev.map(n => n.id === id ? res.data.data : n));
      return res.data.data;
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to update note';
      throw new Error(errorMsg);
    }
  };

  const removeNote = async (id) => {
    try {
      await api.deleteNote(id);
      setNotes(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to delete note';
      throw new Error(errorMsg);
    }
  };

  const pinNote = async (id) => {
    try {
      const res = await api.togglePin(id);
      setNotes(prev => prev.map(n => n.id === id ? res.data.data : n));
      return res.data.data;
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to pin note';
      throw new Error(errorMsg);
    }
  };

  const sorted = sortNotes(notes, sort);

  return {
    notes: sorted,
    allNotes: notes,
    loading, error, search, setSearch, sort, setSort,
    addNote, editNote, removeNote, pinNote, reload: loadNotes
  };
};
