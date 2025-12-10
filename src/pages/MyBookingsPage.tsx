import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MyBookingsPage.css';

interface BookingItem {
  id: string;
  courtId: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  courtName: string;
  venue: string;
  location: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentMethod: string;
  invoiceNumber: string;
  createdAt: string;
  canCancelUntil: string;
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
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Dummy data untuk bookings (agar tidak kosong)
  const dummyBookings: BookingItem[] = [
    {
      id: 'booking-1',
      courtId: '5',
      date: '2024-03-15',
      time: '14:00',
      duration: 2,
      price: 240000,
      courtName: 'Lapangan Basket Utama',
      venue: 'Sidoarjo Basketball Court',
      location: 'Jl. Merdeka No. 67, Sidoarjo',
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: 'BCA Virtual Account',
      invoiceNumber: 'INV-20240315-001',
      createdAt: '2024-03-10T10:30:00',
      canCancelUntil: '2024-03-10T10:45:00'
    },
    {
      id: 'booking-2',
      courtId: '7',
      date: '2024-03-18',
      time: '18:00',
      duration: 1,
      price: 80000,
      courtName: 'Lapangan Badminton A',
      venue: 'GOR Sidoarjo Sport Center',
      location: 'Jl. Pahlawan No. 45, Sidoarjo',
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: 'Gopay',
      invoiceNumber: 'INV-20240318-002',
      createdAt: '2024-03-12T14:20:00',
      canCancelUntil: '2024-03-12T14:35:00'
    },
    {
      id: 'booking-3',
      courtId: '3',
      date: '2024-03-20',
      time: '20:00',
      duration: 2,
      price: 300000,
      courtName: 'Lapangan Futsal 1',
      venue: 'GOR Sidoarjo Sport Center',
      location: 'Jl. Pahlawan No. 45, Sidoarjo',
      status: 'completed',
      paymentStatus: 'paid',
      paymentMethod: 'QRIS',
      invoiceNumber: 'INV-20240320-003',
      createdAt: '2024-03-05T09:15:00',
      canCancelUntil: '2024-03-05T09:30:00'
    },
    {
      id: 'booking-4',
      courtId: '1',
      date: '2024-03-25',
      time: '10:00',
      duration: 1,
      price: 250000,
      courtName: 'Court A - Premium',
      venue: 'Balikpapan Padel Club',
      location: 'Jl. Sudirman No. 123, Balikpapan',
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'Mandiri Virtual Account',
      invoiceNumber: 'INV-20240325-004',
      createdAt: '2024-03-22T16:45:00',
      canCancelUntil: '2024-03-22T17:00:00'
    },
    {
      id: 'booking-5',
      courtId: '9',
      date: '2024-03-28',
      time: '16:00',
      duration: 3,
      price: 300000,
      courtName: 'Lapangan Voli Pantai',
      venue: 'Sidoarjo Beach Sport Arena',
      location: 'Pantai Sidoarjo, Jawa Timur',
      status: 'cancelled',
      paymentStatus: 'refunded',
      paymentMethod: 'BNI Virtual Account',
      invoiceNumber: 'INV-20240328-005',
      createdAt: '2024-03-25T11:10:00',
      canCancelUntil: '2024-03-25T11:25:00'
    },
    {
      id: 'booking-6',
      courtId: '6',
      date: '2024-04-02',
      time: '09:00',
      duration: 2,
      price: 360000,
      courtName: 'Court Tenis 1',
      venue: 'Sidoarjo Tennis Complex',
      location: 'Jl. Sport No. 89, Sidoarjo',
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: 'BCA Virtual Account',
      invoiceNumber: 'INV-20240402-006',
      createdAt: '2024-03-30T13:25:00',
      canCancelUntil: '2024-03-30T13:40:00'
    },
    {
      id: 'booking-7',
      courtId: '2',
      date: '2024-04-05',
      time: '19:00',
      duration: 1,
      price: 200000,
      courtName: 'Court B - Standard',
      venue: 'Balikpapan Padel Club',
      location: 'Jl. Sudirman No. 123, Balikpapan',
      status: 'completed',
      paymentStatus: 'paid',
      paymentMethod: 'Gopay',
      invoiceNumber: 'INV-20240405-007',
      createdAt: '2024-04-01T08:40:00',
      canCancelUntil: '2024-04-01T08:55:00'
    },
    {
      id: 'booking-8',
      courtId: '4',
      date: '2024-04-10',
      time: '15:00',
      duration: 2,
      price: 260000,
      courtName: 'Lapangan Futsal 2',
      venue: 'GOR Sidoarjo Sport Center',
      location: 'Jl. Pahlawan No. 45, Sidoarjo',
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: 'QRIS',
      invoiceNumber: 'INV-20240410-008',
      createdAt: '2024-04-08T10:15:00',
      canCancelUntil: '2024-04-08T10:30:00'
    }
  ];

