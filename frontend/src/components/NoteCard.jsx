import React, { useState } from 'react';

const NoteCard = ({ note, onEdit, onDelete, onPin, view }) => {
  const [showMenu, setShowMenu] = useState(false);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className={`note-card ${view === 'list' ? 'note-card-list' : ''}`} style={{ backgroundColor: note.color || '#ffffff' }}>
      {note.pinned && (
        <div className="pin-badge">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/>
          </svg>
          Pinned
        </div>
      )}

      <div className="note-card-header">
        <h3 className="note-title">{note.title}</h3>
        <div className="note-actions">
          <button className="icon-btn pin-btn" onClick={() => onPin(note.id)} title={note.pinned ? 'Unpin' : 'Pin'}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill={note.pinned ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/>
            </svg>
          </button>
          <button className="icon-btn" onClick={() => onEdit(note)} title="Edit">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <div className="menu-wrapper">
            <button className="icon-btn" onClick={() => setShowMenu(!showMenu)}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/>
              </svg>
            </button>
            {showMenu && (
              <>
                <div className="menu-backdrop" onClick={() => setShowMenu(false)} />
                <div className="dropdown-menu">
                  <button onClick={() => { onEdit(note); setShowMenu(false); }}>✏️ Edit</button>
                  <button className="danger" onClick={() => { onDelete(note.id); setShowMenu(false); }}>🗑️ Delete</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {note.content && <p className="note-content">{note.content}</p>}

      {note.tags && note.tags.length > 0 && (
        <div className="note-tags">
          {note.tags.map(tag => (
            <span key={tag} className="note-tag">#{tag}</span>
          ))}
        </div>
      )}

      <div className="note-footer">
        <span className="note-date">{formatDate(note.updated_at)}</span>
      </div>
    </div>
  );
};

export default NoteCard;
