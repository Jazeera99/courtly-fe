import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_BOOKINGS } from '../../graphql/queries';
import '../../styles/PartnerDashboard.css';

interface BookingListProps {
  booking?: any[]; 
}

const BookingList: React.FC<BookingListProps> = ({ booking }) => {
  const venueId = localStorage.getItem('venueId') || "";

  const { loading, error, data } = useQuery(GET_BOOKINGS, {
    variables: { venueId },
    skip: !venueId,
    fetchPolicy: "network-only"
  });

  if (loading) return <div className="mitra-page"><p>Memuat data booking...</p></div>;
  if (error) return <div className="mitra-page"><p>Error: {error.message}</p></div>;

  // Gunakan data dari query API JIKA ada, kalau tidak ada baru pakai data dari props dashboard
  if (loading && (!booking || booking.length === 0)) return <p>Memuat...</p>;

  // Gabungkan data API dan data dari props
  const displayBookings = data?.getVenueBookings || booking || [];

  if (displayBookings.length === 0) {
     return <div className="no-data">Belum ada data booking.</div>;
  }

  return (
    <div className="bookings-table" style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden' }}>
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
          </tr>
        </thead>
        <tbody>
          {displayBookings.length === 0 ? (
            <tr><td colSpan={7} style={{ padding: '24px', textAlign: 'center' }}>Belum ada data booking.</td></tr>
          ) : (
            displayBookings.map((b: any) => (
              <tr key={b.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '16px', color: '#6b7280' }}>#{b.id.slice(-5)}</td>
                {/* Fallback property: cek courtName (API) atau court (Dashboard) */}
                <td style={{ padding: '16px', fontWeight: '500' }}>{b.courtName || b.fieldName || b.court}</td>
                <td style={{ padding: '16px' }}>{b.customerName || b.customer}</td>
                <td style={{ padding: '16px' }}>{b.bookingDate || b.date || '-'}</td>
                <td style={{ padding: '16px' }}>
                    {b.startTime ? `${b.startTime} - ${b.endTime}` : (b.time || '-')}
                </td>
                <td style={{ padding: '16px' }}>
                  <span className={`booking-status status-${b.status === 'confirmed' || b.status === 'paid' ? 'confirmed' : 'pending'}`}>
                    {b.status === 'confirmed' || b.status === 'paid' ? 'Dikonfirmasi' : 'Menunggu'}
                  </span>
                </td>
                <td style={{ padding: '16px' }}>
                  Rp {(b.totalPrice || b.amount || 0).toLocaleString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BookingList;