  // Dummy data untuk reviews
  const dummyReviews: Review[] = [
    {
      id: 'review-1',
      bookingId: 'booking-3',
      rating: 5,
      comment: 'Lapangan sangat bagus, fasilitas lengkap. Lightingnya profesional!',
      createdAt: '2024-03-21T18:30:00'
    },
    {
      id: 'review-2',
      bookingId: 'booking-7',
      rating: 4,
      comment: 'Pengalaman bermain menyenangkan, hanya sedikit masalah dengan AC di ruang ganti.',
      createdAt: '2024-04-06T14:20:00'
    }
  ];

  // Load bookings from localStorage or use dummy data
  useEffect(() => {
    const userBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    const userReviews = JSON.parse(localStorage.getItem('userReviews') || '[]');
    
    // Jika ada data di localStorage, gunakan itu. Jika tidak, gunakan dummy data
    if (userBookings.length > 0) {
      setBookings(userBookings);
    } else {
      setBookings(dummyBookings);
      // Simpan dummy data ke localStorage untuk demo
      localStorage.setItem('userBookings', JSON.stringify(dummyBookings));
    }
    
    if (userReviews.length > 0) {
      setReviews(userReviews);
    } else {
      setReviews(dummyReviews);
      localStorage.setItem('userReviews', JSON.stringify(dummyReviews));
    }
  }, []);

  // Check if booking can be cancelled (within 15 minutes)
  const canCancelBooking = (booking: BookingItem) => {
    if (booking.status === 'cancelled') return false;
    
    const cancelUntil = new Date(booking.canCancelUntil);
    const now = new Date();
    return now < cancelUntil;
  };

  // Check if booking is completed (time has passed)
  const isBookingCompleted = (booking: BookingItem) => {
    const bookingDateTime = new Date(`${booking.date}T${booking.time}:00`);
    const now = new Date();
    return now > bookingDateTime;
  };

  // Check if review already exists for booking
  const hasReview = (bookingId: string) => {
    return reviews.some(review => review.bookingId === bookingId);
  };

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    const bookingDateTime = new Date(`${booking.date}T${booking.time}:00`);
    const now = new Date();
    const isUpcoming = bookingDateTime > now;
    const isPast = bookingDateTime < now;
    
