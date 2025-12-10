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
    { id: 1, name: 'John Doe', email: 'john@example.com', joinDate: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', joinDate: '2024-01-14' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', joinDate: '2024-01-13' }
  ];

  const recentBookings = [
    { id: 1, user: 'John Doe', venue: 'GOR Sidoarjo', date: '2024-01-16', amount: 150000 },
    { id: 2, user: 'Jane Smith', venue: 'Balikpapan Padel', date: '2024-01-15', amount: 250000 }
  ];

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard Admin</h1>
        <div className="header-info">
          <span className="admin-role">Super Admin</span>
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
            <h2>👥 Pengguna Baru</h2>
            <button className="btn-view-all">Lihat Semua</button>
          </div>
          <UserTable users={recentUsers} />
        </div>

        <div className="content-card">
          <div className="card-header">
            <h2>📅 Booking Terbaru</h2>
            <button className="btn-view-all">Lihat Semua</button>
          </div>
          <DataTable 
            headers={['Pengguna', 'Venue', 'Tanggal', 'Jumlah']}
            data={recentBookings.map(b => [
              b.user,
              b.venue,
              b.date,
              `Rp ${b.amount.toLocaleString()}`
            ])}
          />
        </div>
      </div>

      <div className="quick-section">
        <QuickActions />
      </div>
    </div>
  );
};

export default Dashboard;