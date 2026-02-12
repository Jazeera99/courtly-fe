import React from 'react';
import '../../styles/PartnerDashboard.css';

interface VenueInfoCardProps {
  venue: any;
  loading: boolean;
}

const VenueInfoCard: React.FC<VenueInfoCardProps> = ({ venue, loading }) => {
  if (loading) return <div className="venue-info-card animate-pulse">Memuat data venue...</div>;
 
  return (
    <div className="venue-info-card">
      <div className="venue-info-header">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {/* NAMA GOR & DROPDOWN LAPANGAN */}
          <h2 style={{ margin: 0 }}>🏟️ {venue?.name || "GOR Sport Center"}</h2>
          <select 
            className="field-dropdown-mini"
            style={{ padding: '4px', borderRadius: '4px', fontSize: '0.8rem', border: '1px solid #ddd' }}
          >
            <option>Semua Lapangan ({venue?.fields?.length || 0})</option>
            {venue?.fields?.map((field: any) => (
              <option key={field.id} value={field.id}>
                {/* Cek apakah field.price atau field.price_per_hour yang benar di API kamu */}
                {field.name} - Rp {(field.pricePerHour || field.price || 0).toLocaleString()}
              </option>
            ))}
          </select>
        </div>
        <span className="venue-status">● Buka</span>
      </div>
      
      <div className="venue-details">
        <div className="detail-item">
          <div className="detail-icon">👤</div>
          <div>
            <div className="detail-label">Pemilik</div>
            <div className="detail-value">{venue?.users?.name || 'Admin'}</div>
          </div>
        </div>
        
        <div className="detail-item">
          <div className="detail-icon">📍</div>
          <div>
            <div className="detail-label">Alamat</div>
            <div className="detail-value">{venue?.address ? `${venue.address}, ${venue.city || ''}` : 'Alamat belum tersedia'}</div>
          </div>
        </div>
        
        <div className="detail-item">
          <div className="detail-icon">📞</div>
          <div>
            <div className="detail-label">Telepon</div>
            <div className="detail-value">{venue?.users?.phone || '-'}</div>
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