    if (filter === 'all') return true;
    if (filter === 'upcoming') return isUpcoming && booking.status !== 'cancelled';
    if (filter === 'past') return isPast && booking.status !== 'cancelled';
    if (filter === 'cancelled') return booking.status === 'cancelled';
    return booking.status === filter;
  });

  // Handle booking cancellation
  const handleCancelBooking = (bookingId: string) => {
    if (!window.confirm('Apakah Anda yakin ingin membatalkan booking ini?')) return;
    
    const updatedBookings = bookings.map(booking => {
      if (booking.id === bookingId) {
        return { 
          ...booking, 
          status: 'cancelled' as const, 
          paymentStatus: 'refunded' as const 
        };
      }
      return booking;
    });
    
    setBookings(updatedBookings);
    localStorage.setItem('userBookings', JSON.stringify(updatedBookings));
    alert('Booking berhasil dibatalkan. Dana akan dikembalikan dalam 1-3 hari kerja.');
  };

  // Handle invoice download
  const handleDownloadInvoice = (booking: BookingItem) => {
    // Create invoice content
    const invoiceContent = `
      INVOICE - ${booking.invoiceNumber}
      ================================
      
      Detail Booking:
      --------------
      Lapangan: ${booking.courtName}
      Venue: ${booking.venue}
      Lokasi: ${booking.location}
      Tanggal: ${new Date(booking.date).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}
      Waktu: ${booking.time}:00 - ${parseInt(booking.time) + booking.duration}:00
      Durasi: ${booking.duration} jam
      
      Detail Pembayaran:
      -----------------
      Harga per jam: Rp ${(booking.price / booking.duration).toLocaleString()}
      Total: Rp ${booking.price.toLocaleString()}
      Status: ${booking.paymentStatus === 'paid' ? 'LUNAS' : booking.paymentStatus.toUpperCase()}
      Metode: ${booking.paymentMethod}
      
      Tanggal Invoice: ${new Date(booking.createdAt).toLocaleDateString('id-ID')}
      ================================
      Terima kasih atas booking Anda!
    `;
    
    // Create blob and download
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${booking.invoiceNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle review submission
  const handleSubmitReview = () => {
    if (!selectedBooking || !reviewComment.trim()) {
      alert('Harap isi ulasan terlebih dahulu');
      return;
    }
    
    const newReview: Review = {
      id: `review-${Date.now()}`,
      bookingId: selectedBooking.id,
      rating: reviewRating,
      comment: reviewComment,
      createdAt: new Date().toISOString()
    };
    
    const updatedReviews = [...reviews, newReview];
    setReviews(updatedReviews);
    localStorage.setItem('userReviews', JSON.stringify(updatedReviews));
    
    setShowReviewModal(false);
    setReviewRating(5);
    setReviewComment('');
    setSelectedBooking(null);
    
    alert('Terima kasih atas ulasan Anda!');
  };

  // Handle booking again
  const handleBookAgain = (booking: BookingItem) => {
    navigate('/booking', {
      state: {
        prefillBooking: {
          courtId: booking.courtId,
          date: booking.date,
          time: booking.time
        }
      }
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string, includeTime: boolean = false) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    
    if (includeTime) {
      return date.toLocaleDateString('id-ID', options) + ' ' + date.toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
    
    return date.toLocaleDateString('id-ID', options);
  };

  return (
    <div className="my-bookings-page">
      <div className="bookings-header">
        <h1>📋 Booking Saya</h1>
        <p>Kelola semua booking dan riwayat pemesanan Anda</p>
        
        <div className="summary-stats">
          <div className="stat-card">
            <div className="stat-number">{bookings.length}</div>
            <div className="stat-label">Total Booking</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {bookings.filter(b => b.status === 'confirmed' && new Date(`${b.date}T${b.time}:00`) > new Date()).length}
            </div>
            <div className="stat-label">Mendatang</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {bookings.filter(b => b.status === 'completed').length}
            </div>
            <div className="stat-label">Selesai</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {reviews.length}
            </div>
            <div className="stat-label">Ulasan</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bookings-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          📋 Semua
        </button>
        <button 
          className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
          onClick={() => setFilter('upcoming')}
        >
          📅 Mendatang
        </button>
        <button 
          className={`filter-btn ${filter === 'past' ? 'active' : ''}`}
          onClick={() => setFilter('past')}
        >
          ✅ Selesai
        </button>
        <button 
          className={`filter-btn ${filter === 'cancelled' ? 'active' : ''}`}
          onClick={() => setFilter('cancelled')}
        >
          ❌ Dibatalkan
        </button>
      </div>

      {/* Bookings List */}
      <div className="bookings-list">
        {filteredBookings.length === 0 ? (
          <div className="no-bookings">
            <div className="no-bookings-icon">📭</div>
            <h3>Tidak ada booking ditemukan</h3>
            <p>Mulai booking lapangan favorit Anda!</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/booking')}
            >
              🏀 Booking Sekarang
            </button>
          </div>
        ) : (
          filteredBookings.map(booking => {
            const bookingDateTime = new Date(`${booking.date}T${booking.time}:00`);
            const isUpcoming = bookingDateTime > new Date();
            const isCompleted = isBookingCompleted(booking);
            const canCancel = canCancelBooking(booking);
            const hasReviewForThis = hasReview(booking.id);
            
            return (
              <div key={booking.id} className={`booking-card ${booking.status}`}>
                <div className="booking-header">
                  <div className="booking-id">
                    <div className="invoice-number">
                      <strong>#{booking.invoiceNumber}</strong>
                      <span className="booking-date-small">
                        📅 {formatDate(booking.createdAt)}
                      </span>
                    </div>
                    <div className="status-badges">
                      <span className={`status-badge ${booking.status}`}>
                        {booking.status === 'confirmed' ? '✅ Dikonfirmasi' : 
                         booking.status === 'cancelled' ? '❌ Dibatalkan' : 
                         booking.status === 'completed' ? '🏁 Selesai' : '⏳ Menunggu'}
                      </span>
                      <span className={`payment-badge ${booking.paymentStatus}`}>
                        {booking.paymentStatus === 'paid' ? '💳 LUNAS' : 
                         booking.paymentStatus === 'pending' ? '⌛ MENUNGGU' : '↩️ DIKEMBALIKAN'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="booking-details">
                  <div className="detail-left">
                    <div className="court-info">
                      <h3>
                        {booking.courtName}
                        <span className="sport-icon">
                          {booking.courtId === '5' ? '🏀' : 
                           booking.courtId === '7' ? '🏸' : 
                           booking.courtId === '3' ? '⚽' : 
                           booking.courtId === '1' ? '🎾' : 
                           booking.courtId === '9' ? '🏐' : 
                           booking.courtId === '6' ? '🎾' : 
                           booking.courtId === '2' ? '🎾' : '⚽'}
                        </span>
                      </h3>
                      <p className="venue">🏢 {booking.venue}</p>
                      <p className="location">📍 {booking.location}</p>
                    </div>
                    
                    <div className="booking-time-details">
                      <div className="time-info">
                        <span className="time-icon">📅</span>
                        <div className="time-text">
                          <div className="date">
                            {formatDate(booking.date)}
                          </div>
                          <div className="time">
                            ⏰ {booking.time}:00 - {parseInt(booking.time) + booking.duration}:00 
                            <span className="duration"> ({booking.duration} jam)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="detail-right">
                    <div className="booking-price-section">
                      <div className="price-label">Total Pembayaran</div>
                      <div className="price-amount">
                        {formatCurrency(booking.price)}
                      </div>
                      <div className="payment-method">
                        💳 {booking.paymentMethod}
                      </div>
                    </div>
                    
                    <div className="booking-actions">
                      {/* Invoice button */}
                      <button 
                        className="btn-action invoice-btn"
                        onClick={() => handleDownloadInvoice(booking)}
                        title="Unduh Invoice"
                      >
                        📄 Invoice
                      </button>
                      
                      {/* Cancel button (only for upcoming and cancellable) */}
                      {isUpcoming && canCancel && booking.status === 'confirmed' && (
                        <button 
                          className="btn-action cancel-btn"
                          onClick={() => handleCancelBooking(booking.id)}
                          title="Batalkan Booking"
                        >
                          ❌ Batalkan
                        </button>
                      )}
                      
                      {/* Book again button */}
                      {!isUpcoming && booking.status !== 'cancelled' && (
                        <button 
                          className="btn-action book-again-btn"
                          onClick={() => handleBookAgain(booking)}
                          title="Booking Lagi"
                        >
                          🔄 Booking Lagi
                        </button>
                      )}
                      
                      {/* Review button (only for completed bookings without review) */}
                      {isCompleted && booking.status === 'confirmed' && !hasReviewForThis && (
                        <button 
                          className="btn-action review-btn"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowReviewModal(true);
                          }}
                          title="Beri Ulasan"
                        >
                          ⭐ Beri Ulasan
                        </button>
                      )}
                      
                      {/* View review button */}
                      {hasReviewForThis && (
                        <button 
                          className="btn-action view-review-btn"
                          onClick={() => {
                            const review = reviews.find(r => r.bookingId === booking.id);
                            if (review) {
                              alert(
                                `⭐ Ulasan Anda: ${review.rating}/5\n\n` +
                                `"${review.comment}"\n\n` +
                                `Tanggal: ${formatDate(review.createdAt, true)}`
                              );
                            }
                          }}
                          title="Lihat Ulasan"
                        >
                          📝 Lihat Ulasan
                        </button>
                      )}
                    </div>
                    
                    {/* Cancellation deadline info */}
                    {canCancel && (
                      <div className="cancellation-info">
                        ⚠️ Dapat dibatalkan sampai: {new Date(booking.canCancelUntil).toLocaleTimeString('id-ID', { 
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    )}
                    
                    {/* Booking status note */}
                    {booking.status === 'pending' && (
                      <div className="status-note pending-note">
                        ⚠️ Menunggu konfirmasi pembayaran
                      </div>
                    )}
                    
                    {booking.status === 'cancelled' && (
                      <div className="status-note cancelled-note">
                        ❌ Booking ini telah dibatalkan. Dana dikembalikan.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedBooking && (
        <div className="review-modal-overlay">
          <div className="review-modal">
            <div className="modal-header">
              <h3>⭐ Beri Ulasan</h3>
              <button 
                className="close-modal"
                onClick={() => setShowReviewModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="review-booking-info">
                <p><strong>Lapangan:</strong> {selectedBooking.courtName}</p>
                <p><strong>Tanggal:</strong> {formatDate(selectedBooking.date)}</p>
                <p><strong>Waktu:</strong> {selectedBooking.time}:00 - {parseInt(selectedBooking.time) + selectedBooking.duration}:00</p>
                <p><strong>Venue:</strong> {selectedBooking.venue}</p>
              </div>
              
              <div className="rating-section">
                <label>Rating:</label>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      className={`star ${star <= reviewRating ? 'active' : ''}`}
                      onClick={() => setReviewRating(star)}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <div className="rating-text">
                  {reviewRating === 1 && '😞 Buruk'}
                  {reviewRating === 2 && '😐 Cukup'}
                  {reviewRating === 3 && '🙂 Baik'}
                  {reviewRating === 4 && '😊 Sangat Baik'}
                  {reviewRating === 5 && '🤩 Luar Biasa!'}
                </div>
              </div>
              
              <div className="comment-section">
                <label>Ulasan:</label>
                <textarea
                  className="review-textarea"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Bagaimana pengalaman Anda menggunakan lapangan ini? (Fasilitas, kebersihan, pelayanan, dll.)"
                  rows={4}
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="btn btn-outline"
                onClick={() => setShowReviewModal(false)}
              >
                Batal
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleSubmitReview}
                disabled={!reviewComment.trim()}
              >
                Kirim Ulasan
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Help Section */}
      <div className="help-section">
        <h3>❓ Informasi Penting</h3>
        <div className="help-cards">
          <div className="help-card">
            <div className="help-icon">⏰</div>
            <h4>Waktu Pembatalan</h4>
            <p>Anda dapat membatalkan booking maksimal 15 menit setelah pembayaran berhasil.</p>
          </div>
          <div className="help-card">
            <div className="help-icon">📝</div>
            <h4>Beri Ulasan</h4>
            <p>Beri ulasan setelah selesai menggunakan lapangan untuk membantu pengguna lain.</p>
          </div>
          <div className="help-card">
            <div className="help-icon">📄</div>
            <h4>Download Invoice</h4>
            <p>Simpan invoice sebagai bukti pembayaran yang sah untuk keperluan administrasi.</p>
          </div>
          <div className="help-card">
            <div className="help-icon">🔄</div>
            <h4>Booking Lagi</h4>
            <p>Gunakan fitur "Booking Lagi" untuk memesan lapangan yang sama dengan mudah.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBookingsPage;