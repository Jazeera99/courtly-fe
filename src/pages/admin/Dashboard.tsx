// src/pages/admin/Dashboard.tsx
import React from 'react';
import StatsCard from '../../components/admin/StatsCard';
import UserTable from '../../components/admin/UserTable';
import DataTable from '../../components/admin/DataTable';
import QuickActions from '../../components/admin/QuickActions';
import '../../styles/AdminDashboard.css';

const Dashboard: React.FC = () => {
  const stats = {
    totalUsers: 1542,
    totalVenues: 89,
    totalBookings: 342,
    revenue: 154500000
  };

  const recentUsers = [
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john@example.com', 
      joinDate: '15 Jan 2024',
      status: 'active'
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      email: 'jane@example.com', 
      joinDate: '14 Jan 2024',
      status: 'active'
    },
    { 
      id: 3, 
      name: 'Bob Johnson', 
      email: 'bob@example.com', 
      joinDate: '13 Jan 2024',
      status: 'pending'
    },
    { 
      id: 4, 
      name: 'Alice Brown', 
      email: 'alice@example.com', 
      joinDate: '12 Jan 2024',
      status: 'active'
    },
    { 
      id: 5, 
      name: 'Charlie Wilson', 
      email: 'charlie@example.com', 
      joinDate: '11 Jan 2024',
      status: 'inactive'
    }
  ];

  const recentBookings = [
    { 
      id: 1, 
      user: 'John Doe', 
      venue: 'GOR Sidoarjo', 
      date: '16 Jan 2024', 
      time: '14:00 - 16:00',
      amount: 150000,
      status: 'confirmed'
    },
    { 
      id: 2, 
      user: 'Jane Smith', 
      venue: 'Balikpapan Padel', 
      date: '15 Jan 2024', 
      time: '18:00 - 20:00',
      amount: 250000,
      status: 'completed'
    },
    { 
      id: 3, 
      user: 'Bob Johnson', 
      venue: 'Stadion Utama', 
      date: '14 Jan 2024', 
      time: '10:00 - 12:00',
      amount: 120000,
      status: 'pending'
    },
    { 
      id: 4, 
      user: 'Alice Brown', 
      venue: 'Lapangan Futsal Merdeka', 
      date: '13 Jan 2024', 
      time: '19:00 - 21:00',
      amount: 180000,
      status: 'confirmed'
    }
  ];

  return (
    <div className="admin-dashboard" style={{ paddingRight: 50}}>
      {/* Mobile Header (hanya tampil di mobile) */}
      <div style={{
        display: 'none',
        '@media (max-width: 1024px)': {
          display: 'block',
          background: 'white',
          padding: '20px',
          borderRadius: '16px',
          marginBottom: '24px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
        }
      }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: '24px', 
          fontWeight: '800',
          color: '#111827'
        }}>
          Dashboard Admin
        </h1>
        <p style={{ 
          margin: '4px 0 0 0', 
          color: '#6b7280',
          fontSize: '14px'
        }}>
          Ringkasan aktivitas dan statistik sistem
        </p>
      </div>

      <div className="dashboard-header">
        <div className="header-left">
          <h1>Dashboard Admin</h1>
          <p className="header-subtitle">Ringkasan aktivitas dan statistik sistem</p>
        </div>
        
      </div>

      <div className="stats-grid">
        <StatsCard 
          icon="👥"
          value={stats.totalUsers.toLocaleString()}
          label="Total Pengguna"
          color="blue"
          trend="+12%"
        />
        <StatsCard 
          icon="🏟️"
          value={stats.totalVenues.toString()}
          label="Venue Terdaftar"
          color="green"
          trend="+8%"
        />
        <StatsCard 
          icon="📅"
          value={stats.totalBookings.toString()}
          label="Booking Bulan Ini"
          color="purple"
          trend="+23%"
        />
        <StatsCard 
          icon="💰"
          value={`Rp ${stats.revenue.toLocaleString()}`}
          label="Total Pendapatan"
          color="orange"
          trend="+18%"
        />
      </div>

      <div className="content-grid">
        <div className="content-card">
          <div className="card-header">
            <h2>
              <span style={{ fontSize: '24px' }}>👥</span>
              Pengguna Terbaru
            </h2>
            <button className="btn-view-all">
              <span>Lihat Semua</span>
              <span>→</span>
            </button>
          </div>
          <div className="table-container">
            <UserTable users={recentUsers} />
          </div>
        </div>

        <div className="content-card">
          <div className="card-header">
            <h2>
              <span style={{ fontSize: '24px' }}>📅</span>
              Booking Terbaru
            </h2>
            <button className="btn-view-all">
              <span>Lihat Semua</span>
              <span>→</span>
            </button>
          </div>
          <div className="table-container">
            <DataTable 
              headers={['Nama', 'Venue', 'Tanggal', 'Waktu', 'Jumlah', 'Status']}
              data={recentBookings.map(b => [
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="user-avatar">
                    {b.user.charAt(0)}
                  </div>
                  <span>{b.user}</span>
                </div>,
                b.venue,
                b.date,
                b.time,
                <strong>{`Rp ${b.amount.toLocaleString()}`}</strong>,
                <span className={`status-badge status-${b.status}`}>
                  {b.status === 'confirmed' ? 'Dikonfirmasi' : 
                   b.status === 'completed' ? 'Selesai' : 
                   b.status === 'pending' ? 'Menunggu' : b.status}
                </span>
              ])}
            />
          </div>
        </div>
      </div>

      <div className="quick-section">
        <h2>
          <span style={{ fontSize: '28px' }}>⚡</span>
          Aksi Cepat
        </h2>
        <QuickActions />
      </div>
    </div>
  );
};

export default Dashboard;