// src/pages/AuthPage.tsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import '../components/auth/AuthForms.css';

interface AuthPageProps {
  onSuccess: (userData: any) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const urlMode = searchParams.get('mode');
    if (urlMode === 'login' || urlMode === 'register') {
      setMode(urlMode);
    }
  }, [searchParams]);

  const handleAuthSuccess = (userData: any) => {
    onSuccess(userData);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="auth-page">
      {/* Header */}
      <header className="auth-header">
        <div className="logo">
          <h1>🏆 Courtly</h1>
        </div>
      </header>

      {/* Auth Container */}
      <div className="auth-container">
        <div className="auth-card">
          {/* Tabs */}

          {/* Welcome Message */}
          <div className="auth-welcome">
            <h2>
              {mode === 'login' ? 'Selamat Datang Kembali!' : 'Bergabung dengan Courtly'}
            </h2>
            <p>
              {mode === 'login' 
                ? 'Masuk ke akun Anda untuk mulai booking lapangan' 
                : 'Daftar sekarang untuk pengalaman booking yang lebih baik'
              }
            </p>
          </div>

          {/* Form */}
          {mode === 'login' ? (
            <LoginForm onSuccess={handleAuthSuccess} />
          ) : (
            <RegisterForm onSuccess={handleAuthSuccess} />
          )}

          {/* Switch Mode */}
          <div className="auth-switch">
            <p>
              {mode === 'login' ? 'Belum punya akun?' : 'Sudah punya akun?'}{' '}
              <button 
                className="switch-link"
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              >
                {mode === 'login' ? 'Daftar di sini' : 'Masuk di sini'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;