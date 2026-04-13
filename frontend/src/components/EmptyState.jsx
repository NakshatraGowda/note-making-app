import React from 'react';

const EmptyState = ({ search, onAdd }) => (
  <div className="empty-state">
    <div className="empty-icon">
      {search ? '🔍' : '📝'}
    </div>
    <h3>{search ? 'No notes found' : 'No notes yet'}</h3>
    <p>{search ? `No results for "${search}"` : 'Create your first note to get started'}</p>
    {!search && (
      <button className="btn btn-primary" onClick={onAdd}>
        + Create Note
      </button>
    )}
  </div>
);

export default EmptyState;
