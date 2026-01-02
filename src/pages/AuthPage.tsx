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

  const handleAuthSuccess = (loginData: any) => {
    console.log("Data yang diterima AuthPage:", loginData);
    // 1. Ekstrak data dari loginData agar bisa dipakai
    // loginData biasanya berbentuk { user: {...}, token: "..." }
    const user = loginData.user;
    const token = loginData.token;

    // 2. Simpan token ke localStorage (PENTING untuk persistent login)
    if (token) {
      localStorage.setItem('token', token);
    }

    // 3. Lapor ke App.tsx (Gunakan variabel 'user' yang baru dibuat di atas)
    onSuccess(user); 

    toast.showToast('Login berhasil', 'success');
    
    const params = new URLSearchParams(window.location.search);
    const redirectTo = params.get('redirect');
    const pendingBooking = sessionStorage.getItem('pendingBooking');

    // 4. Proses Navigasi/Redirect
    setTimeout(() => {
      if (pendingBooking && user?.role === 'penyewa') {
        const bookingData = JSON.parse(pendingBooking);
        sessionStorage.removeItem('pendingBooking'); // Hapus setelah diambil
        
        navigate('/booking', { 
          state: { 
            restoreBooking: true, 
            bookingData: bookingData 
          }
        });
      } 
      // Gunakan 'user.role' (sesuai variabel yang kita buat di langkah 1)
      else if (user?.role === 'admin') {
        navigate('/admin/dashboard');
      } 
      else if (user?.role === 'mitra') {
        navigate('/partner/dashboard');
      } 
      else {
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