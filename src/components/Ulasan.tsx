// src/pages/VenueDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import '../styles/VenueDetailPage.css';

interface Court {
  id: string;
  name: string;
  venue: string;
  type: string;
  sport: string;
  indoor: boolean;
  price: number;
  rating: number;
  image: string;
  description: string;
  facilities: string[];
  location: string;
  address: string;
  phone?: string;
  operatingHours?: string;
}

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

interface LocationState {
  selectedDate?: string;
  selectedCourt?: string;
  fromBooking?: boolean;
}

const VenueDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [venue, setVenue] = useState<Court | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState<number[]>([0, 0, 0, 0, 0]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    userName: '',
  });

  // Get state from navigation
  const locationState = location.state as LocationState;
  const selectedDate = locationState?.selectedDate;
  const selectedCourt = locationState?.selectedCourt;
  const fromBooking = locationState?.fromBooking;

  // Data courts/lapangan (sama dengan di BookingPage)
  const courts: Court[] = [
    // ... (court data tetap sama seperti sebelumnya)
  ];

  // Mock reviews data untuk setiap venue
  const venueReviews: { [key: string]: Review[] } = {
    '1': [
      {
        id: 'rev-1-1',
        userId: 'user-001',
        userName: 'Andi Wijaya',
        userAvatar: '👨',
        rating: 5,
        comment: 'Lapangan premium banget! Kualitas lapangan sangat baik, lighting optimal untuk malam hari. Fasilitas lengkap dan bersih.',
        date: '2024-03-10',
        helpful: 12
      },
      {
        id: 'rev-1-2',
        userId: 'user-002',
        userName: 'Budi Santoso',
        userAvatar: '👨‍💼',
        rating: 4,
        comment: 'Pengalaman bermain menyenangkan. Hanya sedikit ramai di weekend, tapi pelayanan staff sangat baik.',
        date: '2024-03-05',
        helpful: 8
      },
      {
        id: 'rev-1-3',
        userId: 'user-003',
        userName: 'Sari Dewi',
        userAvatar: '👩',
        rating: 5,
        comment: 'Tempatnya sangat nyaman, AC dingin, toilet bersih. Recommended untuk turnamen atau latihan serius!',
        date: '2024-02-28',
        helpful: 15
      }
    ],
    '2': [
      {
        id: 'rev-2-1',
        userId: 'user-004',
        userName: 'Rizky Pratama',
        userAvatar: '👨‍🎓',
        rating: 4,
        comment: 'Harga terjangkau untuk kualitas lapangan yang bagus. Lighting cukup terang untuk malam hari.',
        date: '2024-03-12',
        helpful: 5
      },
      {
        id: 'rev-2-2',
        userId: 'user-005',
        userName: 'Linda Hartono',
        userAvatar: '👩‍⚕️',
        rating: 3,
        comment: 'Lapangan standar, cocok untuk latihan casual. Tapi kadang agak panas kalau AC kurang dingin.',
        date: '2024-03-08',
        helpful: 3
      }
    ],
    '3': [
      {
        id: 'rev-3-1',
        userId: 'user-006',
        userName: 'Fajar Setiawan',
        userAvatar: '👨‍🔧',
        rating: 5,
        comment: 'Rumput sintetisnya sangat bagus, tidak licin. Cocok untuk turnamen futsal!',
        date: '2024-03-15',
        helpful: 20
      },
      {
        id: 'rev-3-2',
        userId: 'user-007',
        userName: 'Maya Indah',
        userAvatar: '👩‍🏫',
        rating: 4,
        comment: 'Sound system bagus, lighting profesional. Hanya toiletnya perlu perbaikan kecil.',
        date: '2024-03-10',
        helpful: 7
      },
      {
        id: 'rev-3-3',
        userId: 'user-008',
        userName: 'Doni Kurniawan',
        userAvatar: '👨‍🍳',
        rating: 5,
        comment: 'Tempat favorit untuk latihan tim. Parkiran luas dan aman.',
        date: '2024-03-05',
        helpful: 11
      }
    ],
    // ... tambahkan reviews untuk venue lainnya sesuai kebutuhan
  };

  // Mock images untuk setiap venue
  const venueImages: { [key: string]: string[] } = {
    '1': ['🎾', '🏢', '💡'],
    '2': ['🎾', '🏢', '💡'],
    '3': ['⚽', '🏢', '💡'],
    '4': ['⚽', '🏢', '💡'],
    '5': ['🏀', '🏢', '💡'],
    '6': ['🎾', '🏢', '💡'],
    '7': ['🏸', '🏢', '💡'],
    '8': ['🏸', '🏢', '💡'],
    '9': ['🏐', '🏖️', '💡']
  };

  // Fungsi untuk membuka Google Maps
  const openGoogleMaps = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(mapsUrl, '_blank');
  };

  // Fungsi untuk menghitung rating
  const calculateRatingStats = (reviews: Review[]) => {
    if (reviews.length === 0) return;
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const avg = totalRating / reviews.length;
    setAverageRating(parseFloat(avg.toFixed(1)));
    
    // Hitung distribusi rating
    const distribution = [0, 0, 0, 0, 0];
    reviews.forEach(review => {
      distribution[review.rating - 1]++;
    });
    setRatingDistribution(distribution);
  };

  // Fungsi untuk handle submit review
  const handleSubmitReview = () => {
    if (!newReview.comment.trim()) {
      alert('Harap isi ulasan terlebih dahulu');
      return;
    }

    if (!newReview.userName.trim()) {
      alert('Harap isi nama Anda');
      return;
    }

    const review: Review = {
      id: `rev-${id}-${Date.now()}`,
      userId: `user-${Date.now()}`,
      userName: newReview.userName,
      userAvatar: '👤',
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0],
      helpful: 0
    };

    const updatedReviews = [review, ...reviews];
    setReviews(updatedReviews);
    calculateRatingStats(updatedReviews);
    
    // Simpan ke localStorage (simulasi database)
    const venueReviewsData = JSON.parse(localStorage.getItem('venueReviews') || '{}');
    venueReviewsData[id!] = updatedReviews;
    localStorage.setItem('venueReviews', JSON.stringify(venueReviewsData));

    // Reset form
    setNewReview({
      rating: 5,
      comment: '',
      userName: '',
    });
    setShowReviewForm(false);
    
    alert('Terima kasih atas ulasan Anda!');
  };

  // Fungsi untuk mark review as helpful
  const handleHelpful = (reviewId: string) => {
    const updatedReviews = reviews.map(review => {
      if (review.id === reviewId) {
        return { ...review, helpful: review.helpful + 1 };
      }
      return review;
    });
    setReviews(updatedReviews);
    
    // Simpan ke localStorage
    const venueReviewsData = JSON.parse(localStorage.getItem('venueReviews') || '{}');
    venueReviewsData[id!] = updatedReviews;
    localStorage.setItem('venueReviews', JSON.stringify(venueReviewsData));
  };

  useEffect(() => {
    // Simulasi loading data
    const timer = setTimeout(() => {
      const foundVenue = courts.find(court => court.id === id);
      setVenue(foundVenue || null);
      
      // Load reviews dari localStorage atau mock data
      const savedReviews = JSON.parse(localStorage.getItem('venueReviews') || '{}');
      const venueReviewsData = savedReviews[id!] || venueReviews[id!] || [];
      setReviews(venueReviewsData);
      calculateRatingStats(venueReviewsData);
      
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  const handleBookNow = () => {
    if (venue?.id) {
      navigate(`/booking?venueId=${venue.id}`, {
        state: {
          fromVenueDetail: true
        }
      });
    }
  };

  const handleBack = () => {
    if (fromBooking) {
      navigate('/booking', {
        state: {
          selectedDate: selectedDate,
          selectedCourt: selectedCourt,
          restoreState: true
        }
      });
    } else {
      navigate(-1);
    }
  };

  // Render star rating
  const renderStars = (rating: number, size: 'small' | 'medium' | 'large' = 'medium') => {
    const starClass = `star-rating-${size}`;
    return (
      <div className={starClass}>
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            className={`star ${star <= rating ? 'filled' : 'empty'}`}
          >
            {star <= rating ? '★' : '☆'}
          </span>
        ))}
      </div>
    );
  };

  // Render rating distribution bar
  const renderRatingDistribution = () => {
    const maxCount = Math.max(...ratingDistribution);
    
    return (
      <div className="rating-distribution">
        {[5, 4, 3, 2, 1].map((rating, index) => {
          const count = ratingDistribution[5 - rating - 1];
          const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
          
          return (
            <div key={rating} className="distribution-row">
              <span className="rating-label">{rating} ★</span>
              <div className="distribution-bar-container">
                <div 
                  className="distribution-bar" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <span className="rating-count">{count}</span>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="venue-detail-page loading">
        <div className="loading-spinner">⏳</div>
        <p>Memuat detail venue...</p>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="venue-detail-page not-found">
        <h2>Venue tidak ditemukan</h2>
        <p>Maaf, venue yang Anda cari tidak tersedia.</p>
        <button onClick={handleBack} className="btn btn-primary">
          Kembali
        </button>
      </div>
    );
  }

  const images = venueImages[venue.id] || [venue.image, '🏢', '💡'];

  return (
    <div className="venue-detail-page">
      {/* Header */}
      <div className="venue-header">
        <button onClick={handleBack} className="back-button">
          ← Kembali {fromBooking && 'ke Booking'}
        </button>
        {selectedDate && (
          <div className="booking-context-info">
            📅 Menampilkan detail untuk tanggal: {new Date(selectedDate).toLocaleDateString('id-ID')}
          </div>
        )}
      </div>

      <div className="venue-content-single">
        {/* Gallery Section */}
        <div className="venue-gallery-wide">
          <div className="main-image-wide">
            <div className="image-placeholder extra large">
              {images[selectedImage]}
            </div>
          </div>
          <div className="image-thumbnails-wide">
            {images.map((image, index) => (
              <button
                key={index}
                className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                onClick={() => setSelectedImage(index)}
              >
                <div className="image-placeholder medium">
                  {image}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Info Section */}
        <div className="venue-main-info-full">
          {/* Header Info */}
          <div className="venue-header-info">
            <h1 className="venue-title">{venue.venue}</h1>
            <div className="venue-rating-full">
              <span className="rating-star">⭐</span>
              <span className="rating-value">{venue.rating}</span>
              <span className="rating-separator">•</span>
              <span className="venue-location">📍 {venue.location}</span>
            </div>
            
            <div className="venue-name-section">
              <h2 className="venue-name-full">{venue.name}</h2>
              <span className="sport-type-badge">{venue.type}</span>
              <span className="indoor-badge">{venue.indoor ? '🏠 Indoor' : '☀️ Outdoor'}</span>
            </div>
          </div>

          {/* Rating Summary Section */}
          <div className="rating-summary-section">
            <div className="average-rating-card">
              <div className="average-rating-number">
                {averageRating.toFixed(1)}
              </div>
              <div className="average-rating-stars">
                {renderStars(Math.round(averageRating), 'large')}
              </div>
              <div className="total-reviews">
                {reviews.length} ulasan
              </div>
            </div>
            
            <div className="rating-distribution-section">
              {renderRatingDistribution()}
            </div>
          </div>

          <div className="venue-description-full">
            <h3>Deskripsi</h3>
            <p>{venue.description}</p>
          </div>

          {/* Location Section */}
          <div className="venue-location-full">
            <h3>Lokasi & Kontak</h3>
            <div className="location-contact-card">
              <div className="contact-details">
                <div className="contact-item">
                  <span className="contact-icon">🏢</span>
                  <div>
                    <p className="address-full">{venue.address}</p>
                  </div>
                </div>
                
                <div className="contact-row">
                  {venue.phone && (
                    <div className="contact-item">
                      <span className="contact-icon">📞</span>
                      <span className="contact-text">{venue.phone}</span>
                    </div>
                  )}
                  
                  {venue.operatingHours && (
                    <div className="contact-item">
                      <span className="contact-icon">🕒</span>
                      <span className="contact-text">{venue.operatingHours}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tombol Maps */}
              <button 
                className="maps-button"
                onClick={() => openGoogleMaps(venue.address)}
              >
                🗺️ Buka di Google Maps
              </button>
            </div>
          </div>

          {/* Facilities Section */}
          <div className="venue-facilities-full">
            <h3>Fasilitas</h3>
            <div className="facilities-grid-full">
              {venue.facilities.map((facility, index) => (
                <div key={index} className="facility-item-full">
                  <span className="facility-check">✓</span>
                  <span>{facility}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="reviews-section">
            <div className="reviews-header">
              <h3>📝 Ulasan Pengguna ({reviews.length})</h3>
              <button 
                className="btn-add-review"
                onClick={() => setShowReviewForm(!showReviewForm)}
              >
                ✍️ Tulis Ulasan
              </button>
            </div>

            {/* Add Review Form */}
            {showReviewForm && (
              <div className="add-review-form">
                <div className="form-header">
                  <h4>Beri Ulasan Anda</h4>
                  <button 
                    className="close-form-btn"
                    onClick={() => setShowReviewForm(false)}
                  >
                    ✕
                  </button>
                </div>
                
                <div className="form-content">
                  <div className="rating-input">
                    <label>Rating:</label>
                    <div className="star-input">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          className={`star-btn ${star <= newReview.rating ? 'active' : ''}`}
                          onClick={() => setNewReview({...newReview, rating: star})}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <div className="rating-text">
                      {newReview.rating === 1 && '😞 Buruk'}
                      {newReview.rating === 2 && '😐 Cukup'}
                      {newReview.rating === 3 && '🙂 Baik'}
                      {newReview.rating === 4 && '😊 Sangat Baik'}
                      {newReview.rating === 5 && '🤩 Luar Biasa!'}
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Nama Anda:</label>
                    <input
                      type="text"
                      className="form-input"
                      value={newReview.userName}
                      onChange={(e) => setNewReview({...newReview, userName: e.target.value})}
                      placeholder="Masukkan nama Anda"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Ulasan:</label>
                    <textarea
                      className="review-textarea"
                      value={newReview.comment}
                      onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                      placeholder="Bagaimana pengalaman Anda menggunakan lapangan ini? (Fasilitas, kebersihan, pelayanan, dll.)"
                      rows={4}
                    />
                  </div>
                  
                  <div className="form-actions">
                    <button 
                      className="btn-cancel"
                      onClick={() => setShowReviewForm(false)}
                    >
                      Batal
                    </button>
                    <button 
                      className="btn-submit-review"
                      onClick={handleSubmitReview}
                      disabled={!newReview.comment.trim() || !newReview.userName.trim()}
                    >
                      Kirim Ulasan
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews List */}
            {reviews.length === 0 ? (
              <div className="no-reviews">
                <div className="no-reviews-icon">📝</div>
                <h4>Belum ada ulasan</h4>
                <p>Jadilah yang pertama memberikan ulasan untuk lapangan ini!</p>
              </div>
            ) : (
              <div className="reviews-list">
                {reviews.map((review) => (
                  <div key={review.id} className="review-card">
                    <div className="review-header">
                      <div className="user-info">
                        <div className="user-avatar">{review.userAvatar}</div>
                        <div className="user-details">
                          <div className="user-name">{review.userName}</div>
                          <div className="review-date">
                            {new Date(review.date).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="review-rating">
                        {renderStars(review.rating, 'small')}
                      </div>
                    </div>
                    
                    <div className="review-content">
                      <p>{review.comment}</p>
                    </div>
                    
                    <div className="review-footer">
                      <button 
                        className="helpful-btn"
                        onClick={() => handleHelpful(review.id)}
                      >
                        👍 Membantu ({review.helpful})
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Price & Booking Section */}
        <div className="venue-booking-full">
          <div className="booking-card">
            <div className="price-section-full">
              <div className="price-header-full">
                <span className="price-label">Harga mulai</span>
                <div className="price-amount-full">
                  Rp {venue.price.toLocaleString()}
                </div>
                <span className="price-unit">/jam</span>
              </div>

              <div className="availability-badge-full">
                <span className="availability-dot"></span>
                Tersedia untuk booking
              </div>
            </div>
          </div>

          <div className="booking-benefits-full">
            <h4>Booking lewat aplikasi lebih banyak keuntungan!</h4>
            <div className="benefits-list-full">
              <div className="benefit-item-full">
                <span className="benefit-check">✓</span>
                <span>Pembayaran mudah dan aman</span>
              </div>
              <div className="benefit-item-full">
                <span className="benefit-check">✓</span>
                <span>Reservasi lebih mudah & cepat</span>
              </div>
              <div className="benefit-item-full">
                <span className="benefit-check">✓</span>
                <span>Konfirmasi lebih cepat</span>
              </div>
            </div>
          </div>

          <div className="booking-actions-full">
            <button onClick={handleBookNow} className="btn-book-now-full">
              💳 Booking Sekarang
            </button>
          </div>

          <div className="safety-info-full">
            <p>🔒 Transaksi aman & terjamin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueDetailPage;