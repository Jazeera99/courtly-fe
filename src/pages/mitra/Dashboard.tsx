import React from 'react';
import { useQuery } from '@apollo/client';
import StatsCard from '../../components/mitra/StatsCard';
import BookingList from '../../components/mitra/BookingList';
import VenueInfoCard from '../../components/mitra/VenueInfoCard';
import QuickActions from '../../components/mitra/QuickActions';
import { GET_PARTNER_COURTS, GET_VENUE_PROFILE, GET_PARTNER_STATS } from '../../graphql/queries';
import '../../styles/PartnerDashboard.css';

const Dashboard: React.FC = () => {
  // Gunakan venueId (I besar) sesuai dengan AuthPage.tsx Anda sebelumnya
  const venueId = localStorage.getItem('venueId'); 

  const { data: venueData, loading: venueLoading } = useQuery(GET_VENUE_PROFILE, {
    variables: { venueId: venueId || "" },
    skip: !venueId
  });

  const { data: statsData, loading: statsLoading, refetch } = useQuery(GET_PARTNER_STATS, {
    variables: { venueId: venueId || "", timeRange: "month" },
    skip: !venueId,
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first"
  });

  const { data: courtsData } = useQuery(GET_PARTNER_COURTS, {
    variables: { venueId: venueId || "" },
    skip: !venueId
  });

  // Mapping data dari backend
  const stats = statsData?.getPartnerStats?.stats;
  const transactions = statsData?.getPartnerStats?.transactions || [];
  const venueInfo = venueData?.getVenueProfile;
  const courts = courtsData?.getPartnerCourts || [];

  return (
    <div className="mitra-dashboard fullscreen-content">
      <div className="page-content">
        <VenueInfoCard 
          venue={{
            name: venueInfo?.ownerName || "Venue Anda", // Di Prisma Anda, ini ownerName
            address: venueInfo?.address || "Alamat belum diatur",
            city: venueInfo?.city || "",
            users: { 
              name: venueInfo?.ownerName || "Admin", 
              phone: venueInfo?.phone || "-" 
            },
            fields: courts || []
          }} 
          loading={venueLoading} 
        />

        <div className="stats-grid">
          {/* Ambil dari prisma: count fields */}
          <StatsCard 
            icon="🏟️"
            value={stats?.totalCourts?.toString() || "0"}
            label="Total Lapangan"
            color="blue"
            trend="+1"
          />
          {/* Ambil dari prisma: count reservations where created_at = today */}
          <StatsCard 
            icon="📅"
            value={stats?.bookingsToday?.toString() || "0"}
            label="Booking Hari Ini"
            color="green"
            trend={stats?.growth ? `${stats.growth}%` : undefined}
          />
          {/* Ambil dari stats.totalBookings (karena query kita timeRange: "month") */}
          <StatsCard 
            icon="💰"
            value={stats?.totalBookings?.toString() || "0"}
            label="Booking Bulan Ini"
            color="purple"
          />
          {/* Ambil dari prisma: sum final_amount */}
          <StatsCard 
            icon="💵"
            value={`Rp ${(stats?.totalRevenue || 0).toLocaleString('id-ID')}`}
            label="Pendapatan Bulan Ini"
            color="orange"
            trend={stats?.growth ? `${stats.growth}%` : undefined}
          />
        </div>

        {/* ... bagian dashboard-grid (BookingList & QuickActions) tetap sama ... */}
        
        <div className="content-card" style={{ marginTop: '32px' }}>
          <div className="section-header">
            <h2>📋 Transaksi Terbaru</h2>
          </div>
          {/* Container untuk scroll vertikal saja */}
          <div className="table-container-vertical">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Pelanggan</th>
                  <th>Lapangan</th>
                  <th>Tanggal</th>
                  <th>Status</th>
                  <th>Metode</th>
                  <th style={{ textAlign: 'right' }}>Harga</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.slice(0, 10).map((trx: any) => (
                    <tr key={trx.id}>
                      <td>{trx.customerName}</td>
                      <td className="font-bold">{trx.fieldName}</td>
                      <td>{trx.date ? new Date(trx.date).toLocaleDateString('id-ID') : '-'}</td>
                      <td>
                        <span className={`status-badge ${trx.status === 'paid' ? 'status-paid' : 'status-pending'}`}>
                          {trx.status === 'paid' ? 'Lunas' : 'Menunggu'}
                        </span>
                      </td>
                      <td>{trx.method || 'Transfer'}</td>
                      <td style={{ textAlign: 'right', fontWeight: '600' }}>
                        Rp {(trx.amount || 0).toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>
                      Belum ada data transaksi
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;