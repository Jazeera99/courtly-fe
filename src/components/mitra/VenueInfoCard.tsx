// src/components/mitra/VenueInfoCard.tsx
import React from 'react';
import '../../styles/PartnerDashboard.css';

const VenueInfoCard: React.FC = () => {
  return (
    <div className="venue-info-card">
      <div className="venue-info-header">
        <h2>GOR Sidonjo Sport Center</h2>
        <span className="venue-status">● Buka</span>
      </div>
      
      <div className="venue-details">
        <div className="detail-item">
          <div className="detail-icon">👤</div>
          <div>
            <div className="detail-label">Pemilik</div>
            <div className="detail-value">Vosue Akiti</div>
          </div>
        </div>
        
        <div className="detail-item">
          <div className="detail-icon">📍</div>
          <div>
            <div className="detail-label">Alamat</div>
            <div className="detail-value">Jl. Shisham Ma No. 45, Sidonjo</div>
          </div>
        </div>
        
        <div className="detail-item">
          <div className="detail-icon">📞</div>
          <div>
            <div className="detail-label">Telepon</div>
            <div className="detail-value">0019 990124</div>
          </div>
        </div>
        
        <div className="detail-item">
          <div className="detail-icon">🕒</div>
          <div>
            <div className="detail-label">Jam Operasional</div>
            <div className="detail-value">07:00 - 22:00</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueInfoCard;