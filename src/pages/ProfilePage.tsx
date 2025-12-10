import React, { useState } from 'react';
import '../styles/ProfilePage.css';

interface ProfilePageProps {
  user?: any;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'bookings' | 'reviews' | 'membership'>('profile');
  const [userData, setUserData] = useState(() => ({
    name: user?.name ?? 'John Doe',
    email: user?.email ?? 'john.doe@example.com',
    phone: user?.phone ?? '+6281234567890',
    address: 'Sidoarjo, Jawa Timur',
    membership: 'regular' // 'regular', 'premium', 'none'
  }));

  const bookings = [
    {
      id: '1',
      venue: 'GOR Sidoarjo Sport Center',
      date: '2024-01-15',
      time: '19:00 - 20:00',
      status: 'completed',
      price: 150000
    },
    {
      id: '2',
      venue: 'Lapangan Basket Sidoarjo',
      date: '2024-01-20',
      time: '17:00 - 18:00',
      status: 'upcoming',
      price: 100000
    }
  ];

  const renderProfile = () => (
    <div className="card">
      <h2 style={{ marginBottom: '24px' }}>Profil Saya</h2>
      <div className="grid grid-2">
        <div>
          <div className="form-group">
            <label className="form-label">Nama Lengkap</label>
            <input
              type="text"
              className="form-input"
              value={userData.name}
              onChange={(e) => setUserData({...userData, name: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={userData.email}
              onChange={(e) => setUserData({...userData, email: e.target.value})}
            />
          </div>
        </div>
        <div>
          <div className="form-group">
            <label className="form-label">Nomor Telepon</label>
            <input
              type="tel"
              className="form-input"
              value={userData.phone}
              onChange={(e) => setUserData({...userData, phone: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Alamat</label>
            <input
              type="text"
              className="form-input"
              value={userData.address}
              onChange={(e) => setUserData({...userData, address: e.target.value})}
            />
          </div>
        </div>
      </div>
      <button className="btn btn-primary">Simpan Perubahan</button>
    </div>
  );

   const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [selectedMembership, setSelectedMembership] = useState('premium');

  const membershipPlans = [
    {
      id: 'premium',
      name: 'Premium Membership',
      price: 150000,
      duration: 'per bulan',
      benefits: [
        'Diskon 20% untuk semua booking',
        'Prioritas booking',
        'Free cancellation',
        'Akses ke lapangan eksklusif',
        'Welcome drink setiap booking'
      ]
    },
    {
      id: 'gold',
      name: 'Gold Membership',
      price: 300000,
      duration: 'per 3 bulan',
      benefits: [
        'Diskon 25% untuk semua booking',
        'Prioritas booking maksimal',
        'Free cancellation 24 jam',
        'Akses semua lapangan premium',
        'Free merchandise'
      ]
    }
  ];

  const renderBookings = () => (
    <div className="card">
      <h2 style={{ marginBottom: '24px' }}>Riwayat Booking</h2>
      <div className="booking-list">
        {bookings.map(booking => (
          <div key={booking.id} className="card" style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <h3 style={{ marginBottom: '8px' }}>{booking.venue}</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  📅 {booking.date} | 🕒 {booking.time}
                </p>
                <p style={{ fontWeight: 'bold', color: 'var(--primary)' }}>
                  Rp {booking.price.toLocaleString()}
                </p>
              </div>
              <div>
                <span 
                  style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    background: booking.status === 'completed' ? 'var(--success)' : 'var(--warning)',
                    color: 'white'
                  }}
                >
                  {booking.status === 'completed' ? 'Selesai' : 'Akan Datang'}
                </span>
              </div>
            </div>
            {booking.status === 'completed' && (
              <button className="btn btn-outline" style={{ marginTop: '12px', width: '100%' }}>
                ⭐ Beri Rating
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderReviews = () => (
    <div className="card">
      <h2 style={{ marginBottom: '24px' }}>Ulasan Saya</h2>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '32px' }}>
        Belum ada ulasan. Mulai beri rating setelah menyelesaikan booking!
      </p>
    </div>
  );

  const renderMembership = () => (
    <div className="card membership-section">
      <h2 style={{ marginBottom: '24px' }}>Keanggotaan</h2>
      
      {userData.membership === 'none' ? (
        <div className="no-membership">
          <div className="membership-icon">👑</div>
          <h3>Belum Terdaftar Membership</h3>
          <p>Daftar sekarang untuk mendapatkan diskon dan manfaat eksklusif!</p>
          <button 
            className="btn btn-primary"
            onClick={() => setShowMembershipModal(true)}
          >
            Daftar Membership
          </button>
        </div>
      ) : (
        <div className="active-membership">
          <div className="membership-card">
            <div className="membership-header">
              <h3>{userData.membership === 'premium' ? 'Premium Membership' : 'Gold Membership'}</h3>
              <span className="membership-status active">Aktif</span>
            </div>
            <div className="membership-benefits">
              <h4>Manfaat Anda:</h4>
              <ul>
                <li>✓ Diskon 20% untuk semua booking</li>
                <li>✓ Prioritas booking</li>
                <li>✓ Free cancellation</li>
                <li>✓ Akses eksklusif</li>
              </ul>
            </div>
            <div className="membership-actions">
              <button className="btn btn-outline">Perpanjang</button>
              <button className="btn btn-outline">Upgrade</button>
            </div>
          </div>
        </div>
      )}

      {/* Membership Modal */}
      {showMembershipModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Pilih Membership</h3>
              <button 
                className="close-btn"
                onClick={() => setShowMembershipModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="membership-options">
              {membershipPlans.map(plan => (
                <div 
                  key={plan.id}
                  className={`membership-option ${selectedMembership === plan.id ? 'selected' : ''}`}
                  onClick={() => setSelectedMembership(plan.id)}
                >
                  <h4>{plan.name}</h4>
                  <div className="price">Rp {plan.price.toLocaleString()}</div>
                  <div className="duration">{plan.duration}</div>
                  
                  <ul className="benefits-list">
                    {plan.benefits.map((benefit, idx) => (
                      <li key={idx}>✓ {benefit}</li>
                    ))}
                  </ul>
                  
                  <button className="btn btn-primary">Pilih</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="profile-page">
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div 
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              color: 'white'
            }}
          >
            👤
          </div>
          <div>
            <h1>{userData.name}</h1>
            <p style={{ color: 'var(--text-secondary)' }}>{userData.email}</p>
            <p style={{ color: 'var(--text-secondary)' }}>Member sejak Jan 2024</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid var(--background)' }}>
          {[
            { id: 'profile', label: 'Profil' },
            { id: 'bookings', label: 'Booking' },
            { id: 'reviews', label: 'Ulasan' },
            { id: 'membership', label: 'Membership' }
          ].map(tab => (
            <button
              key={tab.id}
              className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveTab(tab.id as any)}
              style={{ borderRadius: '8px 8px 0 0' }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'profile' && renderProfile()}
      {activeTab === 'bookings' && renderBookings()}
      {activeTab === 'reviews' && renderReviews()}
      {activeTab === 'membership' && renderMembership()}
    </div>
  );
};

export default ProfilePage; 