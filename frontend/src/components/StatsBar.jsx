import React from 'react';

const StatsBar = ({ notes }) => {
  const total = notes.length;
  const pinned = notes.filter(n => n.pinned).length;
  const colors = [...new Set(notes.map(n => n.color).filter(c => c && c !== '#ffffff'))].length;
  const words = notes.reduce((acc, n) => {
    const count = ((n.title || '') + ' ' + (n.content || '')).trim().split(/\s+/).filter(Boolean).length;
    return acc + count;
  }, 0);

  if (total === 0) return null;

  return (
    <div className="stats-bar">
      <StatPill label="Notes" value={total} icon="📝" />
      {pinned > 0 && <StatPill label="Pinned" value={pinned} icon="📌" />}
      {colors > 0 && <StatPill label="Colors used" value={colors} icon="🎨" />}
      <StatPill label="Words" value={words.toLocaleString()} icon="✍️" />
    </div>
  );
};

const StatPill = ({ label, value, icon }) => (
  <div className="stat-pill">
    <span className="stat-icon">{icon}</span>
    <span className="stat-value">{value}</span>
    <span className="stat-label">{label}</span>
  </div>
);

export default StatsBar;
