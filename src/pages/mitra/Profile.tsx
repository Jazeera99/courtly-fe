// src/pages/mitra/Profile.tsx
import React, { useState } from 'react';
import { Camera, Save, Upload, Bell, Lock, Shield } from 'lucide-react';
import '../../styles/PartnerDashboard.css';

const MitraProfile: React.FC = () => {
  const [profile, setProfile] = useState({
    name: 'Vosue Akiti',
    email: 'vosue.akiti@gor-sidonjo.com',
    phone: '0019 990124',
    venueName: 'GOR Sidonjo Sport Center',
    address: 'Jl. Shisham Ma No. 45, Sidonjo',
    businessHours: '07:00 - 22:00',
    description: 'Venue olahraga terbaik di Sidonjo dengan fasilitas lengkap dan pelayanan prima.',
    notifications: {
      bookingConfirmation: true,
      paymentReminder: true,
      maintenanceAlert: true,
      monthlyReport: true
    }
  });

  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationToggle = (field: string) => {
    setProfile(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: !prev.notifications[field]
      }
    }));
  };

  const handleSaveProfile = () => {
    // Simpan profil ke backend
    console.log('Saving profile:', profile);
    alert('Profil berhasil disimpan!');
  };

  const handleChangePassword = () => {
    if (password.new !== password.confirm) {
      alert('Password baru tidak cocok!');
      return;
    }
    // Ganti password
    console.log('Changing password');
    alert('Password berhasil diubah!');
    setPassword({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="mitra-page fullscreen-content">
      <div className="page-content">
        <div className="page-header">
          <h1>👤 Profil & Pengaturan</h1>
          <p>Kelola profil dan pengaturan akun Anda</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
          {/* Left Sidebar */}
          <div>
            <div style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              textAlign: 'center',
              marginBottom: '24px'
            }}>
              <div style={{ position: 'relative', marginBottom: '24px' }}>
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  backgroundColor: '#3b82f6',
                  margin: '0 auto 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '2.5rem',
                  fontWeight: 'bold'
                }}>
                  VA
                </div>
                <button style={{
                  position: 'absolute',
                  bottom: '0',
                  right: 'calc(50% - 60px)',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Camera size={18} />
                </button>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
                {profile.name}
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '16px' }}>
                Pemilik Venue
              </p>

              <div style={{
                backgroundColor: '#f9fafb',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#6b7280' }}>Bergabung</span>
                  <span style={{ fontWeight: '600' }}>Jan 2023</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Total Booking</span>
                  <span style={{ fontWeight: '600' }}>1,245</span>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                Menu Pengaturan
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button style={{
                  textAlign: 'left',
                  padding: '12px 16px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}>
                  📝 Informasi Profil
                </button>
                <button style={{
                  textAlign: 'left',
                  padding: '12px 16px',
                  backgroundColor: '#f9fafb',
                  color: '#1f2937',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}>
                  🔐 Keamanan
                </button>
                <button style={{
                  textAlign: 'left',
                  padding: '12px 16px',
                  backgroundColor: '#f9fafb',
                  color: '#1f2937',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}>
                  🔔 Notifikasi
                </button>
                <button style={{
                  textAlign: 'left',
                  padding: '12px 16px',
                  backgroundColor: '#f9fafb',
                  color: '#1f2937',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}>
                  🏢 Informasi Venue
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div>
            {/* Profile Information */}
            <div style={{
              backgroundColor: 'white',
              padding: '32px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              marginBottom: '32px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937' }}>
                  Informasi Profil
                </h2>
                <button 
                  className="btn btn-primary"
                  onClick={handleSaveProfile}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Save size={18} />
                  Simpan Perubahan
                </button>
              </div>

              <div className="grid-2" style={{ marginBottom: '24px' }}>
                <div className="form-group">
                  <label className="form-label">Nama Lengkap</label>
                  <input
                    type="text"
                    className="form-input"
                    value={profile.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={profile.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Nomor Telepon</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={profile.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Nama Venue</label>
                  <input
                    type="text"
                    className="form-input"
                    value={profile.venueName}
                    onChange={(e) => handleInputChange('venueName', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">Alamat Venue</label>
                <textarea
                  className="form-textarea"
                  value={profile.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Jam Operasional</label>
                  <input
                    type="text"
                    className="form-input"
                    value={profile.businessHours}
                    onChange={(e) => handleInputChange('businessHours', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Deskripsi Venue</label>
                  <input
                    type="text"
                    className="form-input"
                    value={profile.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div style={{
              backgroundColor: 'white',
              padding: '32px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              marginBottom: '32px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <Shield size={24} color="#3b82f6" />
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937' }}>
                  Keamanan Akun
                </h2>
              </div>

              <div className="grid-2" style={{ marginBottom: '24px' }}>
                <div className="form-group">
                  <label className="form-label">Password Saat Ini</label>
                  <input
                    type="password"
                    className="form-input"
                    value={password.current}
                    onChange={(e) => setPassword(prev => ({ ...prev, current: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password Baru</label>
                  <input
                    type="password"
                    className="form-input"
                    value={password.new}
                    onChange={(e) => setPassword(prev => ({ ...prev, new: e.target.value }))}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">Konfirmasi Password Baru</label>
                <input
                  type="password"
                  className="form-input"
                  value={password.confirm}
                  onChange={(e) => setPassword(prev => ({ ...prev, confirm: e.target.value }))}
                />
              </div>

              <button 
                className="btn btn-primary"
                onClick={handleChangePassword}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Lock size={18} />
                Ganti Password
              </button>
            </div>

            {/* Notification Settings */}
            <div style={{
              backgroundColor: 'white',
              padding: '32px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <Bell size={24} color="#3b82f6" />
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937' }}>
                  Pengaturan Notifikasi
                </h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {Object.entries(profile.notifications).map(([key, value]) => (
                  <div key={key} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px'
                  }}>
                    <div>
                      <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                        {key === 'bookingConfirmation' && 'Konfirmasi Booking'}
                        {key === 'paymentReminder' && 'Pengingat Pembayaran'}
                        {key === 'maintenanceAlert' && 'Alert Perawatan'}
                        {key === 'monthlyReport' && 'Laporan Bulanan'}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {key === 'bookingConfirmation' && 'Notifikasi saat ada booking baru'}
                        {key === 'paymentReminder' && 'Pengingat untuk pembayaran yang belum lunas'}
                        {key === 'maintenanceAlert' && 'Alert untuk jadwal perawatan lapangan'}
                        {key === 'monthlyReport' && 'Laporan kinerja bulanan'}
                      </div>
                    </div>
                    <button
                      onClick={() => handleNotificationToggle(key)}
                      style={{
                        width: '48px',
                        height: '24px',
                        backgroundColor: value ? '#3b82f6' : '#d1d5db',
                        borderRadius: '12px',
                        border: 'none',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{
                        position: 'absolute',
                        top: '2px',
                        left: value ? '26px' : '2px',
                        width: '20px',
                        height: '20px',
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        transition: 'all 0.2s'
                      }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MitraProfile;