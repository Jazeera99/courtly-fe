import React, { useState } from 'react';

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'bookings' | 'reviews'>('profile');
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+6281234567890',
    address: 'Sidoarjo, Jawa Timur'
  });

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
            { id: 'reviews', label: 'Ulasan' }
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
    </div>
  );
};

export default ProfilePage; 