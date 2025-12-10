// src/components/mitra/StatsCard.tsx
import React from 'react';

interface StatsCardProps {
  icon: string;
  value: string;
  label: string;
  color?: 'blue' | 'green' | 'purple' | 'orange';
}

const StatsCard: React.FC<StatsCardProps> = ({ icon, value, label, color = 'blue' }) => {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <h3>{value}</h3>
        <p>{label}</p>
      </div>
    </div>
  );
};

export default StatsCard;