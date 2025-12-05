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
  const [loading, Loading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  // Get state from navigation
  const locationState = location.state as LocationState;
  const selectedDate = locationState?.selectedDate;
  const selectedCourt = locationState?.selectedCourt;
  const fromBooking = locationState?.fromBooking;

  // Data courts/lapangan (sama dengan di BookingPage)
  const courts: Court[] = [
    {
      id: '1',
      name: 'Court A - Premium',
      venue: 'Balikpapan Padel Club',
      type: 'Padel Court',
      sport: 'padel',
      indoor: true,
      price: 250000,
      rating: 4.9,
      image: '🎾',
      description: 'Lapangan Padel nomor 1 di Balikpapan dengan fasilitas premium dan surface berkualitas tinggi. Cocok untuk pertandingan profesional dan latihan serius.',
      facilities: ['Cafe & Resto', 'Jual Minuman', 'Parkir Mobil', 'Parkir Motor', 'Ruang Ganti', 'Toilet', 'AC', 'Lighting Profesional', 'Shower'],
      location: 'Kota Balikpapan, Kalimantan Timur',
      address: 'Jl. Sudirman No. 429 Balikpapan, Kalimantan Timur',
      phone: '(0542) 123456',
      operatingHours: '06:00 - 23:00'
    },
    {
      id: '2',
      name: 'Court B - Standard',
      venue: 'Balikpapan Padel Club',
      type: 'Padel Court',
      sport: 'padel',
      indoor: true,
      price: 200000,
      rating: 4.7,
      image: '🎾',
      description: 'Lapangan padel standar dengan fasilitas lengkap untuk latihan dan pertandingan casual. Surface berkualitas dengan lighting yang optimal.',
      facilities: ['Cafe & Resto', 'Parkir Mobil', 'Parkir Motor', 'Ruang Ganti', 'Toilet', 'AC', 'Lighting'],
      location: 'Kota Balikpapan, Kalimantan Timur',
      address: 'Jl. Sudirman No. 429 Balikpapan, Kalimantan Timur',
      phone: '(0542) 123456',
      operatingHours: '06:00 - 23:00'
    },
    {
      id: '3',
      name: 'Lapangan Futsal 1',
      venue: 'GOR Sidoarjo Sport Center',
      type: 'Futsal',
      sport: 'futsal',
      indoor: true,
      price: 150000,
      rating: 4.6,
      image: '⚽',
      description: 'Lapangan futsal indoor dengan rumput sintetis berkualitas, ukuran standar nasional. Dilengkapi tribune dan music system.',
      facilities: ['AC', 'Tribune', 'Lighting', 'Music System', 'Parkir Mobil', 'Parkir Motor', 'Ruang Ganti', 'Toilet'],
      location: 'Jl. Pahlawan No. 45, Sidoarjo',
      address: 'Jl. Pahlawan No. 45, Sidoarjo, Jawa Timur',
      phone: '(031) 8901234',
      operatingHours: '07:00 - 22:00'
    },
    {
      id: '4',
      name: 'Lapangan Futsal 2',
      venue: 'GOR Sidoarjo Sport Center',
      type: 'Futsal',
      sport: 'futsal',
      indoor: true,
      price: 130000,
      rating: 4.5,
      image: '⚽',
      description: 'Lapangan futsal dengan surface terbaru, cocok untuk latihan tim. Lighting optimal untuk pertandingan malam.',
      facilities: ['AC', 'Lighting', 'Changing Room', 'Parkir Motor', 'Toilet'],
      location: 'Jl. Pahlawan No. 45, Sidoarjo',
      address: 'Jl. Pahlawan No. 45, Sidoarjo, Jawa Timur',
      phone: '(031) 8901234',
      operatingHours: '07:00 - 22:00'
    },
    {
      id: '5',
      name: 'Lapangan Basket Utama',
      venue: 'Sidoarjo Basketball Court',
      type: 'Basket',
      sport: 'basket',
      indoor: false,
      price: 120000,
      rating: 4.4,
      image: '🏀',
      description: 'Lapangan basket outdoor dengan flooring berkualitas, ring profesional. Dilengkapi scoreboard dan lighting untuk malam hari.',
      facilities: ['Lighting', 'Bench', 'Scoreboard', 'Parkir Motor', 'Toilet'],
      location: 'Jl. Merdeka No. 67, Sidoarjo',
      address: 'Jl. Merdeka No. 67, Sidoarjo, Jawa Timur',
      phone: '(031) 8912345',
      operatingHours: '06:00 - 21:00'
    },
    {
      id: '6',
      name: 'Court Tenis 1',
      venue: 'Sidoarjo Tennis Complex',
      type: 'Tenis',
      sport: 'tennis',
      indoor: false,
      price: 180000,
      rating: 4.7,
      image: '🎾',
      description: 'Lapangan tenis hard court dengan surface standar internasional. Cocok untuk turnamen dan latihan profesional.',
      facilities: ['Lighting', 'Net Profesional', 'Bench', 'Parkir Mobil', 'Parkir Motor', 'Toilet'],
      location: 'Jl. Sport No. 89, Sidoarjo',
      address: 'Jl. Sport No. 89, Sidoarjo, Jawa Timur',
      phone: '(031) 8923456',
      operatingHours: '06:00 - 22:00'
    },
    {
      id: '7',
      name: 'Lapangan Badminton A',
      venue: 'GOR Sidoarjo Sport Center',
      type: 'Badminton',
      sport: 'badminton',
      indoor: true,
      price: 80000,
      rating: 4.3,
      image: '🏸',
      description: 'Lapangan badminton indoor dengan lighting profesional, lantai kayu maple. Suasana nyaman untuk pertandingan.',
      facilities: ['AC', 'Lighting Profesional', 'Changing Room', 'Parkir Motor', 'Toilet', 'Mushola'],
      location: 'Jl. Pahlawan No. 45, Sidoarjo',
      address: 'Jl. Pahlawan No. 45, Sidoarjo, Jawa Timur',
      phone: '(031) 8901234',
      operatingHours: '07:00 - 22:00'
    },
    {
      id: '8',
      name: 'Lapangan Badminton B',
      venue: 'GOR Sidoarjo Sport Center',
      type: 'Badminton',
      sport: 'badminton',
      indoor: true,
      price: 70000,
      rating: 4.2,
      image: '🏸',
      description: 'Lapangan badminton untuk latihan dengan harga terjangkau. Fasilitas memadai untuk pemula hingga menengah.',
      facilities: ['AC', 'Lighting', 'Parkir Motor', 'Toilet'],
      location: 'Jl. Pahlawan No. 45, Sidoarjo',
      address: 'Jl. Pahlawan No. 45, Sidoarjo, Jawa Timur',
      phone: '(031) 8901234',
      operatingHours: '07:00 - 22:00'
    },
    {
      id: '9',
      name: 'Lapangan Voli Pantai',
      venue: 'Sidoarjo Beach Sport Arena',
      type: 'Voli Pantai',
      sport: 'volleyball',
      indoor: false,
      price: 100000,
      rating: 4.5,
      image: '🏐',
      description: 'Lapangan voli pantai dengan pasir putih berkualitas, area yang luas dan pemandangan pantai yang menawan.',
      facilities: ['Beach Area', 'Shower', 'Rest Area', 'Parkir Mobil', 'Parkir Motor', 'Warung Makan', 'Toilet'],
      location: 'Pantai Sidoarjo, Jawa Timur',
      address: 'Pantai Sidoarjo, Kec. Sedati, Jawa Timur',
      phone: '(031) 8934567',
      operatingHours: '06:00 - 18:00'
    }
  ];

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

  useEffect(() => {
    // Simulasi loading data
    const timer = setTimeout(() => {
      const foundVenue = courts.find(court => court.id === id);
      setVenue(foundVenue || null);
      Loading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  const handleBookNow = () => {
    // Navigate to BookingPage with venueId to skip to time selection step
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

  const handleCheckAvailability = () => {
    // Navigate to BookingPage untuk cek availability
    navigate('/booking', {
      state: {
        selectedDate: selectedDate,
        selectedCourt: venue?.id,
        fromVenueDetail: true
      }
    });
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
                className={`thumbnail ${selectedImage === index ? 'active'  : ''}`}
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