// src/components/Header/Header.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../App.css';
import '../styles/Header.css';

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
  const [userMenuOpen, setUserMenuOpen] = useState(false); // Untuk Dropdown Profil
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fungsi untuk menutup dropdown jika klik di luar area profil
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNavLinks = () => {
    const baseLinks = [
      { path: '/', label: 'Beranda', icon: '🏠' },
      { path: '/booking', label: 'Lapangan', icon: '📅' },
    ];

    if (userRole === 'user') {
      return [...baseLinks, 
        { path: '/my-bookings', label: 'Booking Saya', icon: '📋' },
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

  const handleLogout = () => {
    setUserMenuOpen(false);
    onLogout();
    navigate('/auth?mode=login');
  };

  return (
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

          {/* Tombol Khusus Role */}
          {userRole === 'admin' && (
            <button onClick={() => navigate('/admin/dashboard')} className="nav-link">🛠️ Admin Panel</button>
          )}
          {userRole === 'vendor' && (
            <button onClick={() => navigate('/partner/dashboard')} className="nav-link">🤝 Partner Area</button>
          )}
          
          {/* Toggle Dark Mode */}
          <button className="nav-link" onClick={onToggleDarkMode}>
            {darkMode ? '☀️' : '🌙'}
          </button>

          {/* LOGIKA AUTH: LOGIN vs GUEST */}
          {userRole === 'guest' ? (
            <div className="auth-buttons">
              <button className="btn btn-outline" onClick={() => navigate('/auth?mode=login')}>Masuk</button>
              <button className="btn btn-accent" onClick={() => navigate('/auth?mode=register')}>Daftar</button>
            </div>
          ) : (
            <div className="user-profile-section" ref={dropdownRef} style={{ position: 'relative' }}>
              <button 
                className="btn btn-outline user-menu-trigger"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{ color: 'white', borderColor: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span>👤</span>
                {/* Menampilkan nama depan user */}
                <span>{user?.name?.split(' ')[0] || 'User'}</span>
                <span style={{ fontSize: '0.7rem' }}>{userMenuOpen ? '▲' : '▼'}</span>
              </button>

              {/* Menu Dropdown yang muncul saat Profil diklik */}
              {userMenuOpen && (
                <div className="user-dropdown-menu">
                  <Link 
                    to="/profile" 
                    className="dropdown-item"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    👤 Profil Saya
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item logout-btn">
                    🚪 Keluar
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>
    </header>
  );
};

export default Header;