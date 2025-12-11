// src/pages/mitra/Dashboard.tsx
import React from 'react';
import StatsCard from '../../components/mitra/StatsCard';
import BookingList from '../../components/mitra/BookingList';
import VenueInfoCard from '../../components/mitra/VenueInfoCard';
import QuickActions from '../../components/mitra/QuickActions';
import '../../styles/PartnerDashboard.css';

const Dashboard: React.FC = () => {
  const venueStats = {
    totalCourts: 4,
    bookingsToday: 8,
    bookingsThisMonth: 124,
    totalRevenue: 42500000
  };

  const todayBookings = [
    { id: 1, court: 'Lapangan Futsal 1', time: '16:00 - 17:00', customer: 'John Doe', status: 'confirmed' },
    { id: 2, court: 'Lapangan Badminton A', time: '18:00 - 19:00', customer: 'Jane Smith', status: 'confirmed' },
    { id: 3, court: 'Lapangan Futsal 2', time: '20:00 - 21:00', customer: 'Bob Johnson', status: 'pending' },
    { id: 4, court: 'Lapangan Badminton B', time: '19:00 - 20:00', customer: 'Alice Brown', status: 'confirmed' },
    { id: 5, court: 'Lapangan Basket', time: '21:00 - 22:00', customer: 'Charlie Wilson', status: 'confirmed' },
  ];

  const recentBookings = [
    { id: 1, court: 'Lapangan Futsal 1', customer: 'John Doe', date: '2024-01-15', time: '16:00-17:00', status: 'confirmed', price: 150000 },
    { id: 2, court: 'Lapangan Badminton A', customer: 'Jane Smith', date: '2024-01-15', time: '18:00-19:00', status: 'confirmed', price: 80000 },
    { id: 3, court: 'Lapangan Futsal 2', customer: 'Bob Johnson', date: '2024-01-16', time: '20:00-21:00', status: 'pending', price: 150000 },
  ];

  return (
    <div className="mitra-dashboard fullscreen-content">
      <div className="dashboard-content">
        <VenueInfoCard />
        
        <div className="stats-grid">
          <StatsCard 
            icon="🏟️"
            value={venueStats.totalCourts.toString()}
            label="Total Lapangan"
            color="blue"
            trend="+1"
          />
          <StatsCard 
            icon="📅"
            value={venueStats.bookingsToday.toString()}
            label="Booking Hari Ini"
            color="green"
            trend="+12%"
          />
          <StatsCard 
            icon="💰"
            value={venueStats.bookingsThisMonth.toString()}
            label="Booking Bulan Ini"
            color="purple"
            trend="+8%"
          />
          <StatsCard 
            icon="💵"
            value={`Rp ${venueStats.totalRevenue.toLocaleString()}`}
            label="Pendapatan Bulan Ini"
            color="orange"
            trend="+15%"
          />
        </div>

        <div className="dashboard-grid">
          <div className="booking-section">
            <div className="section-header">
              <h2>📅 Booking Hari Ini</h2>
              <a href="/mitra/bookings" className="view-all">
                Lihat Semua →
              </a>
            </div>
            <BookingList bookings={todayBookings} />
          </div>
          
          <div className="quick-section">
            <div className="section-header">
              <h2>⚡ Aksi Cepat</h2>
            </div>
            <QuickActions />
          </div>
        </div>

        <div className="booking-section" style={{ marginTop: '32px' }}>
          <div className="section-header">
            <h2>📋 Booking Terbaru</h2>
          </div>
          <div className="data-table">
            <div className="table-header">
              <div>ID</div>
              <div>Lapangan</div>
              <div>Pelanggan</div>
              <div>Tanggal</div>
              <div>Waktu</div>
              <div>Status</div>
              <div>Harga</div>
              <div>Aksi</div>
            </div>
            {recentBookings.map((booking) => (
              <div key={booking.id} className="table-row">
                <div className="table-cell">#{booking.id}</div>
                <div className="table-cell primary">{booking.court}</div>
                <div className="table-cell">{booking.customer}</div>
                <div className="table-cell">{booking.date}</div>
                <div className="table-cell">{booking.time}</div>
                <div className="table-cell">
                  <span className={`booking-status status-${booking.status}`}>
                    {booking.status === 'confirmed' ? 'Dikonfirmasi' : 'Menunggu'}
                  </span>
                </div>
                <div className="table-cell primary">Rp {booking.price.toLocaleString()}</div>
                <div className="table-cell">
                  <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.875rem' }}>
                    Detail
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;