// src/pages/mitra/Courts.tsx
import React, { useState } from 'react';
import { Edit, Trash2, Plus, Settings, Calendar } from 'lucide-react';
import '../../styles/PartnerDashboard.css';

interface Court {
  id: number;
  name: string;
  type: 'futsal' | 'badminton' | 'basket' | 'tennis' | 'voli';
  price: number;
  status: 'available' | 'maintenance' | 'booked';
  capacity: number;
  size: string;
  description: string;
  bookingsToday: number;
}

const MitraCourts: React.FC = () => {
  const [courts, setCourts] = useState<Court[]>([
    { id: 1, name: 'Lapangan Futsal 1', type: 'futsal', price: 150000, status: 'available', capacity: 10, size: '25m x 15m', description: 'Lapangan futsal standar internasional', bookingsToday: 3 },
    { id: 2, name: 'Lapangan Futsal 2', type: 'futsal', price: 150000, status: 'booked', capacity: 10, size: '25m x 15m', description: 'Lapangan futsal dengan lampu LED', bookingsToday: 5 },
    { id: 3, name: 'Lapangan Badminton A', type: 'badminton', price: 80000, status: 'available', capacity: 4, size: '13.4m x 6.1m', description: 'Lapangan badminton dengan lantai kayu', bookingsToday: 2 },
    { id: 4, name: 'Lapangan Badminton B', type: 'badminton', price: 80000, status: 'maintenance', capacity: 4, size: '13.4m x 6.1m', description: 'Lapangan badminton sedang perawatan', bookingsToday: 0 },
    { id: 5, name: 'Lapangan Basket', type: 'basket', price: 120000, status: 'available', capacity: 20, size: '28m x 15m', description: 'Lapangan basket outdoor', bookingsToday: 1 },
    { id: 6, name: 'Lapangan Tennis', type: 'tennis', price: 200000, status: 'available', capacity: 4, size: '23.77m x 8.23m', description: 'Lapangan tennis dengan permukaan hardcourt', bookingsToday: 0 },
  ]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'futsal': return '⚽';
      case 'badminton': return '🏸';
      case 'basket': return '🏀';
      case 'tennis': return '🎾';
      case 'voli': return '🏐';
      default: return '🏟️';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'futsal': return '#3b82f6';
      case 'badminton': return '#10b981';
      case 'basket': return '#ef4444';
      case 'tennis': return '#8b5cf6';
      case 'voli': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return { bg: '#d1fae5', text: '#065f46' };
      case 'booked': return { bg: '#dbeafe', text: '#1e40af' };
      case 'maintenance': return { bg: '#fee2e2', text: '#991b1b' };
      default: return { bg: '#f3f4f6', text: '#6b7280' };
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Tersedia';
      case 'booked': return 'Dipesan';
      case 'maintenance': return 'Perawatan';
      default: return status;
    }
  };

  const handleDeleteCourt = (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus lapangan ini?')) {
      setCourts(courts.filter(court => court.id !== id));
    }
  };

  return (
    <div className="mitra-page fullscreen-content">
      <div className="page-content">
        <div className="page-header">
          <h1>🏟️ Kelola Lapangan</h1>
          <p>Kelola semua lapangan di venue Anda</p>
        </div>

        {/* Summary Cards */}
        <div className="grid-4" style={{ marginBottom: '32px' }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🏟️</div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '4px' }}>Total Lapangan</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>{courts.length}</div>
          </div>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>✅</div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '4px' }}>Tersedia</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
              {courts.filter(c => c.status === 'available').length}
            </div>
          </div>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📅</div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '4px' }}>Booking Hari Ini</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
              {courts.reduce((sum, court) => sum + court.bookingsToday, 0)}
            </div>
          </div>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔧</div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '4px' }}>Dalam Perawatan</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
              {courts.filter(c => c.status === 'maintenance').length}
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <select style={{
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              backgroundColor: 'white',
              fontSize: '0.95rem',
              cursor: 'pointer'
            }}>
              <option value="">Semua Jenis</option>
              <option value="futsal">Futsal</option>
              <option value="badminton">Badminton</option>
              <option value="basket">Basket</option>
              <option value="tennis">Tennis</option>
            </select>
            
            <select style={{
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              backgroundColor: 'white',
              fontSize: '0.95rem',
              cursor: 'pointer'
            }}>
              <option value="">Semua Status</option>
              <option value="available">Tersedia</option>
              <option value="booked">Dipesan</option>
              <option value="maintenance">Perawatan</option>
            </select>
          </div>

          <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={20} />
            Tambah Lapangan Baru
          </button>
        </div>

        {/* Courts Grid */}
        <div className="grid-3">
          {courts.map((court) => {
            const statusColors = getStatusColor(court.status);
            const typeColor = getTypeColor(court.type);
            
            return (
              <div key={court.id} style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                border: '1px solid #e5e7eb',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative'
              }}>
                {/* Header with Icon */}
                <div style={{
                  backgroundColor: typeColor + '20',
                  padding: '24px',
                  textAlign: 'center',
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  <div style={{
                    fontSize: '3rem',
                    marginBottom: '12px',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                  }}>
                    {getTypeIcon(court.type)}
                  </div>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: '#1f2937',
                    marginBottom: '8px'
                  }}>
                    {court.name}
                  </h3>
                  <div style={{
                    display: 'inline-block',
                    padding: '6px 16px',
                    borderRadius: '20px',
                    backgroundColor: statusColors.bg,
                    color: statusColors.text,
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    {getStatusText(court.status)}
                  </div>
                </div>

                {/* Details */}
                <div style={{ padding: '24px' }}>
                  <div style={{ marginBottom: '20px' }}>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '8px' }}>Deskripsi</p>
                    <p style={{ color: '#1f2937', fontSize: '0.95rem', lineHeight: '1.6' }}>
                      {court.description}
                    </p>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px',
                    marginBottom: '20px'
                  }}>
                    <div>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '4px' }}>Kapasitas</p>
                      <p style={{ fontWeight: '600', color: '#1f2937' }}>{court.capacity} orang</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '4px' }}>Ukuran</p>
                      <p style={{ fontWeight: '600', color: '#1f2937' }}>{court.size}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '4px' }}>Booking Hari Ini</p>
                      <p style={{ fontWeight: '600', color: '#1f2937' }}>{court.bookingsToday} booking</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '4px' }}>Harga/Jam</p>
                      <p style={{ fontWeight: '600', color: '#1f2937', fontSize: '1.1rem' }}>
                        Rp {court.price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    borderTop: '1px solid #e5e7eb',
                    paddingTop: '20px'
                  }}>
                    <button className="btn btn-secondary" style={{ flex: 1, padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <Calendar size={16} />
                      Jadwal
                    </button>
                    <button className="btn btn-secondary" style={{ flex: 1, padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <Edit size={16} />
                      Edit
                    </button>
                    <button 
                      className="btn btn-danger" 
                      style={{ flex: 1, padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                      onClick={() => handleDeleteCourt(court.id)}
                    >
                      <Trash2 size={16} />
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MitraCourts;