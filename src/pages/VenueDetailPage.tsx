import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client'; // Baru: Import Apollo
import { GET_FIELD_DETAIL } from '../graphql/queries'; // Baru: Import Query
import '../styles/VenueDetailPage.css';
import '../components/Ulasan';

interface LocationState {
  selectedDate?: string;
  selectedCourt?: string;
  fromBooking?: boolean;
}

const VenueDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedImage, setSelectedImage] = useState(0);

  // 1. AMBIL DATA DARI DATABASE (Ganti useEffect lama)
  const { loading, error, data } = useQuery(GET_FIELD_DETAIL, {
    variables: { id },
    skip: !id,
  });

  const locationState = location.state as LocationState;
  const selectedDate = locationState?.selectedDate;
  const fromBooking = locationState?.fromBooking;

  // 2. LOADING & ERROR STATE
  if (loading) {
    return (
      <div className="venue-detail-page loading">
        <div className="loading-spinner">⏳</div>
        <p>Memuat detail venue dari database...</p>
      </div>
    );
  }

  if (error || !data?.getFieldById) {
    return (
      <div className="venue-detail-page not-found">
        <h2>Venue tidak ditemukan</h2>
        <p>Maaf, data tidak dapat diambil dari server.</p>
        <button onClick={() => navigate(-1)} className="btn btn-primary">Kembali</button>
      </div>
    );
  }

  // Aliasing data dari DB agar mudah digunakan
  const field = data.getFieldById;

  // 3. TRANSFORMASI DATA (Gambar & Fasilitas)
  // Menggunakan gambar dari DB, jika kosong pakai fallback emoji sesuai desain lama
  const images = field.field_images.length > 0 
    ? field.field_images.map((img: any) => img.image_path)
    : ['🎾', '🏢', '💡']; 

  const facilities = field.field_facilities.map((f: any) => f.facilities?.name);

  // Fungsi navigasi (Tetap Sama)
  const handleBack = () => {
    if (fromBooking) {
      navigate('/booking', {
        state: { ...locationState, restoreState: true }
      });
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="venue-detail-page">
      {/* Header - Tetap Sama */}
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
        {/* Gallery Section - Tetap menggunakan class aslimu */}
        <div className="venue-gallery-wide">
          <div className="main-image-wide">
            <div className="image-placeholder extra large">
              {/* Cek apakah string itu URL gambar atau Emoji */}
              {images[selectedImage].length > 4 ? (
                <img src={images[selectedImage]} alt={field.name} style={{width:'100%', height:'100%', objectFit:'cover', borderRadius:'12px'}} />
              ) : (
                images[selectedImage]
              )}
            </div>
          </div>
          <div className="image-thumbnails-wide">
            {images.map((image: string, index: number) => (
              <button
                key={index}
                className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                onClick={() => setSelectedImage(index)}
              >
                <div className="image-placeholder medium">
                   {image.length > 4 ? <img src={image} alt="thumb" style={{width:'100%', height:'100%', objectFit:'cover'}} /> : image}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Info Section - Integrasi Data DB */}
        <div className="venue-main-info-full">
          <div className="venue-header-info">
            <h1 className="venue-title">{field.venues?.name}</h1>
            <div className="venue-rating-full">
              <span className="rating-star">⭐</span>
              <span className="rating-value">{field.venues?.rating || '4.5'}</span>
              <span className="rating-separator">•</span>
              <span className="venue-location">📍 {field.city}</span>
            </div>
            
            <div className="venue-name-section">
              <h2 className="venue-name-full">{field.name}</h2>
              <span className="sport-type-badge">{field.category}</span>
              <span className="indoor-badge">{field.is_indoor ? '🏠 Indoor' : '☀️ Outdoor'}</span>
            </div>
          </div>

          <div className="venue-description-full">
            <h3>Deskripsi</h3>
            <p>{field.description}</p>
          </div>

          {/* Location & Contact - Data dari DB */}
          <div className="venue-location-full">
            <h3>Lokasi & Kontak</h3>
            <div className="location-contact-card">
              <div className="contact-details">
                <div className="contact-item">
                  <span className="contact-icon">🏢</span>
                  <div>
                    <p className="address-full">{field.full_address}</p>
                  </div>
                </div>
                
                <div className="contact-row">
                   <div className="contact-item">
                    <span className="contact-icon">🕒</span>
                    <span className="contact-text">{field.opening_time.substring(0,5)} - {field.closing_time.substring(0,5)}</span>
                  </div>
                </div>
              </div>

              <button className="maps-button" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(field.full_address)}`, '_blank')}>
                🗺️ Buka di Google Maps
              </button>
            </div>
          </div>

          {/* Facilities - Looping data DB */}
          <div className="venue-facilities-full">
            <h3>Fasilitas</h3>
            <div className="facilities-grid-full">
              {facilities.map((facility: string, index: number) => (
                <div key={index} className="facility-item-full">
                  <span className="facility-check">✓</span>
                  <span>{facility}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Price & Booking Section - Data DB */}
        <div className="venue-booking-full">
          <div className="booking-card">
              <div className="price-section-full">
                <div className="price-header-full">
                  <span className="price-label">Harga mulai</span>
                  <div className="price-amount-full">
                    Rp {field.price_per_hour.toLocaleString()}
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
              {/* List keuntungan tetap sama */}
              <div className="benefits-list-full">
                <div className="benefit-item-full"><span className="benefit-check">✓</span><span>Pembayaran mudah dan aman</span></div>
                <div className="benefit-item-full"><span className="benefit-check">✓</span><span>Reservasi lebih mudah & cepat</span></div>
                <div className="benefit-item-full"><span className="benefit-check">✓</span><span>Konfirmasi lebih cepat</span></div>
              </div>
            </div>

          <div className="booking-actions-full">
            <button onClick={() => navigate(`/booking?fieldId=${field.id}`)} className="btn-book-now-full">
              💳 Booking Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueDetailPage;