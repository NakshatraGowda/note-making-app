import React, { useState, useEffect, useCallback } from 'react';
import NoteCard from './components/NoteCard';
import NoteModal from './components/NoteModal';
import SearchBar from './components/SearchBar';
import EmptyState from './components/EmptyState';
import StatsBar from './components/StatsBar';
import SortBar from './components/SortBar';
import Toast from './components/Toast';
import { useNotes } from './hooks/useNotes';
import { useToast } from './hooks/useToast';
import './App.css';

function App() {
  const { notes, loading, error, search, setSearch, sort, setSort, addNote, editNote, removeNote, pinNote } = useNotes();
  const { toasts, addToast, removeToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [view, setView] = useState('grid');

  // Keyboard shortcut: Ctrl+N / Cmd+N
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        setEditingNote(null);
        setShowModal(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleEdit = (note) => { setEditingNote(note); setShowModal(true); };
  const handleAdd = () => { setEditingNote(null); setShowModal(true); };

  const handleSave = async (data) => {
    if (editingNote) {
      await editNote(editingNote.id, data);
      addToast('Note updated', 'success');
    } else {
      await addNote(data);
      addToast('Note created', 'success');
    }
  };

  const handleDelete = async (id) => {
    await removeNote(id);
    setDeleteConfirm(null);
    addToast('Note deleted', 'info');
  };

  const handlePin = async (id) => {
    const updated = await pinNote(id);
    addToast(updated.pinned ? 'Note pinned' : 'Note unpinned', 'info');
  };

  const pinnedNotes = notes.filter(n => n.pinned);
  const regularNotes = notes.filter(n => !n.pinned);

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">📓</span>
            <span className="logo-text">NoteFlow</span>
          </div>
          <SearchBar value={search} onChange={setSearch} />
          <button className="btn btn-primary add-btn" onClick={handleAdd} title="New note (Ctrl+N)">
            <span>+</span> New Note
          </button>
        </div>
      </header>

      <main className="main">
        {error && <div className="global-error">⚠️ {error}</div>}

        <StatsBar notes={notes} />

        {loading && notes.length === 0 ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Loading notes...</p>
          </div>
        ) : notes.length === 0 ? (
          <EmptyState search={search} onAdd={handleAdd} />
        ) : (
          <>
            <SortBar
              sort={sort}
              onSort={setSort}
              view={view}
              onView={setView}
              count={notes.length}
              searchActive={!!search}
            />

            {pinnedNotes.length > 0 && (
              <section className="notes-section">
                <h2 className="section-label">📌 Pinned</h2>
                <div className={view === 'list' ? 'notes-list' : 'notes-grid'}>
                  {pinnedNotes.map(note => (
                    <NoteCard key={note.id} note={note} view={view}
                      onEdit={handleEdit} onDelete={setDeleteConfirm} onPin={handlePin} />
                  ))}
                </div>
              </section>
            )}

            {regularNotes.length > 0 && (
              <section className="notes-section">
                {pinnedNotes.length > 0 && <h2 className="section-label">All Notes</h2>}
                <div className={view === 'list' ? 'notes-list' : 'notes-grid'}>
                  {regularNotes.map(note => (
                    <NoteCard key={note.id} note={note} view={view}
                      onEdit={handleEdit} onDelete={setDeleteConfirm} onPin={handlePin} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {showModal && (
        <NoteModal note={editingNote} onClose={() => setShowModal(false)} onSave={handleSave} />
      )}

      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="confirm-dialog" onClick={e => e.stopPropagation()}>
            <div className="confirm-icon">🗑️</div>
            <h3>Delete this note?</h3>
            <p>This action cannot be undone.</p>
            <div className="confirm-actions">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

export default App;
