// src/components/auth/LoginForm.tsx
import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from '../../graphql/queries';
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
  const [error, setError] = useState('');

  // 1. Kunci Perbaikan: Jangan pakai onCompleted di sini agar tidak panggil onSuccess 2x
  const [login, { loading }] = useMutation(LOGIN_MUTATION);

  useEffect(() => {
    if (initialEmail) {
      setFormData(prev => ({ ...prev, email: initialEmail }));
    }
  }, [initialEmail]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  // 2. HANYA GUNAKAN SATU handleSubmit (Hapus versi mock data)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Jalankan mutasi login
      const result = await login({
        variables: { 
          email: formData.email, 
          password: formData.password 
        }
      });

      // Ambil data dari hasil login (berisi token dan user)
      if (result.data?.login) {
        onSuccess(result.data.login); 
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || 'Email atau password salah');
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
            Mempro ses...
          </>
        ) : (
          'Masuk ke Akun'
        )}
      </button>
    </form>
  );
};

export default LoginForm;