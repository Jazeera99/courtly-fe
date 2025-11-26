// src/components/Header/Header.tsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../App.css';
import LoginForm from './auth/LoginForm';
import RegisterForm from './auth/RegisterForm';

interface HeaderProps {
  userRole: string;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onLogin: (userData: any) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  userRole, 
  darkMode, 
  onToggleDarkMode,
  onLogin,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const location = useLocation();
  const navigate = useNavigate();

  const getNavLinks = () => {
    const baseLinks = [
      { path: '/', label: 'Beranda', icon: '🏠' },
      { path: '/booking', label: 'Lapangan', icon: '📅' },
    ];

    if (userRole === 'user') {
      return [...baseLinks, 
        { path: '/profile', label: 'Profil', icon: '👤' }
      ];
    }

    if (userRole === 'vendor') {
      return [...baseLinks,
        { path: '/vendor', label: 'Dashboard', icon: '🏪' }
      ];
    }

    if (userRole === 'admin') {
      return [...baseLinks,
        { path: '/admin', label: 'Admin', icon: '⚙️' }
      ];
    }

    return baseLinks;
  };

  const handleAuthSuccess = (userData: any) => {
    onLogin(userData);
    setShowAuthModal(false);
    navigate('/profile');
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuthModal(true);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo">
            <span className="logo-icon">🏸</span>
            <span>Courtly Sidoarjo</span>
          </Link>

          <nav className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`}>
            {getNavLinks().map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span style={{ marginRight: '8px' }}>{link.icon}</span>
                {link.label}
              </Link>
            ))}
            
            <button 
              className="nav-link"
              onClick={onToggleDarkMode}
              aria-label="Toggle dark mode"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>

            {userRole === 'guest' ? (
              <div className="auth-buttons">
                <button 
                  className="btn btn-outline"
                  onClick={() => navigate('/auth?mode=login')}
                  style={{ color: 'white', borderColor: 'white' }}
                >
                  Masuk
                </button>
                <button 
                  className="btn btn-accent"
                  onClick={() => navigate('/auth?mode=register')}
                >
                  Daftar
                </button>
              </div>
            ) : (
              <div className="user-menu">
                <span className="user-greeting">Hai, {user?.name || 'User'}!</span>
                <button 
                  className="btn btn-outline"
                  onClick={handleLogout}
                  style={{ color: 'white', borderColor: 'white' }}
                >
                  Keluar
                </button>
              </div>
            )}
          </nav>

          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal 
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onSwitchMode={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
          onSuccess={handleAuthSuccess}
        />
      )}
    </>
  );
};

// Komponen Auth Modal
interface AuthModalProps {
  mode: 'login' | 'register';
  onClose: () => void;
  onSwitchMode: () => void;
  onSuccess: (userData: any) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ mode, onClose, onSwitchMode, onSuccess }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === 'login' ? 'Masuk ke Akun' : 'Daftar Akun Baru'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        
        <div className="modal-body">
          {mode === 'login' ? (
            <LoginForm onSuccess={onSuccess} />
          ) : (
            <RegisterForm onSuccess={onSuccess} />
          )}
          
          <div className="auth-switch">
            <p>
              {mode === 'login' ? 'Belum punya akun?' : 'Sudah punya akun?'}
              <button 
                className="switch-mode-btn"
                onClick={onSwitchMode}
              >
                {mode === 'login' ? ' Daftar di sini' : ' Masuk di sini'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;