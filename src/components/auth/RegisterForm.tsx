// src/components/auth/RegisterForm.tsx
import React, { useState } from 'react';
import '../../styles/AuthForms.css';

interface RegisterFormProps {
  onSuccess: (userData: any) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'user' as 'user' | 'vendor'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validateForm = (): boolean => {
    if (formData.password !== formData.confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter');
      return false;
    }

    if (!formData.phone.match(/^[0-9+\-\s()]+$/)) {
      setError('Format nomor telepon tidak valid');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock success response
      const userData = {
        id: '1',
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        role: formData.userType
      };
      
      onSuccess(userData);
    } catch (err) {
      setError('Terjadi kesalahan saat mendaftar. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="fullName" className="form-label">
          Nama Lengkap
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          className="form-input"
          placeholder="Masukkan nama lengkap Anda"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
      </div>

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
        />
      </div>

      <div className="form-group">
        <label htmlFor="phone" className="form-label">
          Nomor Telepon
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          className="form-input"
          placeholder="Contoh: 081234567890"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="userType" className="form-label">
          Jenis Akun
        </label>
        <select
          id="userType"
          name="userType"
          className="form-select"
          value={formData.userType}
          onChange={handleChange}
        >
          <option value="user">Penyewa Lapangan</option>
          <option value="vendor">Vendor/Pengelola</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          className="form-input"
          placeholder="Minimal 6 karakter"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={6}
        />
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword" className="form-label">
          Konfirmasi Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          className="form-input"
          placeholder="Ulangi password Anda"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          minLength={6}
        />
      </div>

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      <button 
        type="submit" 
        className="auth-submit-btn"
        disabled={loading || !formData.fullName || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword}
      >
        {loading ? (
          <>
            <span className="loading"></span>
            Membuat Akun...
          </>
        ) : (
          'Buat Akun Baru'
        )}
      </button>

      <div className="terms-notice">
        <p>
          Dengan mendaftar, Anda menyetujui{' '}
          <button type="button" className="terms-link">
            Syarat & Ketentuan
          </button>{' '}
          dan{' '}
          <button type="button" className="terms-link">
            Kebijakan Privasi
          </button>{' '}
          kami.
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;