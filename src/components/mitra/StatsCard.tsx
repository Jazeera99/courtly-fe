// src/components/mitra/StatsCard.tsx
import React from 'react';
import '../../styles/PartnerDashboard.css';

interface StatsCardProps {
  icon: string;
  value: string;
  label: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
  trend?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon, value, label, color, trend }) => {
  const getColorConfig = () => {
    switch (color) {
      case 'blue':
        return {
          iconBg: '59, 130, 246',
          iconColor: '59, 130, 246',
          colorStart: '#3b82f6',
          colorEnd: '#60a5fa'
        };
      case 'green':
        return {
          iconBg: '16, 185, 129',
          iconColor: '16, 185, 129',
          colorStart: '#10b981',
          colorEnd: '#34d399'
        };
      case 'purple':
        return {
          iconBg: '139, 92, 246',
          iconColor: '139, 92, 246',
          colorStart: '#8b5cf6',
          colorEnd: '#a78bfa'
        };
      case 'orange':
        return {
          iconBg: '249, 115, 22',
          iconColor: '249, 115, 22',
          colorStart: '#f97316',
          colorEnd: '#fb923c'
        };
      default:
        return {
          iconBg: '59, 130, 246',
          iconColor: '59, 130, 246',
          colorStart: '#3b82f6',
          colorEnd: '#60a5fa'
        };
    }
  };

  const colors = getColorConfig();
  const isTrendUp = trend && trend.includes('+');

  return (
    <div 
      className="stat-card"
      style={{
        '--icon-bg': colors.iconBg,
        '--icon-color': colors.iconColor,
        '--color-start': colors.colorStart,
        '--color-end': colors.colorEnd
      } as React.CSSProperties}
    >
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {trend && (
          <span className={`stat-trend ${isTrendUp ? 'trend-up' : 'trend-down'}`}>
            {isTrendUp ? '↗' : '↘'} {trend}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatsCard;