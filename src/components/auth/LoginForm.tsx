// src/components/auth/LoginForm.tsx
import React, { useState } from 'react';
import './AuthForms.css';

interface LoginFormProps {
  onSuccess: (userData: any) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

    // Simulasi API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock success response
      const userData = {
        id: '1',
        name: 'John Doe',
        email: formData.email,
        role: 'user' as const
      };
      
      onSuccess(userData);
    } catch (err) {
      setError('Email atau password salah. Silakan coba lagi.');
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
          placeholder="Masukkan password Anda"
          value={formData.password}
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

      <div className="auth-options">
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
          Belum punya akun?{' '}
          <button type="button" className="forgot-password-btn" style={{ fontSize: '0.9rem' }}>
            Daftar di sini
          </button>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;