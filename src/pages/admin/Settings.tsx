import React, { useState } from 'react';
import '../../styles/AdminDashboard.css';

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    siteName: 'Courtly Admin',
    siteUrl: 'https://courtly.admin',
    adminEmail: 'admin@courtly.com',
    currency: 'IDR',
    timezone: 'Asia/Jakarta',
    maintenanceMode: false,
    notifications: {
      email: true,
      push: true,
      sms: false
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNotificationChange = (key: string) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key as keyof typeof prev.notifications]
      }
    }));
  };

  const handleSaveSettings = () => {
    console.log('Settings saved:', settings);
    alert('Pengaturan berhasil disimpan!');
  };

  const handleResetSettings = () => {
    setSettings({
      siteName: 'Courtly Admin',
      siteUrl: 'https://courtly.admin',
      adminEmail: 'admin@courtly.com',
      currency: 'IDR',
      timezone: 'Asia/Jakarta',
      maintenanceMode: false,
      notifications: {
        email: true,
        push: true,
        sms: false
      }
    });
  };

  return (
    <div className="admin-page" style={{ padding: 32 , paddingRight: 70}}>
      <div className="dashboard-header">
        <div className="header-left">
          <h1>Pengaturan Sistem</h1>
          <p className="header-subtitle">Kelola konfigurasi dan preferensi sistem</p>
        </div>
        <div className="header-info">
          <div style={{ display: 'flex', gap: 12 }}>
            <button 
              className="btn-manage" 
              style={{ background: '#6b7280' }}
              onClick={handleResetSettings}
            >
              Reset
            </button>
            <button 
              className="btn-manage" 
              onClick={handleSaveSettings}
            >
              Simpan Pengaturan
            </button>
          </div>
        </div>
      </div>

      <div className="content-grid">
        <div className="content-card">
          <h2 style={{ marginBottom: 24 }}>⚙️ Pengaturan Umum</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151' }}>
                Nama Situs
              </label>
              <input
                type="text"
                name="siteName"
                value={settings.siteName}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 12,
                  border: '2px solid #e5e7eb',
                  fontSize: 14
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151' }}>
                URL Situs
              </label>
              <input
                type="url"
                name="siteUrl"
                value={settings.siteUrl}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 12,
                  border: '2px solid #e5e7eb',
                  fontSize: 14
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151' }}>
                Email Admin
              </label>
              <input
                type="email"
                name="adminEmail"
                value={settings.adminEmail}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 12,
                  border: '2px solid #e5e7eb',
                  fontSize: 14
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151' }}>
                  Mata Uang
                </label>
                <select
                  value={settings.currency}
                  onChange={(e) => setSettings(prev => ({ ...prev, currency: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 12,
                    border: '2px solid #e5e7eb',
                    fontSize: 14
                  }}
                >
                  <option value="IDR">IDR (Rupiah)</option>
                  <option value="USD">USD (Dollar)</option>
                  <option value="SGD">SGD (Dollar Singapura)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151' }}>
                  Zona Waktu
                </label>
                <select
                  value={settings.timezone}
                  onChange={(e) => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 12,
                    border: '2px solid #e5e7eb',
                    fontSize: 14
                  }}
                >
                  <option value="Asia/Jakarta">WIB (Jakarta)</option>
                  <option value="Asia/Makassar">WITA (Makassar)</option>
                  <option value="Asia/Jayapura">WIT (Jayapura)</option>
                </select>
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '16px',
              background: settings.maintenanceMode ? '#fee2e2' : '#f8fafc',
              borderRadius: 12,
              border: `2px solid ${settings.maintenanceMode ? '#ef4444' : '#e5e7eb'}`
            }}>
              <div>
                <div style={{ fontWeight: 600 }}>Mode Maintenance</div>
                <div style={{ fontSize: 13, color: '#6b7280' }}>
                  Matikan akses publik ke sistem
                </div>
              </div>
              <label style={{ position: 'relative', display: 'inline-block' }}>
                <input
                  type="checkbox"
                  name="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onChange={handleInputChange}
                  style={{ display: 'none' }}
                />
                <div style={{
                  width: 52,
                  height: 28,
                  background: settings.maintenanceMode ? '#ef4444' : '#d1d5db',
                  borderRadius: 14,
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s'
                }}>
                  <div style={{
                    width: 24,
                    height: 24,
                    background: 'white',
                    borderRadius: '50%',
                    position: 'absolute',
                    top: 2,
                    left: settings.maintenanceMode ? 26 : 2,
                    transition: 'left 0.3s'
                  }}></div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="content-card">
          <h2 style={{ marginBottom: 24 }}>🔔 Notifikasi</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { key: 'email', label: 'Email Notifikasi', description: 'Kirim notifikasi via email' },
              { key: 'push', label: 'Push Notifikasi', description: 'Kirim notifikasi push ke admin' },
              { key: 'sms', label: 'SMS Notifikasi', description: 'Kirim notifikasi via SMS (opsional)' },
            ].map((notif) => (
              <div key={notif.key} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '16px',
                background: '#f8fafc',
                borderRadius: 12,
                border: `2px solid ${settings.notifications[notif.key as keyof typeof settings.notifications] ? '#10b981' : '#e5e7eb'}`
              }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{notif.label}</div>
                  <div style={{ fontSize: 13, color: '#6b7280' }}>{notif.description}</div>
                </div>
                <label style={{ position: 'relative', display: 'inline-block' }}>
                  <input
                    type="checkbox"
                    checked={settings.notifications[notif.key as keyof typeof settings.notifications]}
                    onChange={() => handleNotificationChange(notif.key)}
                    style={{ display: 'none' }}
                  />
                  <div style={{
                    width: 52,
                    height: 28,
                    background: settings.notifications[notif.key as keyof typeof settings.notifications] ? '#10b981' : '#d1d5db',
                    borderRadius: 14,
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s'
                  }}>
                    <div style={{
                      width: 24,
                      height: 24,
                      background: 'white',
                      borderRadius: '50%',
                      position: 'absolute',
                      top: 2,
                      left: settings.notifications[notif.key as keyof typeof settings.notifications] ? 26 : 2,
                      transition: 'left 0.3s'
                    }}></div>
                  </div>
                </label>
              </div>
            ))}
          </div>

          <h2 style={{ margin: '32px 0 24px' }}>🔐 Keamanan</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <button 
              className="btn-manage" 
              style={{ background: '#3b82f6' }}
              onClick={() => console.log('Ganti password')}
            >
              Ganti Password Admin
            </button>
            <button 
              className="btn-manage" 
              style={{ background: '#f59e0b' }}
              onClick={() => console.log('Log aktivitas')}
            >
              Lihat Log Aktivitas
            </button>
            <button 
              className="btn-manage" 
              style={{ background: '#ef4444' }}
              onClick={() => console.log('Hapus cache')}
            >
              Hapus Cache Sistem
            </button>
          </div>
        </div>
      </div>

      {/* <div className="content-card" style={{ marginTop: 36 }}>
        <h2 style={{ marginBottom: 24 }}>📋 Informasi Sistem</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: 24 
        }}>
          {[
            { label: 'Versi Aplikasi', value: 'v2.1.4' },
            { label: 'Database', value: 'PostgreSQL 14.0' },
            { label: 'Server', value: 'Node.js 18.0' },
            { label: 'Framework', value: 'React 18.2' },
            { label: 'Storage', value: '2.5 GB / 10 GB' },
            { label: 'Uptime', value: '99.8%' },
            { label: 'Response Time', value: '120ms' },
            { label: 'Last Backup', value: '15 Jan 2024' },
          ].map((info, index) => (
            <div key={index} style={{ 
              padding: '16px', 
              background: '#f8fafc', 
              borderRadius: 12 
            }}>
              <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>{info.label}</div>
              <div style={{ fontWeight: 600, fontSize: 16 }}>{info.value}</div>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default AdminSettings;