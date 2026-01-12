import React, { useState, useEffect } from 'react';
import { jsPDF } from "jspdf";
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_MY_BOOKINGS } from '../graphql/queries';
import '../styles/MyBookingsPage.css';

// Interface disesuaikan dengan data dari Backend/GraphQL
interface BookingItem {
  id: string;
  invoiceNumber: string; 
  courtName: string;
  venue: string;
  location: string;
  status: string;
  price: number;
  createdAt: string;
  paymentStatus: string;
  paymentMethod: string;
  canCancelUntil: string;
  timeSlots: {
    dates: string[];
    hours: { start: string; end: string }[];
  };
  customerName: string;
  customerPhone: string;
  ownerName: string;
  ownerPhone: string;
  paymentTime: string;
}

interface Review {
  id: string;
  bookingId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const MyBookingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>('all');
  
  // Ambil data dari GraphQL
  const { data, loading, error } = useQuery(GET_MY_BOOKINGS, {
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  });
  const bookings: BookingItem[] = data?.myBookings || [];
  
  // State Lokal untuk Review & UI
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Load reviews dari localStorage (opsional, jika belum ada di DB)
  useEffect(() => {
    const userReviews = JSON.parse(localStorage.getItem('userReviews') || '[]');
    setReviews(userReviews);
  }, []);

  // --- Logic Helpers ---

  const canCancelBooking = (booking: BookingItem) => {
    if (booking.status === 'cancelled' || !booking.canCancelUntil) return false;
    return new Date() < new Date(booking.canCancelUntil);
  };

  const isBookingCompleted = (booking: BookingItem) => {
    if (booking.status === 'completed') return true;
    // Cek jika tanggal terakhir di timeSlots sudah lewat
    if (booking.timeSlots?.dates?.length > 0) {
      const lastDate = booking.timeSlots.dates[booking.timeSlots.dates.length - 1];
      return new Date() > new Date(lastDate);
    }
    return false;
  };

  const hasReview = (bookingId: string) => {
    return reviews.some(review => review.bookingId === bookingId);
  };

  // --- Handlers ---

