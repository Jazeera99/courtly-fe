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
    { id: 3, court: 'Lapangan Futsal 2', time: '20:00 - 21:00', customer: 'Bob Johnson', status: 'pending' }
  ];

  return (
    <div className="mitra-dashboard fullscreen-content">
      <VenueInfoCard />
      
      <div className="stats-grid">
        <StatsCard 
          icon="🏟️"
          value={venueStats.totalCourts.toString()}
          label="Total Lapangan"
          color="blue"
        />
        <StatsCard 
          icon="📅"
          value={venueStats.bookingsToday.toString()}
          label="Booking Hari Ini"
          color="green"
        />
        <StatsCard 
          icon="💰"
          value={venueStats.bookingsThisMonth.toString()}
          label="Booking Bulan Ini"
          color="purple"
        />
        <StatsCard 
          icon="💵"
          value={`Rp ${venueStats.totalRevenue.toLocaleString()}`}
          label="Pendapatan Bulan Ini"
          color="orange"
        />
      </div>

      <div className="dashboard-grid">
        <div className="booking-section">
          <h2>📅 Booking Hari Ini</h2>
          <BookingList bookings={todayBookings} />
        </div>
        
        <div className="quick-section">
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;