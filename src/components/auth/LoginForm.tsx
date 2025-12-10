// src/components/auth/LoginForm.tsx
import React, { useState, useEffect } from 'react';
import '../../styles/AuthForms.css';

interface LoginFormProps {
  onSuccess: (userData: any) => void;
  initialEmail?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, initialEmail }) => {
  const [formData, setFormData] = useState({
    email: initialEmail || '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

   // Mock credentials untuk testing - AUTO DETECT ROLE BERDASARKAN EMAIL
  const mockUsers = [
    // Admin
    { 
      email: 'admin@courtly.com', 
      password: 'admin123', 
      role: 'admin',
      name: 'Admin Courtly',
      id: 'admin-001',
      permissions: ['manage_users', 'manage_venues', 'view_reports']
    },
    // Mitra Lapangan
    { 
      email: 'mitra@courtly.com', 
      password: 'mitra123', 
      role: 'vendor',
      name: 'Mitra Lapangan',
      id: 'vendor-001',
      venueId: 'venue-001',
      venueName: 'GOR Sidoarjo Sport Center',
      phone: '(031) 8901234'
    },
    // User Biasa
    { 
      email: 'user@courtly.com', 
      password: 'user123', 
      role: 'user',
      name: 'John Doe',
      id: 'user-001',
      phone: '081234567890'
    },
    // User lain untuk testing
    { 
      email: 'customer@gmail.com', 
      password: '123456', 
      role: 'user',
      name: 'Customer Test',
      id: 'user-002',
      phone: '081234567891'
    }
  ];

  useEffect(() => {
    if (initialEmail) {
      setFormData(prev => ({ ...prev, email: initialEmail }));
    }
  }, [initialEmail]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Cari user berdasarkan email
      const user = mockUsers.find(u => u.email === formData.email);
      
      if (!user) {
        throw new Error('Email tidak terdaftar');
      }

      // Validasi password
      if (formData.password !== user.password) {
        throw new Error('Password salah');
      }

      // Buat user data berdasarkan role
      let userData;
      if (user.role === 'admin') {
        userData = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: 'admin',
          permissions: user.permissions
        };
      } else if (user.role === 'vendor') {
        userData = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: 'vendor',
          venueId: user.venueId,
          venueName: user.venueName,
          phone: user.phone
        };
      } else {
        userData = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: 'user',
          phone: user.phone
        };
      }
      
      onSuccess(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat login');
    } finally {
      setLoading(false);
    }
  };

  return (
     <form className="auth-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="form-input"
          placeholder="Masukkan email Anda"
          value={formData.email}
          onChange={handleChange}
          required
          autoComplete="email"
        />
      </div>

      <div className="form-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <button type="button" className="forgot-password-btn">
            Lupa password?
          </button>
        </div>
        <input
          type="password"
          id="password"
          name="password"
          className="form-input"
          placeholder="Masukkan password"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={6}
          autoComplete="current-password"
        />
        {/* Info untuk testing */}
        <div className="password-hint">
          <small>
            <strong>Akun testing:</strong><br />
            • Admin: admin@courtly.com / admin123<br />
            • Mitra: mitra@courtly.com / mitra123<br />
            • User: user@courtly.com / user123
          </small>
        </div>
      </div>

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      <button 
        type="submit" 
        className="auth-submit-btn"
        disabled={loading || !formData.email || !formData.password}
      >
        {loading ? (
          <>
            <span className="loading"></span>
            Memproses...
          </>
        ) : (
          'Masuk ke Akun'
        )}
      </button>
    </form>
  );
};

export default LoginForm;