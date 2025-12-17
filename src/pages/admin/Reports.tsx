import React, { useState } from 'react';
import '../../styles/AdminDashboard.css';

const AdminReports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState('monthly');
  
  const reportData = {
    monthly: [
      { month: 'Jan 2024', revenue: 154500000, bookings: 342, users: 1542 },
      { month: 'Dec 2023', revenue: 132800000, bookings: 298, users: 1289 },
      { month: 'Nov 2023', revenue: 121300000, bookings: 265, users: 1124 },
      { month: 'Oct 2023', revenue: 118700000, bookings: 241, users: 1045 },
      { month: 'Sep 2023', revenue: 105600000, bookings: 218, users: 987 },
    ],
    venuePerformance: [
      { venue: 'GOR Sidoarjo', bookings: 89, revenue: 24500000, occupancy: '85%' },
      { venue: 'Balikpapan Padel', bookings: 76, revenue: 32100000, occupancy: '92%' },
      { venue: 'Stadion Utama', bookings: 54, revenue: 18700000, occupancy: '68%' },
      { venue: 'Lapangan Futsal Merdeka', bookings: 48, revenue: 15600000, occupancy: '72%' },
      { venue: 'Tennis Court BSD', bookings: 35, revenue: 12400000, occupancy: '65%' },
    ],
    userActivity: [
      { segment: 'Pengguna Baru', count: 254, growth: '+12%' },
      { segment: 'Pengguna Aktif', count: 1245, growth: '+8%' },
      { segment: 'Pengguna Premium', count: 289, growth: '+15%' },
      { segment: 'Pengguna Inaktif', count: 56, growth: '-5%' },
    ]
  };

  return (
    <div className="admin-page" style={{ padding: 32 , paddingRight: 50}}>
      <div className="dashboard-header">
        <div className="header-left">
          <h1>Laporan & Analytics</h1>
          <p className="header-subtitle">Analisis data dan laporan performa sistem</p>
        </div>
        <div className="header-info">
          <button className="btn-manage" onClick={() => console.log('Export laporan')}>
            📥 Export Laporan
          </button>
        </div>
      </div>

      <div className="stats-grid" style={{ marginBottom: 36 }}>
        <div className="stat-card blue">
          <div className="stat-header">
            <div className="stat-icon">💰</div>
            <span className="trend up">+18%</span>
          </div>
          <div className="stat-content">
            <h3>Rp 154.5M</h3>
            <p>Pendapatan Bulan Ini</p>
          </div>
          <div className="stat-footer">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '82%' }}></div>
            </div>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-header">
            <div className="stat-icon">📈</div>
            <span className="trend up">+12%</span>
          </div>
          <div className="stat-content">
            <h3>342</h3>
            <p>Booking Bulan Ini</p>
          </div>
          <div className="stat-footer">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-header">
            <div className="stat-icon">👥</div>
            <span className="trend up">+8%</span>
          </div>
          <div className="stat-content">
            <h3>1,542</h3>
            <p>Total Pengguna</p>
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
            <span className="trend up">+5%</span>
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

      <div className="content-card" style={{ marginBottom: 36 }}>
        <div className="card-header">
          <h2>
            <span style={{ fontSize: '24px' }}>📊</span>
            Laporan Pendapatan
          </h2>
          <div style={{ display: 'flex', gap: 12 }}>
            <button 
              style={{ 
                padding: '10px 20px', 
                borderRadius: 12, 
                border: selectedReport === 'monthly' ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                background: selectedReport === 'monthly' ? '#eff6ff' : 'white',
                color: selectedReport === 'monthly' ? '#3b82f6' : '#374151',
                fontWeight: 600
              }}
              onClick={() => setSelectedReport('monthly')}
            >
              Bulanan
            </button>
            <button 
              style={{ 
                padding: '10px 20px', 
                borderRadius: 12, 
                border: selectedReport === 'venue' ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                background: selectedReport === 'venue' ? '#eff6ff' : 'white',
                color: selectedReport === 'venue' ? '#3b82f6' : '#374151',
                fontWeight: 600
              }}
              onClick={() => setSelectedReport('venue')}
            >
              Performa Venue
            </button>
            <button 
              style={{ 
                padding: '10px 20px', 
                borderRadius: 12, 
                border: selectedReport === 'user' ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                background: selectedReport === 'user' ? '#eff6ff' : 'white',
                color: selectedReport === 'user' ? '#3b82f6' : '#374151',
                fontWeight: 600
              }}
              onClick={() => setSelectedReport('user')}
            >
              Aktivitas Pengguna
            </button>
          </div>
        </div>

        {selectedReport === 'monthly' && (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Bulan</th>
                  <th>Pendapatan</th>
                  <th>Total Booking</th>
                  <th>Pengguna Baru</th>
                  <th>Growth</th>
                </tr>
              </thead>
              <tbody>
                {reportData.monthly.map((month, index) => (
                  <tr key={index}>
                    <td style={{ fontWeight: 600 }}>{month.month}</td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#111827' }}>
                        Rp {month.revenue.toLocaleString()}
                      </div>
                    </td>
                    <td>{month.bookings}</td>
                    <td>{month.users}</td>
                    <td>
                      <span className={`trend ${index < 2 ? 'up' : 'down'}`}>
                        {index < 2 ? '+12%' : '-5%'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedReport === 'venue' && (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Venue</th>
                  <th>Total Booking</th>
                  <th>Pendapatan</th>
                  <th>Tingkat Okupansi</th>
                  <th>Performa</th>
                </tr>
              </thead>
              <tbody>
                {reportData.venuePerformance.map((venue, index) => (
                  <tr key={index}>
                    <td style={{ fontWeight: 600 }}>{venue.venue}</td>
                    <td>{venue.bookings}</td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#111827' }}>
                        Rp {venue.revenue.toLocaleString()}
                      </div>
                    </td>
                    <td>{venue.occupancy}</td>
                    <td>
                      <span className={`trend ${index < 2 ? 'up' : 'down'}`}>
                        {index < 2 ? 'Tinggi' : 'Sedang'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedReport === 'user' && (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Segment Pengguna</th>
                  <th>Jumlah</th>
                  <th>Growth</th>
                  <th>Kontribusi Revenue</th>
                </tr>
              </thead>
              <tbody>
                {reportData.userActivity.map((segment, index) => (
                  <tr key={index}>
                    <td style={{ fontWeight: 600 }}>{segment.segment}</td>
                    <td>{segment.count}</td>
                    <td>
                      <span className={`trend ${segment.growth.startsWith('+') ? 'up' : 'down'}`}>
                        {segment.growth}
                      </span>
                    </td>
                    <td>
                      {index === 2 ? 'Rp 98.5M' : index === 0 ? 'Rp 12.3M' : 'Rp 43.7M'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="content-grid">
        <div className="content-card">
          <h2 style={{ marginBottom: 20 }}>📈 Grafik Pendapatan</h2>
          <div style={{ height: 300, position: 'relative', padding: 20 }}>
            <div style={{ 
              position: 'absolute', 
              bottom: 0, 
              left: 0, 
              right: 0, 
              display: 'flex', 
              alignItems: 'flex-end', 
              gap: 40,
              padding: '0 40px'
            }}>
              {[80, 120, 95, 140, 110, 160, 135].map((height, index) => (
                <div key={index} style={{ textAlign: 'center', flex: 1 }}>
                  <div 
                    style={{ 
                      height: `${height}px`, 
                      background: 'linear-gradient(to top, #3b82f6, #8b5cf6)',
                      borderRadius: '8px 8px 0 0',
                      marginBottom: 8
                    }}
                  ></div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'][index]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="content-card" >
          <h2 style={{ marginBottom: 20 }}>🎯 Target & Pencapaian</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { label: 'Target Pendapatan', target: 'Rp 200M', current: 'Rp 154.5M', progress: 77 },
              { label: 'Target Pengguna Baru', target: '300', current: '254', progress: 85 },
              { label: 'Target Booking', target: '400', current: '342', progress: 85 },
              { label: 'Kepuasan Pengguna', target: '4.8', current: '4.6', progress: 96 },
            ].map((item, index) => (
              <div key={index}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontWeight: 600 }}>{item.label}</span>
                  <span style={{ fontWeight: 700, color: '#111827' }}>
                    {item.current} / {item.target}
                  </span>
                </div>
                <div style={{ 
                  height: 8, 
                  background: '#e5e7eb', 
                  borderRadius: 4,
                  overflow: 'hidden'
                }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                      width: `${item.progress}%`,
                      borderRadius: 4
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;