  const handleDownloadInvoice = (booking: BookingItem) => {
    const doc = new jsPDF();
    
    // --- HEADER ---
    doc.setFillColor(79, 70, 229); 
    doc.rect(0, 0, 210, 40, "F");
    
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE PEMESANAN", 20, 25);
    
    doc.setFontSize(9); 
    doc.setFont("helvetica", "normal");
    doc.text(`No. Invoice: #${booking.invoiceNumber}`, 190, 20, { align: 'right' });

    const bayar = booking.paymentTime 
      ? new Date(booking.paymentTime).toLocaleString('id-ID', { 
          day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
        }) 
      : 'Belum Dibayar';

    doc.text(`Waktu Bayar: ${bayar}`, 190, 27, { align: 'right' });

    // --- INFO PIHAK TERKAIT ---
    let yPos = 55;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    
    doc.setFont("helvetica", "bold");
    doc.text("DETAIL PENYEWA", 20, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(`Nama: ${booking.customerName || 'N/A'}`, 20, yPos + 7);
    doc.text(`No. Telp: ${booking.customerPhone || '-'}`, 20, yPos + 13);

    doc.setFont("helvetica", "bold");
    doc.text("PENGELOLA VENUE", 110, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(`Nama Pemilik: ${booking.ownerName || 'N/A'}`, 110, yPos + 7);
    doc.text(`No. Telp: ${booking.ownerPhone || '-'}`, 110, yPos + 13);

    // --- DETAIL LAPANGAN ---
    yPos += 30;
    doc.setDrawColor(230);
    doc.line(20, yPos - 5, 190, yPos - 5);
    
    doc.setFont("helvetica", "bold");
    doc.text("INFORMASI LAPANGAN", 20, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(`Lapangan: ${booking.courtName}`, 20, yPos + 7);
    doc.text(`Alamat: ${booking.location}`, 20, yPos + 13);

    yPos += 25;
    doc.setFont("helvetica", "bold");
    doc.text("JADWAL BERMAIN", 20, yPos);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    booking.timeSlots?.dates?.forEach((dateStr, index) => {
      const formattedDate = new Date(dateStr).toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
      });
      const jam = booking.timeSlots.hours.map(h => `${h.start.slice(0, 5)} - ${h.end.slice(0, 5)}`).join(", ");
      doc.text(`${index + 1}. ${formattedDate} | Jam: ${jam}`, 25, yPos + 8 + (index * 7));
    });

    // --- TOTAL ---
    yPos += 25 + (booking.timeSlots?.dates?.length * 7);
    doc.setFillColor(243, 244, 246);
    doc.rect(20, yPos, 170, 15, "F");
    doc.setFontSize(14);
    doc.setTextColor(79, 70, 229);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL PEMBAYARAN: Rp ${booking.price.toLocaleString('id-ID')}`, 25, yPos + 10);

    // --- STAMP LUNAS (Hanya Muncul Jika Sudah Bayar) ---
    if (booking.paymentStatus === 'paid' || booking.status === 'paid') {
        doc.setDrawColor(34, 197, 94); // Warna Hijau
        doc.setLineWidth(1.5);
        // Gambar kotak stempel miring (rotated)
        doc.rect(140, yPos - 10, 45, 18); 
        doc.setTextColor(34, 197, 94);
        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        // Teks "LUNAS" di dalam kotak dengan sedikit rotasi
        doc.text("LUNAS", 162.5, yPos + 2, { align: 'center', angle: 7 });
    }

    // --- CATATAN PENTING ---
    yPos += 30;
    doc.setFillColor(255, 251, 235);
    doc.rect(20, yPos, 170, 25, "F");
    doc.setFontSize(10);
    doc.setTextColor(146, 64, 14);
    doc.setFont("helvetica", "bold");
    doc.text("CATATAN PENTING:", 25, yPos + 10);
    doc.setFont("helvetica", "normal");
    doc.text("Waktu sewa efektif adalah 50 menit per jam. 10 menit terakhir digunakan untuk", 25, yPos + 16);
    doc.text("pergantian pemain agar jadwal berikutnya tepat waktu.", 25, yPos + 21);

    doc.save(`Invoice-${booking.invoiceNumber}.pdf`);
  };

  // 1. Urutkan data dari yang terbaru (Descending) berdasarkan createdAt
  const sortedBookings = [...bookings].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return !isBookingCompleted(booking) && booking.status !== 'cancelled';
    if (filter === 'past') return isBookingCompleted(booking) && booking.status !== 'cancelled';
    if (filter === 'cancelled') return booking.status === 'cancelled';
    return true;
  });

  if (loading) return <div className="loading-state">Memuat data booking...</div>;
  if (error) return <div className="error-state">Terjadi kesalahan: {error.message}</div>;

  return (
    <div className="my-bookings-page">
      {/* Header & Stats */}
      <div className="bookings-header">
        <h1>📋 Booking Saya</h1>
        <p>Kelola semua booking dan riwayat pemesanan Anda</p>
        
        <div className="summary-stats">
          <div className="stat-card">
            <div className="stat-number">{bookings.length}</div>
            <div className="stat-label">Total Booking</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{bookings.filter(b => !isBookingCompleted(b) && b.status !== 'cancelled').length}</div>
            <div className="stat-label">Mendatang</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{bookings.filter(b => b.status === 'completed' || isBookingCompleted(b)).length}</div>
            <div className="stat-label">Selesai</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{reviews.length}</div>
            <div className="stat-label">Ulasan</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bookings-filters">
        {['all', 'upcoming', 'past', 'cancelled'].map((f) => (
          <button 
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' && '📋 Semua'}
            {f === 'upcoming' && '📅 Mendatang'}
            {f === 'past' && '✅ Selesai'}
            {f === 'cancelled' && '❌ Dibatalkan'}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="bookings-list">
        {filteredBookings.length === 0 ? (
          <div className="no-bookings">
            <div className="no-bookings-icon">📭</div>
            <h3>Tidak ada booking ditemukan</h3>
            <button className="btn btn-primary" onClick={() => navigate('/booking')}>🏀 Booking Sekarang</button>
          </div>
        ) : (
          filteredBookings.map(booking => (
            <div key={booking.id} className={`booking-card ${booking.status}`}>
              <div className="booking-header">
                <div className="booking-id">
                  <div className="invoice-number">
                    <strong>#{booking.invoiceNumber}</strong>
                    <span className="booking-date-small"> 📅 {new Date(booking.createdAt).toLocaleDateString('id-ID')}</span>
                  </div>
                  <div className="status-badges">
                    <span className={`status-badge ${booking.status}`}>{booking.status}</span>
                    <span className={`payment-badge ${booking.paymentStatus}`}>{booking.paymentStatus.toUpperCase()}</span>
                  </div>
                </div>
              </div>
              
              <div className="booking-details">
                <div className="detail-left">
                  <div className="court-info">
                    <h3>{booking.courtName} <span className="sport-icon">🏀</span></h3>
                    <p className="venue">🏢 {booking.venue}</p>
                    <p className="location">📍 {booking.location}</p>
                  </div>
                  
                  <div className="booking-time-details">
                    <div className="time-info" style={{ width: '100%' }}>
                      <span className="time-icon">📅</span>
                      <div className="time-text">
                        {booking.timeSlots?.dates?.map((tgl, idx) => (
                          <div key={idx} className="booking-date-row" style={{ fontSize: '14px', marginBottom: '4px' }}>
                            <strong>{new Date(tgl).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}</strong>
                            <span style={{ marginLeft: '8px', color: '#666' }}>
                              {booking.timeSlots.hours.map(h => `${h.start.slice(0, 5)}-${h.end.slice(0, 5)}`).join(', ')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="detail-right">
                  <div className="booking-price-section">
                    <div className="price-label">Total Pembayaran</div>
                    <div className="price-amount">Rp {booking.price.toLocaleString('id-ID')}</div>
                    <div className="payment-method">💳 {booking.paymentMethod}</div>
                  </div>
                  
                  <div className="booking-actions">
                    <button className="btn-action invoice-btn" onClick={() => handleDownloadInvoice(booking)}>📄 Invoice</button>
                    
                    {canCancelBooking(booking) && (
                      <button className="btn-action cancel-btn">❌ Batalkan</button>
                    )}
                    
                    {isBookingCompleted(booking) && !hasReview(booking.id) && (
                      <button className="btn-action review-btn" onClick={() => { setSelectedBooking(booking); setShowReviewModal(true); }}>⭐ Ulasan</button>
                    )}

                    {hasReview(booking.id) && <button className="btn-action view-review-btn">📝 Lihat Ulasan</button>}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Review (Tetap Sesuai Desain Anda) */}
      {showReviewModal && selectedBooking && (
        <div className="review-modal-overlay">
          <div className="review-modal">
            <div className="modal-header">
              <h3>⭐ Beri Ulasan</h3>
              <button className="close-modal" onClick={() => setShowReviewModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <p>Bagaimana pengalaman Anda di <strong>{selectedBooking.courtName}</strong>?</p>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} className={`star ${star <= reviewRating ? 'active' : ''}`} onClick={() => setReviewRating(star)}>★</button>
                ))}
              </div>
              <textarea 
                className="review-textarea" 
                value={reviewComment} 
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Tulis ulasan Anda..."
              />
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={handleSubmitReview}>Kirim Ulasan</button>
            </div>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="help-section">
        <h3>❓ Informasi Penting</h3>
        <div className="help-cards">
          <div className="help-card"><h4>Waktu Pembatalan</h4><p>Maksimal 15 menit setelah pembayaran.</p></div>
          <div className="help-card"><h4>Beri Ulasan</h4><p>Bantu orang lain dengan ulasan Anda.</p></div>
          <div className="help-card"><h4>Download Invoice</h4><p>Simpan bukti pembayaran sah Anda.</p></div>
        </div>
      </div>
    </div>
  );
};

export default MyBookingsPage;