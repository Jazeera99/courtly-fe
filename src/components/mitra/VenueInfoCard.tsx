// src/components/mitra/VenueInfoCard.tsx
import React from 'react';

const VenueInfoCard: React.FC = () => {
  const venueInfo = {
    name: 'GOR Sidoarjo Sport Center',
    address: 'Jl. Pahlawan No. 45, Sidoarjo',
    phone: '(031) 8901234',
    operatingHours: '07:00 - 22:00',
    facilities: ['Futsal', 'Badminton', 'Parkir Luas', 'AC', 'Kantin']
  };

  return (
    <div className="venue-info-card">
      <div className="venue-header">
        <h2>{venueInfo.name}</h2>
        <div className="venue-status">
          <span className="status-indicator active"></span>
          <span>Venue Aktif</span>
        </div>
      </div>
      
      <div className="venue-details">
        <div className="detail-row">
          <span className="detail-icon">📍</span>
          <span>{venueInfo.address}</span>
        </div>
        <div className="detail-row">
          <span className="detail-icon">📞</span>
          <span>{venueInfo.phone}</span>
        </div>
        <div className="detail-row">
          <span className="detail-icon">🕒</span>
          <span>{venueInfo.operatingHours}</span>
        </div>
      </div>
      
      <div className="facilities-section">
        <h4>Fasilitas:</h4>
        <div className="facilities-tags">
          {venueInfo.facilities.map((facility, idx) => (
            <span key={idx} className="facility-tag">✓ {facility}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VenueInfoCard;