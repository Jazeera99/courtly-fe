import React from 'react';
import { useNavigate } from 'react-router-dom';

interface LandingPageProps {
  onNavigate?: (page: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const navigate = useNavigate();

  const handleNavigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    } else {
      navigate(`/${page}`);
    }
  };

  const features = [
    {
      icon: '🔍',
      title: 'Lihat Jadwal Lapangan',
      description: 'Cek ketersediaan lapangan favoritmu kapan saja'
    },
    {
      icon: '📅',
      title: 'Booking Mudah',
      description: 'Pesan lapangan hanya dalam beberapa klik'
    },
    {
      icon: '💳',
      title: 'Pembayaran Aman',
      description: 'Bayar dengan Midtrans yang terpercaya'
    },
    {
      icon: '⭐',
      title: 'Rating & Ulasan',
      description: 'Beri penilaian untuk pengalaman yang lebih baik'
    }
  ];

  const popularVenues = [
    {
      name: 'GOR Sidoarjo Sport Center',
      image: '🏟️',
      rating: 4.8,
      price: 'Rp 150.000/jam',
      type: 'Futsal & Badminton'
    },
    {
      name: 'Lapangan Basket Sidoarjo',
      image: '🏀',
      rating: 4.6,
      price: 'Rp 100.000/jam',
      type: 'Basket'
    },
    {
      name: 'Sidoarjo Tennis Court',
      image: '🎾',
      rating: 4.7,
      price: 'Rp 200.000/jam',
      type: 'Tenis'
    }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Booking Lapangan Olahraga di Sidoarjo
          </h1>
          <p className="hero-subtitle">
            Temukan dan pesan lapangan olahraga favoritmu dengan mudah dan cepat. 
            Mulai dari futsal, basket, badminton, hingga tenis.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-accent"
              onClick={() => handleNavigate('booking')}
            >
              🏸 Booking Sekarang
            </button>
            <button 
              className="btn btn-outline"
              style={{ color: 'white', borderColor: 'white' }}
              onClick={() => handleNavigate('auth')}
            >
              ℹ️ Pelajari Lebih Lanjut
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2 className="section-title">Mengapa Memilih Courtly?</h2>
        <div className="feature-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Venues */}
      <section className="popular-venues">
        <h2 className="section-title">Lapangan Populer</h2>
        <div className="grid grid-3">
          {popularVenues.map((venue, index) => (
            <div key={index} className="card">
              <div style={{ fontSize: '4rem', textAlign: 'center', marginBottom: '16px' }}>
                {venue.image}
              </div>
              <h3 style={{ marginBottom: '8px' }}>{venue.name}</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>
                {venue.type}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>
                  ⭐ {venue.rating}
                </span>
                <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>
                  {venue.price}
                </span>
              </div>
              <button 
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '16px' }}
                onClick={() => handleNavigate('booking')}
              >
                📅 Booking Sekarang
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, var(--secondary), var(--secondary-dark))', color: 'white' }}>
          <h2 style={{ marginBottom: '16px' }}>Siap Mulai Berolahraga?</h2>
          <p style={{ marginBottom: '24px', opacity: 0.9 }}>
            Bergabung dengan ribuan pecinta olahraga di Sidoarjo yang sudah menggunakan Courtly
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-accent"
              onClick={() => handleNavigate('auth?mode=register')}
              style={{ fontSize: '1.1rem', padding: '12px 32px' }}
            >
              📝 Daftar Sekarang
            </button>
            <button 
              className="btn btn-outline"
              onClick={() => handleNavigate('auth?mode=login')}
              style={{ fontSize: '1.1rem', padding: '12px 32px', color: 'white', borderColor: 'white' }}
            >
              🔑 Masuk
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;