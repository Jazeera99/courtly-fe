// src/pages/AuthPage.tsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import { useToast } from '../components/Toast';
import '../styles/AuthPage.css';

interface AuthPageProps {
  onSuccess: (userData: any) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [initialEmail, setInitialEmail] = useState<string | undefined>(undefined);
 
  // Get redirect path from location state
  const redirectPath = (location.state as any)?.redirectPath || '/';

  useEffect(() => {
    const urlMode = searchParams.get('mode');
    if (urlMode === 'login' || urlMode === 'register') {
      setMode(urlMode);
    }
  }, [searchParams]);

  const handleAuthSuccess = (userData: any) => {
    onSuccess(userData);
    toast.showToast('Login berhasil', 'success');
    
    // Cek apakah ada pending booking
    const pendingBooking = sessionStorage.getItem('pendingBooking');

    // Redirect berdasarkan role
    setTimeout(() => {
      if (pendingBooking) {
        // Parse dan redirect ke booking page dengan data yang disimpan
        const bookingData = JSON.parse(pendingBooking);
        
        // Redirect ke booking page dengan state
        navigate('/booking', { 
          state: { 
            restoreBooking: true,
            bookingData: bookingData
          }
        });
        
        // Hapus dari sessionStorage
        sessionStorage.removeItem('pendingBooking');
      } else if (userData.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (userData.role === 'vendor') {
        navigate('/partner/dashboard');
      } else {
        navigate(redirectPath || '/');
      }
    }, 500);
  };

  const handleRegisterSuccess = (userData: any) => {
    toast.showToast('Pendaftaran berhasil. Silakan masuk.', 'success');
    setInitialEmail(userData?.email);
    setMode('login');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          {/* Welcome Message */}
          <div className="auth-welcome">
            <h2>
              {mode === 'login' ? 'Selamat Datang!' : 'Bergabung dengan Courtly'}
            </h2>
            <p>
              {mode === 'login' 
                ? 'Masuk ke akun Anda untuk melanjutkan' 
                : 'Daftar sekarang untuk pengalaman booking yang lebih baik'
              }
            </p>
          </div>

          {/* Form */}
          {mode === 'login' ? (
              <LoginForm 
                onSuccess={handleAuthSuccess} 
                initialEmail={initialEmail}
              />
          ) : (
            <RegisterForm 
              onSuccess={handleRegisterSuccess} 
            />
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