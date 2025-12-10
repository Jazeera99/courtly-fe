// src/components/Header/Header.tsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../App.css';
// auth handled on separate pages

interface HeaderProps {
  userRole: string;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout: () => void;
  user?: any;
}

const Header: React.FC<HeaderProps> = ({ 
  userRole, 
  darkMode, 
  onToggleDarkMode,
  onLogout,
  user,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // no modal: we'll navigate to /auth pages
  const location = useLocation();
  const navigate = useNavigate();

  const getNavLinks = () => {
    const baseLinks = [
      { path: '/', label: 'Beranda', icon: '🏠' },
      { path: '/booking', label: 'Lapangan', icon: '📅' },
    ];

    if (userRole === 'user') {
      return [...baseLinks, 
        { path: '/my-bookings', label: 'Booking Saya', icon: '📋' },
        { path: '/profile', label: 'Profil', icon: '👤' }
      ];
    }

    if (userRole === 'vendor') {
      return [...baseLinks,
        { path: '/vendor/bookings', label: 'Booking', icon: '📋' }, 
        { path: '/vendor', label: 'Dashboard', icon: '🏪' }
      ];
    }

    if (userRole === 'admin') {
      return [...baseLinks,
        { path: '/admin/bookings', label: 'Booking', icon: '📋' },
        { path: '/admin', label: 'Admin', icon: '⚙️' }
      ];
    }

    return baseLinks;
  };

  // login handled via AuthPage route

  const handleLogout = () => {
    onLogout();
    navigate('/auth?mode=login');
  };

  const openAuthPage = (mode: 'login' | 'register') => {
    setMobileMenuOpen(false);
    navigate(`/auth?mode=${mode}`);
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

            {userRole === 'admin' && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/admin/dashboard');
                }}
                className="nav-link"
              >
                🛠️ Admin Panel
              </button>
            )}

            {/* 🔥 Tambahan untuk Vendor */}
            {userRole === 'vendor' && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/partner/dashboard');
                }}
                className="nav-link"
              >
                🤝 Partner Area
              </button>
            )}
            
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
                  onClick={() => openAuthPage('login')}
                  style={{ color: 'white', borderColor: 'white' }}
                >
                  Masuk
                </button>
                <button 
                  className="btn btn-accent"
                  onClick={() => openAuthPage('register')}
                >
                  Daftar
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/profile" title={user?.name || 'Profile'} className="btn btn-outline" style={{ color: 'white', borderColor: 'white', marginRight: 8 }}>
                  Profil
                </Link>
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

      {/* auth is handled on `/auth` page now */}
    </>
  );
};

// no modal component — login/register are separate pages

export default Header;