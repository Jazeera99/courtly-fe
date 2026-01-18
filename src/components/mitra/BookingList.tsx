import React from 'react';
import { gql, useQuery } from '@apollo/client';
import '../../styles/PartnerDashboard.css';

// 1. Definisikan Query GraphQL (Sesuaikan field dengan skema backend Anda)
const GET_BOOKINGS = gql`
  query GetPartnerBookings($venueId: ID!) {
    getPartnerBookings(venueId: $venueId) {
      id
      courtName
      customerName
      bookingDate
      startTime
      endTime
      status
      totalPrice
    }
  }
`;

const Bookings: React.FC = () => {
  // 2. Ambil venueId dari localStorage seperti di Courts.tsx
  const venueId = localStorage.getItem('venue_id') || "";

  // 3. Gunakan useQuery alih-alih useEffect + Axios
  const { loading, error, data } = useQuery(GET_BOOKINGS, {
    variables: { venueId },
    skip: !venueId,
  });

  if (loading) return <div className="mitra-page"><p>Memuat data booking...</p></div>;
  if (error) return <div className="mitra-page"><p>Error: {error.message}</p></div>;

  const bookings = data?.getPartnerBookings || [];

  return (
    <div className="mitra-page fullscreen-content">
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <h1>📅 Kelola Booking</h1>
        <p style={{ color: '#6b7280' }}>Kelola semua booking lapangan di venue Anda</p>
      </div>

      <div className="bookings-table" style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb' }}>
              <th style={{ padding: '16px', textAlign: 'left' }}>ID</th>
              <th style={{ padding: '16px', textAlign: 'left' }}>Lapangan</th>
              <th style={{ padding: '16px', textAlign: 'left' }}>Pelanggan</th>
              <th style={{ padding: '16px', textAlign: 'left' }}>Tanggal</th>
              <th style={{ padding: '16px', textAlign: 'left' }}>Waktu</th>
              <th style={{ padding: '16px', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '16px', textAlign: 'left' }}>Harga</th>
              <th style={{ padding: '16px', textAlign: 'left' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>
                  Belum ada data booking.
                </td>
              </tr>
            ) : (
              bookings.map((booking: any) => (
                <tr key={booking.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '16px', color: '#6b7280' }}>#{booking.id.slice(-5)}</td>
                  <td style={{ padding: '16px', fontWeight: '500' }}>{booking.courtName}</td>
                  <td style={{ padding: '16px' }}>{booking.customerName}</td>
                  <td style={{ padding: '16px' }}>{booking.bookingDate}</td>
                  <td style={{ padding: '16px' }}>{booking.startTime} - {booking.endTime}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      backgroundColor: booking.status === 'confirmed' ? '#d1fae5' : '#fef3c7',
                      color: booking.status === 'confirmed' ? '#047857' : '#92400e'
                    }}>
                      {booking.status === 'confirmed' ? 'Dikonfirmasi' : 'Menunggu'}
                    </span>
                  </td>
                  <td style={{ padding: '16px', fontWeight: '600' }}>
                    Rp {booking.totalPrice?.toLocaleString()}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <button className="btn-detail">Detail</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Bookings;