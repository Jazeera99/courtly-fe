// src/pages/mitra/Bookings.tsx
import React, { useState } from 'react';
import { Search, Filter, Calendar, Download } from 'lucide-react';
import '../../styles/PartnerDashboard.css';

interface Booking {
  id: number;
  court: string;
  customer: string;
  phone: string;
  date: string;
  time: string;
  duration: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  price: number;
  payment: 'paid' | 'unpaid';
}

const Bookings: React.FC = () => {
  const [bookings] = useState<Booking[]>([
    { id: 1, court: 'Lapangan Futsal 1', customer: 'John Doe', phone: '081234567890', date: '2024-01-15', time: '16:00-17:00', duration: 1, status: 'confirmed', price: 150000, payment: 'paid' },
    { id: 2, court: 'Lapangan Badminton A', customer: 'Jane Smith', phone: '081298765432', date: '2024-01-15', time: '18:00-19:00', duration: 1, status: 'confirmed', price: 80000, payment: 'paid' },
    { id: 3, court: 'Lapangan Futsal 2', customer: 'Bob Johnson', phone: '081311223344', date: '2024-01-16', time: '20:00-21:00', duration: 1, status: 'pending', price: 150000, payment: 'unpaid' },
    { id: 4, court: 'Lapangan Basket', customer: 'Alice Brown', phone: '081344556677', date: '2024-01-16', time: '14:00-16:00', duration: 2, status: 'confirmed', price: 240000, payment: 'paid' },
    { id: 5, court: 'Lapangan Badminton B', customer: 'Charlie Wilson', phone: '081355667788', date: '2024-01-17', time: '19:00-20:00', duration: 1, status: 'confirmed', price: 80000, payment: 'paid' },
    { id: 6, court: 'Lapangan Futsal 1', customer: 'David Lee', phone: '081366778899', date: '2024-01-17', time: '21:00-22:00', duration: 1, status: 'cancelled', price: 150000, payment: 'unpaid' },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'pending': return 'status-pending';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Dikonfirmasi';
      case 'pending': return 'Menunggu';
      case 'cancelled': return 'Dibatalkan';
      default: return status;
    }
  };

  const getPaymentColor = (payment: string) => {
    return payment === 'paid' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
  };

  const getPaymentText = (payment: string) => {
    return payment === 'paid' ? 'Lunas' : 'Belum Bayar';
  };

  return (
    <div className="mitra-page fullscreen-content">
      <div className="page-content">
        <div className="page-header">
          <h1>📅 Kelola Booking</h1>
          <p>Kelola semua booking lapangan di venue Anda</p>
        </div>

        {/* Filters and Actions */}
        <div className="booking-filters" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <Search size={20} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af'
              }} />
              <input
                type="text"
                placeholder="Cari booking..."
                style={{
                  padding: '10px 12px 10px 40px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  backgroundColor: 'white',
                  width: '300px',
                  fontSize: '0.95rem'
                }}
              />
            </div>
            
            <select style={{
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              backgroundColor: 'white',
              fontSize: '0.95rem',
              cursor: 'pointer'
            }}>
              <option value="">Semua Status</option>
              <option value="confirmed">Dikonfirmasi</option>
              <option value="pending">Menunggu</option>
              <option value="cancelled">Dibatalkan</option>
            </select>

            <button style={{
              padding: '10px 20px',
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.95rem'
            }}>
              <Filter size={18} />
              Filter
            </button>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} />
              Kalender
            </button>
            <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Download size={18} />
              Export
            </button>
            <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.2rem' }}>+</span>
              Tambah Booking
            </button>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="data-table">
          <div className="table-header" style={{
            gridTemplateColumns: '80px 180px 180px 120px 120px 120px 120px 100px 100px 120px'
          }}>
            <div>ID</div>
            <div>Lapangan</div>
            <div>Pelanggan</div>
            <div>Telepon</div>
            <div>Tanggal</div>
            <div>Waktu</div>
            <div>Durasi</div>
            <div>Status</div>
            <div>Pembayaran</div>
            <div>Aksi</div>
          </div>

          {bookings.map((booking) => (
            <div key={booking.id} className="table-row" style={{
              gridTemplateColumns: '80px 180px 180px 120px 120px 120px 120px 100px 100px 120px'
            }}>
              <div className="table-cell">#{booking.id}</div>
              <div className="table-cell primary">{booking.court}</div>
              <div className="table-cell">
                <div style={{ fontWeight: '600' }}>{booking.customer}</div>
              </div>
              <div className="table-cell">{booking.phone}</div>
              <div className="table-cell">{booking.date}</div>
              <div className="table-cell">{booking.time}</div>
              <div className="table-cell">{booking.duration} jam</div>
              <div className="table-cell">
                <span className={`booking-status ${getStatusColor(booking.status)}`}>
                  {getStatusText(booking.status)}
                </span>
              </div>
              <div className="table-cell">
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  ...(booking.payment === 'paid' 
                    ? { backgroundColor: '#d1fae5', color: '#065f46' }
                    : { backgroundColor: '#fee2e2', color: '#991b1b' })
                }}>
                  {getPaymentText(booking.payment)}
                </span>
              </div>
              <div className="table-cell">
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.875rem' }}>
                    Detail
                  </button>
                  <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.875rem' }}>
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="grid-3" style={{ marginTop: '32px' }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '8px' }}>Total Booking</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>{bookings.length}</div>
          </div>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '8px' }}>Pendapatan Bulan Ini</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>
              Rp {bookings.filter(b => b.payment === 'paid').reduce((sum, b) => sum + b.price, 0).toLocaleString()}
            </div>
          </div>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '8px' }}>Booking Menunggu</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>
              {bookings.filter(b => b.status === 'pending').length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookings;