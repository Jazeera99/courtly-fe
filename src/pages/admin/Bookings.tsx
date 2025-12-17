import React, { useState } from 'react';
import '../../styles/AdminDashboard.css';

const AdminBookings: React.FC = () => {
  const [bookings] = useState([
    { id: 1, user: 'Ahmad Rizki', venue: 'GOR Sidoarjo', date: '2024-01-20', time: '14:00 - 16:00', status: 'confirmed', amount: 150000 },
    { id: 2, user: 'Budi Santoso', venue: 'Balikpapan Padel', date: '2024-01-19', time: '18:00 - 20:00', status: 'completed', amount: 250000 },
    { id: 3, user: 'Citra Dewi', venue: 'Stadion Utama', date: '2024-01-18', time: '10:00 - 12:00', status: 'pending', amount: 120000 },
    { id: 4, user: 'Dian Permata', venue: 'Lapangan Futsal Merdeka', date: '2024-01-17', time: '19:00 - 21:00', status: 'cancelled', amount: 180000 },
    { id: 5, user: 'Eko Pratama', venue: 'Tennis Court BSD', date: '2024-01-16', time: '08:00 - 10:00', status: 'confirmed', amount: 200000 },
    { id: 6, user: 'Fani Anggraini', venue: 'Badminton Hall', date: '2024-01-15', time: '15:00 - 17:00', status: 'completed', amount: 130000 },
    { id: 7, user: 'Gilang Ramadhan', venue: 'Basketball Court', date: '2024-01-14', time: '20:00 - 22:00', status: 'pending', amount: 175000 },
  ]);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'confirmed': return { bg: '#d1fae5', text: '#065f46', border: '#10b981' };
      case 'completed': return { bg: '#dbeafe', text: '#1e40af', border: '#3b82f6' };
      case 'pending': return { bg: '#fef3c7', text: '#92400e', border: '#f59e0b' };
      case 'cancelled': return { bg: '#fee2e2', text: '#991b1b', border: '#ef4444' };
      default: return { bg: '#f3f4f6', text: '#6b7280', border: '#9ca3af' };
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'confirmed': return 'Dikonfirmasi';
      case 'completed': return 'Selesai';
      case 'pending': return 'Menunggu';
      case 'cancelled': return 'Dibatalkan';
      default: return status;
    }
  };

  return (
    <div className="admin-page" style={{ padding: 32 , paddingRight: 50}}>
      <div className="dashboard-header">
        <div className="header-left">
          <h1>Kelola Booking</h1>
          <p className="header-subtitle">Kelola semua pemesanan venue olahraga</p>
        </div>
        <div className="header-info">
          <button className="btn-manage" onClick={() => console.log('Tambah booking')}>
            + Tambah Booking
          </button>
        </div>
      </div>

      <div className="content-card" style={{ marginTop: 24 }}>
        <div className="card-header">
          <h2>
            <span style={{ fontSize: '24px' }}>📅</span>
            Daftar Booking
          </h2>
          <div style={{ display: 'flex', gap: 12 }}>
            <select style={{ padding: '10px 16px', borderRadius: 12, border: '2px solid #e5e7eb' }}>
              <option>Filter Status</option>
              <option>Semua</option>
              <option>Menunggu</option>
              <option>Dikonfirmasi</option>
              <option>Selesai</option>
            </select>
            <input 
              type="date" 
              style={{ padding: '10px 16px', borderRadius: 12, border: '2px solid #e5e7eb' }}
            />
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Pengguna</th>
                <th>Venue</th>
                <th>Tanggal & Waktu</th>
                <th>Jumlah</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => {
                const statusColor = getStatusColor(booking.status);
                return (
                  <tr key={booking.id}>
                    <td style={{ fontWeight: 600 }}>#{booking.id}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div className="user-avatar">
                          {booking.user.charAt(0)}
                        </div>
                        <span style={{ fontWeight: 600 }}>{booking.user}</span>
                      </div>
                    </td>
                    <td>{booking.venue}</td>
                    <td>
                      <div>
                        <div style={{ fontWeight: 600 }}>{booking.date}</div>
                        <div style={{ fontSize: 12, color: '#6b7280' }}>{booking.time}</div>
                      </div>
                    </td>
                    <td style={{ fontWeight: 700, color: '#111827' }}>
                      Rp {booking.amount.toLocaleString()}
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
                          minWidth: 120
                        }}
                      >
                        {getStatusText(booking.status)}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button 
                          className="btn-manage"
                          style={{ background: '#10b981', padding: '8px 16px', fontSize: 13 }}
                          onClick={() => console.log('Detail booking', booking.id)}
                        >
                          Detail
                        </button>
                        <button 
                          className="btn-manage"
                          style={{ background: '#ef4444', padding: '8px 16px', fontSize: 13 }}
                          onClick={() => console.log('Hapus booking', booking.id)}
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginTop: 24,
          padding: '16px 24px',
          borderTop: '1px solid #e5e7eb'
        }}>
          <div style={{ color: '#6b7280', fontSize: 14 }}>
            Menampilkan 1-7 dari 7 booking
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8 }}>←</button>
            <button style={{ padding: '8px 12px', background: '#3b82f6', color: 'white', borderRadius: 8 }}>1</button>
            <button style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8 }}>→</button>
          </div>
        </div>
      </div>

      <div className="content-grid" style={{ marginTop: 36 }}>
        <div className="content-card">
          <h2 style={{ marginBottom: 20 }}>📊 Statistik Booking</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { label: 'Total Booking Bulan Ini', value: '342', color: '#3b82f6' },
              { label: 'Booking Dikonfirmasi', value: '289', color: '#10b981' },
              { label: 'Booking Menunggu', value: '42', color: '#f59e0b' },
              { label: 'Booking Dibatalkan', value: '11', color: '#ef4444' },
            ].map((stat, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '16px',
                background: '#f8fafc',
                borderRadius: 12
              }}>
                <span style={{ fontWeight: 500 }}>{stat.label}</span>
                <span style={{ 
                  fontSize: 24, 
                  fontWeight: 800, 
                  color: stat.color 
                }}>
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="content-card">
          <h2 style={{ marginBottom: 20 }}>🚀 Aksi Cepat</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button 
              className="action-btn" 
              style={{ justifyContent: 'flex-start', padding: '16px 24px', color: 'black' }}
              onClick={() => console.log('Konfirmasi booking')}
            >
              ✅ Konfirmasi Booking Menunggu
            </button>
            <button 
              className="action-btn" 
              style={{ justifyContent: 'flex-start', padding: '16px 24px', color: 'black' }}
              onClick={() => console.log('Export data')}
            >
              📥 Export Data Booking
            </button>
            <button 
              className="action-btn" 
              style={{ justifyContent: 'flex-start', padding: '16px 24px', color: 'black' }}
              onClick={() => console.log('Generate laporan')}
            >
              📄 Generate Laporan Bulanan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;