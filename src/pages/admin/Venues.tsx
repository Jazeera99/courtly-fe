import React, { useState } from 'react';
import '../../styles/AdminDashboard.css';

const AdminVenues: React.FC = () => {
  const [venues] = useState([
    { id: 1, name: 'GOR Sidoarjo', type: 'Badminton', location: 'Sidoarjo', price: 150000, status: 'active', capacity: 50 },
    { id: 2, name: 'Balikpapan Padel', type: 'Padel', location: 'Balikpapan', price: 250000, status: 'active', capacity: 20 },
    { id: 3, name: 'Stadion Utama', type: 'Sepak Bola', location: 'Jakarta', price: 500000, status: 'maintenance', capacity: 1000 },
    { id: 4, name: 'Lapangan Futsal Merdeka', type: 'Futsal', location: 'Bandung', price: 180000, status: 'active', capacity: 40 },
    { id: 5, name: 'Tennis Court BSD', type: 'Tennis', location: 'Tangerang', price: 200000, status: 'inactive', capacity: 30 },
    { id: 6, name: 'Basketball Hall', type: 'Basket', location: 'Surabaya', price: 120000, status: 'active', capacity: 60 },
    { id: 7, name: 'Swimming Pool Elite', type: 'Renang', location: 'Bali', price: 350000, status: 'active', capacity: 25 },
  ]);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return { bg: '#d1fae5', text: '#065f46', border: '#10b981' };
      case 'inactive': return { bg: '#f3f4f6', text: '#6b7280', border: '#9ca3af' };
      case 'maintenance': return { bg: '#fef3c7', text: '#92400e', border: '#f59e0b' };
      default: return { bg: '#f3f4f6', text: '#6b7280', border: '#9ca3af' };
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'active': return 'Aktif';
      case 'inactive': return 'Nonaktif';
      case 'maintenance': return 'Perbaikan';
      default: return status;
    }
  };

  return (
    <div className="admin-page" style={{ padding: 32 , paddingRight: 50}}>
      <div className="dashboard-header">
        <div className="header-left">
          <h1>Kelola Venue</h1>
          <p className="header-subtitle">Kelola semua venue olahraga yang terdaftar</p>
        </div>
        <div className="header-info">
          <button className="btn-manage" onClick={() => console.log('Tambah venue')}>
            + Tambah Venue Baru
          </button>
        </div>
      </div>

      <div className="stats-grid" style={{ marginBottom: 36 }}>
        <div className="stat-card blue">
          <div className="stat-header">
            <div className="stat-icon">🏟️</div>
            <span className="trend up">+5%</span>
          </div>
          <div className="stat-content">
            <h3>{venues.length}</h3>
            <p>Total Venue</p>
          </div>
          <div className="stat-footer">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-header">
            <div className="stat-icon">💰</div>
            <span className="trend up">+12%</span>
          </div>
          <div className="stat-content">
            <h3>Rp 1.6M</h3>
            <p>Pendapatan Bulan Ini</p>
          </div>
          <div className="stat-footer">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '70%' }}></div>
            </div>
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-header">
            <div className="stat-icon">👥</div>
            <span className="trend up">+8%</span>
          </div>
          <div className="stat-content">
            <h3>289</h3>
            <p>Penyewa Aktif</p>
          </div>
          <div className="stat-footer">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '90%' }}></div>
            </div>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-header">
            <div className="stat-icon">⭐</div>
            <span className="trend up">+15%</span>
          </div>
          <div className="stat-content">
            <h3>4.8</h3>
            <p>Rating Rata-rata</p>
          </div>
          <div className="stat-footer">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '96%' }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="content-card">
        <div className="card-header">
          <h2>
            <span style={{ fontSize: '24px' }}>📋</span>
            Daftar Venue
          </h2>
          <div style={{ display: 'flex', gap: 12 }}>
            <select style={{ padding: '10px 16px', borderRadius: 12, border: '2px solid #e5e7eb' }}>
              <option>Filter Tipe</option>
              <option>Semua</option>
              <option>Badminton</option>
              <option>Futsal</option>
              <option>Tennis</option>
            </select>
            <input 
              placeholder="Cari venue..." 
              style={{ padding: '10px 16px', borderRadius: 12, border: '2px solid #e5e7eb', width: 200 }}
            />
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nama Venue</th>
                <th>Tipe</th>
                <th>Lokasi</th>
                <th>Kapasitas</th>
                <th>Harga/Jam</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {venues.map((venue) => {
                const statusColor = getStatusColor(venue.status);
                return (
                  <tr key={venue.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                          width: 48,
                          height: 48,
                          borderRadius: 12,
                          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: 20
                        }}>
                          {venue.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{venue.name}</div>
                          <div style={{ fontSize: 12, color: '#6b7280' }}>ID: {venue.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{
                        padding: '6px 12px',
                        background: '#f3f4f6',
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 600
                      }}>
                        {venue.type}
                      </span>
                    </td>
                    <td>{venue.location}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 600 }}>{venue.capacity}</span>
                        <span style={{ fontSize: 12, color: '#6b7280' }}>orang</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 700, color: '#111827' }}>
                      Rp {venue.price.toLocaleString()}
                    </td>
                    <td>
                      <span 
                        style={{
                          padding: '8px 16px',
                          borderRadius: 20,
                          fontSize: 13,
                          fontWeight: 700,
                          background: statusColor.bg,
                          color: statusColor.text,
                          border: `1px solid ${statusColor.border}`,
                          display: 'inline-block',
                          minWidth: 100
                        }}
                      >
                        {getStatusText(venue.status)}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button 
                          className="btn-manage"
                          style={{ padding: '8px 16px', fontSize: 13 }}
                          onClick={() => console.log('Edit venue', venue.id)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn-manage"
                          style={{ background: '#f59e0b', padding: '8px 16px', fontSize: 13 }}
                          onClick={() => console.log('Detail venue', venue.id)}
                        >
                          Detail
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="content-grid" style={{ marginTop: 36 }}>
        <div className="content-card">
          <h2 style={{ marginBottom: 20 }}>📍 Distribusi Venue</h2>
          <div style={{ height: 200, display: 'flex', alignItems: 'flex-end', gap: 16, padding: 20 }}>
            {[
              { city: 'Jakarta', count: 3, color: '#3b82f6' },
              { city: 'Bandung', count: 2, color: '#8b5cf6' },
              { city: 'Surabaya', count: 1, color: '#10b981' },
              { city: 'Bali', count: 1, color: '#f59e0b' },
            ].map((item, index) => (
              <div key={index} style={{ flex: 1, textAlign: 'center' }}>
                <div 
                  style={{ 
                    height: item.count * 30, 
                    background: item.color,
                    borderRadius: '8px 8px 0 0',
                    marginBottom: 8
                  }}
                ></div>
                <div style={{ fontWeight: 600 }}>{item.city}</div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>{item.count} venue</div>
              </div>
            ))}
          </div>
        </div>

        <div className="content-card">
          <h2 style={{ marginBottom: 20 }}>🏆 Venue Terpopuler</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {venues.slice(0, 3).map((venue, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: '#f8fafc',
                borderRadius: 12
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ 
                    width: 32, 
                    height: 32, 
                    borderRadius: 8, 
                    background: '#3b82f6', 
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 'bold'
                  }}>
                    #{index + 1}
                  </span>
                  <span style={{ fontWeight: 600 }}>{venue.name}</span>
                </div>
                <span style={{ fontWeight: 700, color: '#10b981' }}>42 booking</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminVenues;