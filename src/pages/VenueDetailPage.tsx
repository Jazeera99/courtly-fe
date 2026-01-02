// src/pages/VenueDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client'; 
import { GET_FIELD_DETAIL } from '../graphql/queries';
import '../styles/VenueDetailPage.css';
import '../components/Ulasan';

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

  // Get state from navigation
  const locationState = location.state as LocationState;
  const selectedDate = locationState?.selectedDate;
  const selectedCourt = locationState?.selectedCourt;
  const fromBooking = locationState?.fromBooking;
  
  const { data, loading, error } = useQuery(GET_FIELD_DETAIL, {
    variables: { id },
    skip: !id, // Jangan jalankan jika ID tidak ada
  });

  const venue = data?.fieldDetail ? {
    id: data.fieldDetail.id,
    name: data.fieldDetail.name,
    venue: "Venue Utama", // Bisa dinamis jika ada field venue
    type: data.fieldDetail.field_categories?.[0]?.categories?.name || 'Umum',
    sport: 'Futsal',
    indoor: true,
    price: parseFloat(data.fieldDetail.pricePerHour || 0),
    rating: 4.8,
    description: data.fieldDetail.description,
    location: `${data.fieldDetail.city}, ${data.fieldDetail.province}`,
    address: data.fieldDetail.full_address,
    // Ambil semua path gambar dari database
    images: data.fieldDetail.field_images?.length > 0 
      ? data.fieldDetail.field_images.map((img: any) => `http://localhost:4000${img.image_path}`)
      : ['https://via.placeholder.com/600x400?text=No+Image'],
    facilities: data.fieldDetail.field_facilities?.map((f: any) => f.facilities.name) || [],
    operatingHours: `${data.fieldDetail.opening_time.split('T')[1].substring(0,5)} - ${data.fieldDetail.closing_time.split('T')[1].substring(0,5)}`
  } : null;

  // Fungsi untuk membuka Google Maps
  const openGoogleMaps = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(mapsUrl, '_blank');
  };

  const handleBookNow = () => {
    const isLoggedIn = !!localStorage.getItem('token'); // Cek token

    if (!isLoggedIn) {
      // 1. Simpan data yang diperlukan untuk restore nanti
      const pendingData = {
        venueId: venue?.id,
        venueName: venue?.name,
        fromVenueDetail: true
      };
      sessionStorage.setItem('pendingBooking', JSON.stringify(pendingData));

      // 2. Redirect ke login dengan param redirect
      // Kita arahkan kembali ke /booking karena di sana proses pemilihan waktu dilakukan
      navigate(`/auth?mode=login&redirect=/booking?venueId=${venue?.id}`);
    } else {
      // Jika sudah login, langsung ke halaman booking
      if (venue?.id) {
        navigate(`/booking?venueId=${venue.id}`, { state: { fromVenueDetail: true } });
      }
    }
  };

  // 3. Handle Loading & Error
  if (loading) return <div className="loading-container">Memuat data...</div>;
  if (error || !venue) return <div className="error-container">Venue tidak ditemukan!</div>;

  const handleBack = () => {
    if (fromBooking) {
      // Kembali ke BookingPage dengan restore state
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

  // const images = venueImages[venue.id] || [venue.image, '🏢', '💡'];

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
              <img src={venue.images[selectedImage]} alt="Main" className="img-fluid-detail" />
            </div>
          </div>
          <div className="image-thumbnails-wide">
            {venue.images.map((img: string, index: number) => (
              <button
                key={index}
                className={`thumbnail ${selectedImage === index ? 'active'  : ''}`}
                onClick={() => setSelectedImage(index)}
              >
                <div className="image-placeholder medium">
                  <img src={img} alt={`Thumb ${index}`} className="img-thumb" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Info Section */}
        <div className="venue-main-info-full">
          {/* Header Info */}
          <div className="venue-header-info">
            <h1 className="venue-title">{venue.name}</h1>
            <div className="venue-rating-full">
              <span className="rating-star">⭐</span>
              <span className="rating-value">{venue.rating}</span>
              <span className="rating-separator">•</span>
              <span className="venue-location">📍 {venue.location}</span>
            </div>
            
            <div className="venue-name-section">
              {/* <h2 className="venue-name-full">{venue.name}</h2> */}
              <span className="sport-type-badge">{venue.type}</span>
              <span className="indoor-badge">{venue.indoor ? '🏠 Indoor' : '☀️ Outdoor'}</span>
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
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.address)}`, '_blank')}
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