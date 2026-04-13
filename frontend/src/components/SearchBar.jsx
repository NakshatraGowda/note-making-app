import React from 'react';

const SearchBar = ({ value, onChange }) => (
  <div className="search-bar">
    <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
    <input
      type="text"
      placeholder="Search notes..."
      value={value}
      onChange={e => onChange(e.target.value)}
      className="search-input"
    />
    {value && (
      <button className="clear-search" onClick={() => onChange('')}>✕</button>
    )}
  </div>
);

export default SearchBar;
