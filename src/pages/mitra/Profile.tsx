import React, { useState, useEffect } from 'react';
import { Camera, Save, Upload, Bell, Lock, Shield } from 'lucide-react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_VENUE_PROFILE } from '../../graphql/queries';
import {UPDATE_VENUE_PROFILE } from '../../graphql/mutations';
import '../../styles/PartnerDashboard.css';

const MitraProfile: React.FC = () => {
  const venueId = localStorage.getItem('venueId');
  const [activeTab, setActiveTab] = useState('profile');

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    joinedDate: '', 
    totalPaid: 0,
    businessHours: '07:00 - 17:00',
    description: 'Venue olahraga terbaik di Sidonjo dengan fasilitas lengkap dan pelayanan prima.',
    notifications: {
      bookingConfirmation: true,
      paymentReminder: true,
      maintenanceAlert: true,
      monthlyReport: true
    }
  });

  // 1. Ambil Data dari Database
  const { data, loading, refetch } = useQuery(GET_VENUE_PROFILE, {
    variables: { venueId },
    skip: !venueId,
    fetchPolicy: 'network-only',
  });

  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [updateProfile] = useMutation(UPDATE_VENUE_PROFILE);

  // Sync data dari database ke local state saat data berhasil dimuat
  useEffect(() => {
    // Cek apakah data sudah ada dan getVenueProfile tidak null
    if (data && data.getVenueProfile) {
      const v = data.getVenueProfile;

      // Format tanggal bergabung
      const joinedDate = v.created_at 
        ? new Date(v.created_at).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
        : 'Jan 2026';
      
      setProfile(prev => ({
        ...prev,
        // Kita ambil data user dari objek 'users' di dalam venue
        name: v.ownerName || '', 
        email: v.email || '',
        phone: v.phone || '',
        address: v.address || '',
        city: v.city || '',
        province: v.province || '',
        joinedDate: v.created_at || '-',
        totalPaid: v.total_bookings || 0
      }));
    }
  }, [data]);

//   useEffect(() => {
//   if (data?.getVenueProfile) {
//     const v = data.getVenueProfile;
//     setProfile(prev => ({
//       ...prev, // Ini akan menjaga data businessHours, description, dan notifications tetap ada
//       name: v.users.name,
//       email: v.users.email,
//       phone: v.users.phone || '',
//       address: v.address,
//       city: v.city,
//       province: v.province,
//     }));
//   }
// }, [data]);

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        variables: {
          input: {
            venueId: venueId,
            name: profile.name,
            phone: profile.phone,
            address: profile.address,
            city: profile.city,
            province: profile.province
            // Tambahkan field lain jika backend mendukung
          }
        }
      });
      alert('Profil berhasil diperbarui ke database!');
      refetch(); // Mengambil data terbaru lagi dari database
    } catch (error) {
      console.error("Error updating profile:", error);
      alert('Gagal menyimpan perubahan. Pastikan semua field terisi dengan benar.');
    }
  };

  if (loading) return <div className="p-8">Memuat data profil...</div>;

  const handleNotificationToggle = (field: string) => {
    setProfile(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: !prev.notifications[field as keyof typeof prev.notifications]
      }
    }));
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
          <h1>👤 Profil dan Keamanan</h1>
          <p>Kelola profil dan keamanan akun Anda</p>
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
                  {profile.name ? profile.name.substring(0, 2).toUpperCase() : '??'}
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
                  <span style={{ fontWeight: '600' }}>{profile.joinedDate}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Total Booking</span>
                  <span style={{ fontWeight: '600' }}>{profile.totalPaid}</span>
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
                {/* Tombol Profil */}
                <button 
                  onClick={() => setActiveTab('profile')}
                  style={{
                    textAlign: 'left',
                    padding: '12px 16px',
                    backgroundColor: activeTab === 'profile' ? '#3b82f6' : '#f9fafb',
                    color: activeTab === 'profile' ? 'white' : '#1f2937',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: activeTab === 'profile' ? '600' : '500',
                    transition: 'all 0.2s'
                  }}>
                  📝 Informasi Profil
                </button>

                {/* Tombol Keamanan */}
                <button 
                  onClick={() => setActiveTab('security')}
                  style={{
                    textAlign: 'left',
                    padding: '12px 16px',
                    backgroundColor: activeTab === 'security' ? '#3b82f6' : '#f9fafb',
                    color: activeTab === 'security' ? 'white' : '#1f2937',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: activeTab === 'security' ? '600' : '500',
                    transition: 'all 0.2s'
                  }}>
                  🔐 Keamanan
                </button>

                {/* Tombol Notifikasi */}
                {/* <button 
                  onClick={() => setActiveTab('notifications')}
                  style={{
                    textAlign: 'left',
                    padding: '12px 16px',
                    backgroundColor: activeTab === 'notifications' ? '#3b82f6' : '#f9fafb',
                    color: activeTab === 'notifications' ? 'white' : '#1f2937',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: activeTab === 'notifications' ? '600' : '500',
                    transition: 'all 0.2s'
                  }}>
                  🔔 Notifikasi
                </button> */}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div>
            {/* Profile Information */}
            {activeTab === 'profile' && (
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
                    <label className="form-label">Lokasi (Kota & Provinsi)</label>
                    <div className="input-row" style={{ display: 'flex', gap: '10px' }}>
                      <input
                        type="text"
                        placeholder="Kota"
                        className="form-input"
                        style={{ flex: 1 }} // Agar lebar dibagi rata
                        value={profile.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Provinsi"
                        className="form-input"
                        style={{ flex: 1 }}
                        value={profile.province}
                        onChange={(e) => handleInputChange('province', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* <div className="form-group">
                    <label className="form-label">Nama Venue</label>
                    <input
                      type="text"
                      className="form-input"
                      value={profile.venueName}
                      onChange={(e) => handleInputChange('venueName', e.target.value)}
                    />
                  </div> */}
                </div>

                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label className="form-label">Alamat Pemilik Venue</label>
                  <textarea
                    className="form-textarea"
                    value={profile.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows={3}
                  />
                </div>

                {/* <div className="grid-2">
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
                </div> */}
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
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
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MitraProfile;