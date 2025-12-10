// src/components/admin/StatsCard.tsx
import React from 'react';

interface StatsCardProps {
  icon: string;
  value: string;
  label: string;
  color?: 'blue' | 'green' | 'purple' | 'orange';
  trend?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  icon, 
  value, 
  label, 
  color = 'blue',
  trend 
}) => {
  return (
    <div className={`admin-stat-card ${color}`}>
      <div className="stat-header">
        <div className="stat-icon">{icon}</div>
        {trend && (
          <span className={`trend ${trend.startsWith('+') ? 'up' : 'down'}`}>
            {trend}
          </span>
        )}
      </div>
      
      <div className="stat-content">
        <h3>{value}</h3>
        <p>{label}</p>
      </div>
      
      <div className="stat-footer">
        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;