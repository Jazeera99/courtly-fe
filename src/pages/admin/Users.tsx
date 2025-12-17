import React, { useState } from 'react';
import UserTable from '../../components/admin/UserTable';
import '../../styles/AdminDashboard.css';

const Users: React.FC = () => {
  const [users] = useState([
    { id: 1, name: 'Ahmad Rizki', email: 'ahmad@example.com', joinDate: '15 Jan 2024', status: 'active' },
    { id: 2, name: 'Budi Santoso', email: 'budi@example.com', joinDate: '14 Jan 2024', status: 'active' },
    { id: 3, name: 'Citra Dewi', email: 'citra@example.com', joinDate: '13 Jan 2024', status: 'pending' },
    { id: 4, name: 'Dian Permata', email: 'dian@example.com', joinDate: '12 Jan 2024', status: 'active' },
    { id: 5, name: 'Eko Pratama', email: 'eko@example.com', joinDate: '11 Jan 2024', status: 'inactive' },
    { id: 6, name: 'Fani Anggraini', email: 'fani@example.com', joinDate: '10 Jan 2024', status: 'active' },
    { id: 7, name: 'Gilang Ramadhan', email: 'gilang@example.com', joinDate: '09 Jan 2024', status: 'pending' },
    { id: 8, name: 'Hana Putri', email: 'hana@example.com', joinDate: '08 Jan 2024', status: 'active' },
  ]);

  return (
    <div className="admin-page" style={{ padding: 32 , paddingRight: 50}}>
      <div className="dashboard-header">
        <div className="header-left">
          <h1>Kelola Pengguna</h1>
          <p className="header-subtitle">Kelola semua pengguna sistem Courtly</p>
        </div>
        <div className="header-info">
          <button className="btn-manage" onClick={() => console.log('Tambah pengguna')}>
            + Tambah Pengguna
          </button>
        </div>
      </div>

      <div className="stats-grid" style={{ marginBottom: 36 }}>
        <div className="stat-card blue">
          <div className="stat-header">
            <div className="stat-icon">👥</div>
            <span className="trend up">+12%</span>
          </div>
          <div className="stat-content">
            <h3>1,542</h3>
            <p>Total Pengguna</p>
          </div>
          <div className="stat-footer">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-header">
            <div className="stat-icon">✅</div>
            <span className="trend up">+8%</span>
          </div>
          <div className="stat-content">
            <h3>1,245</h3>
            <p>Pengguna Aktif</p>
          </div>
          <div className="stat-footer">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '90%' }}></div>
            </div>
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-header">
            <div className="stat-icon">⏳</div>
            <span className="trend down">-5%</span>
          </div>
          <div className="stat-content">
            <h3>42</h3>
            <p>Menunggu Verifikasi</p>
          </div>
          <div className="stat-footer">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '15%' }}></div>
            </div>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-header">
            <div className="stat-icon">⭐</div>
            <span className="trend up">+15%</span>
          </div>
          <div className="stat-content">
            <h3>289</h3>
            <p>Pengguna Premium</p>
          </div>
          <div className="stat-footer">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="content-card">
        <div className="card-header">
          <h2>
            <span style={{ fontSize: '24px' }}>📋</span>
            Daftar Pengguna
          </h2>
          <div style={{ display: 'flex', gap: 12 }}>
            <select style={{ padding: '10px 16px', borderRadius: 12, border: '2px solid #e5e7eb' }}>
              <option>Filter Status</option>
              <option>Semua</option>
              <option>Aktif</option>
              <option>Menunggu</option>
            </select>
            <input 
              placeholder="Cari pengguna..." 
              style={{ padding: '10px 16px', borderRadius: 12, border: '2px solid #e5e7eb', width: 200 }}
            />
          </div>
        </div>

        <div className="table-container">
          <UserTable users={users} />
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginTop: 24,
          padding: '16px 24px',
          borderTop: '1px solid #e5e7eb'
        }}>
          <div style={{ color: '#6b7280', fontSize: 14 }}>
            Menampilkan 1-8 dari 1,542 pengguna
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8 }}>←</button>
            <button style={{ padding: '8px 12px', background: '#3b82f6', color: 'white', borderRadius: 8 }}>1</button>
            <button style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8 }}>2</button>
            <button style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8 }}>→</button>
          </div>
        </div>
      </div>

      <div className="content-grid" style={{ marginTop: 36 }}>
        <div className="content-card">
          <h2 style={{ marginBottom: 20 }}>📈 Pertumbuhan Pengguna</h2>
          <div style={{ height: 200, position: 'relative', padding: 20 }}>
            <div style={{ 
              position: 'absolute', 
              bottom: 0, 
              left: 0, 
              right: 0, 
              display: 'flex', 
              alignItems: 'flex-end', 
              gap: 24,
              padding: '0 40px'
            }}>
              {[60, 80, 95, 120, 110, 140, 130].map((height, index) => (
                <div key={index} style={{ textAlign: 'center', flex: 1 }}>
                  <div 
                    style={{ 
                      height: `${height}px`, 
                      background: 'linear-gradient(to top, #10b981, #34d399)',
                      borderRadius: '8px 8px 0 0',
                      marginBottom: 8
                    }}
                  ></div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'][index]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="content-card">
          <h2 style={{ marginBottom: 20 }}>🚀 Aksi Cepat</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button 
              className="action-btn" 
              style={{ justifyContent: 'flex-start', padding: '16px 24px' }}
              onClick={() => console.log('Verifikasi pengguna')}
            >
              ✅ Verifikasi Pengguna Menunggu
            </button>
            <button 
              className="action-btn" 
              style={{ justifyContent: 'flex-start', padding: '16px 24px' }}
              onClick={() => console.log('Kirim email')}
            >
              📧 Kirim Email Broadcast
            </button>
            <button 
              className="action-btn" 
              style={{ justifyContent: 'flex-start', padding: '16px 24px' }}
              onClick={() => console.log('Export data')}
            >
              📥 Export Data Pengguna
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;