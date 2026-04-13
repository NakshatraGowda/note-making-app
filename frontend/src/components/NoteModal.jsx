import React, { useState, useEffect, useRef } from 'react';

const NOTE_COLORS = [
  { hex: '#ffffff', label: 'White' },
  { hex: '#fef9c3', label: 'Yellow' },
  { hex: '#dcfce7', label: 'Green' },
  { hex: '#dbeafe', label: 'Blue' },
  { hex: '#fce7f3', label: 'Pink' },
  { hex: '#ede9fe', label: 'Purple' },
  { hex: '#ffedd5', label: 'Orange' },
];

const MAX_CONTENT = 2000;
const MAX_TITLE = 100;

const NoteModal = ({ note, onClose, onSave }) => {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [color, setColor] = useState(note?.color || '#ffffff');
  const [tags, setTags] = useState(note?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const titleRef = useRef();

  useEffect(() => {
    titleRef.current?.focus();
    const handleKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleTagKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
      if (newTag && !tags.includes(newTag) && tags.length < 5) {
        setTags(prev => [...prev, newTag]);
      }
      setTagInput('');
    } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      setTags(prev => prev.slice(0, -1));
    }
  };

  const removeTag = (tag) => setTags(prev => prev.filter(t => t !== tag));

  const handleSave = async () => {
    if (!title.trim()) { setError('Title is required'); titleRef.current?.focus(); return; }
    setSaving(true);
    try {
      await onSave({ title: title.trim(), content: content.trim(), color, tags });
      onClose();
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to save note');
      setSaving(false);
    }
  };

  const contentLeft = MAX_CONTENT - content.length;
  const isContentWarning = contentLeft < 200;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ backgroundColor: color }}>
        <div className="modal-header">
          <h2>{note ? 'Edit Note' : 'New Note'}</h2>
          <div className="modal-header-right">
            <span className="title-count" style={{ color: title.length > 90 ? '#dc2626' : undefined }}>
              {title.length}/{MAX_TITLE}
            </span>
            <button className="icon-btn close-btn" onClick={onClose}>✕</button>
          </div>
        </div>

        <div className="modal-body">
          {error && <div className="error-msg">⚠ {error}</div>}

          <input
            ref={titleRef}
            className="modal-input"
            placeholder="Note title..."
            value={title}
            maxLength={MAX_TITLE}
            onChange={e => { setTitle(e.target.value); setError(''); }}
          />

          <div className="textarea-wrapper">
            <textarea
              className="modal-textarea"
              placeholder="Write your note here..."
              value={content}
              maxLength={MAX_CONTENT}
              onChange={e => setContent(e.target.value)}
              rows={7}
            />
            <span className={`char-count ${isContentWarning ? 'warning' : ''}`}>
              {contentLeft} chars left
            </span>
          </div>

          <div className="tag-section">
            <div className="tag-input-row">
              {tags.map(tag => (
                <span key={tag} className="tag">
                  #{tag}
                  <button className="tag-remove" onClick={() => removeTag(tag)}>✕</button>
                </span>
              ))}
              {tags.length < 5 && (
                <input
                  className="tag-input"
                  placeholder={tags.length === 0 ? 'Add tags (Enter to confirm)...' : 'Add tag...'}
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                />
              )}
            </div>
            <span className="tag-hint">{tags.length}/5 tags</span>
          </div>

          <div className="color-picker">
            <span className="color-label">Color:</span>
            <div className="color-swatches">
              {NOTE_COLORS.map(c => (
                <button
                  key={c.hex}
                  className={`color-swatch ${color === c.hex ? 'selected' : ''}`}
                  style={{ backgroundColor: c.hex }}
                  title={c.label}
                  onClick={() => setColor(c.hex)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : note ? 'Update Note' : 'Add Note'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;
