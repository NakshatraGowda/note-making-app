import React from 'react';

const SORT_OPTIONS = [
  { value: 'updated_desc', label: 'Latest first' },
  { value: 'updated_asc', label: 'Oldest first' },
  { value: 'title_asc', label: 'Title A–Z' },
  { value: 'title_desc', label: 'Title Z–A' },
];

const VIEW_OPTIONS = [
  { value: 'grid', icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  )},
  { value: 'list', icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <rect x="3" y="4" width="18" height="3" rx="1"/><rect x="3" y="10.5" width="18" height="3" rx="1"/>
      <rect x="3" y="17" width="18" height="3" rx="1"/>
    </svg>
  )},
];

const SortBar = ({ sort, onSort, view, onView, count, searchActive }) => (
  <div className="sort-bar">
    <span className="results-count">
      {searchActive ? `${count} result${count !== 1 ? 's' : ''}` : `${count} note${count !== 1 ? 's' : ''}`}
    </span>
    <div className="sort-bar-right">
      <select className="sort-select" value={sort} onChange={e => onSort(e.target.value)}>
        {SORT_OPTIONS.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <div className="view-toggle">
        {VIEW_OPTIONS.map(o => (
          <button
            key={o.value}
            className={`view-btn ${view === o.value ? 'active' : ''}`}
            onClick={() => onView(o.value)}
            title={o.value === 'grid' ? 'Grid view' : 'List view'}
          >
            {o.icon}
          </button>
        ))}
      </div>
    </div>
  </div>
);

export default SortBar;
