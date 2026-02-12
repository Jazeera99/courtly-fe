import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, Calendar, Menu, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_VENUE_PROFILE } from '../../graphql/queries';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const venueId = localStorage.getItem('venueId'); 

  const { data, loading } = useQuery(GET_VENUE_PROFILE, {
    variables: { venueId: venueId },
    skip: !venueId,
  });
  
  const ownerName = data?.getVenueProfile?.ownerName || (loading ? "Memuat..." : "MItra");

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('venueId');
    navigate('/login');
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header style={{
      backgroundColor: 'white',
      padding: '16px 24px',
      paddingLeft: '280px',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
      width: '100%',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      boxSizing: 'border-box'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button className="mobile-menu-toggle" style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'none'
        }}>
          <Menu size={24} />
        </button>
        
        <div>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '4px'
          }}>
            Dashboard Mitra
          </h1>
          <p style={{
            color: '#6b7280',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Calendar size={14} />
            {today}
          </p>
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        {/* <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Search size={20} style={{
            position: 'absolute',
            left: '12px',
            color: '#9ca3af'
          }} />
          <input
            type="text"
            placeholder="Cari booking, pelanggan..."
            style={{
              padding: '10px 12px 10px 40px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              backgroundColor: '#f9fafb',
              width: '300px',
              fontSize: '0.875rem',
              outline: 'none',
              transition: 'all 0.2s'
            }}
          />
        </div> */}

        {/* <button style={{
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          position: 'relative',
          padding: '8px'
        }}>
          <Bell size={22} color="#4b5563" />
          <span style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            backgroundColor: '#ef4444',
            color: 'white',
            fontSize: '0.75rem',
            borderRadius: '50%',
            width: '18px',
            height: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            3
          </span>
        </button> */}

        {/* CONTAINER PROFIL DENGAN DROPDOWN */}
        <div style={{ position: 'relative' }} ref={menuRef}>
          <div 
            onClick={() => setIsMenuOpen(!isMenuOpen)} // Klik untuk buka/tutup
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 12px',
              backgroundColor: isMenuOpen ? '#e5e7eb' : '#f3f4f6', // Berubah warna saat menu terbuka
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              backgroundColor: '#3b82f6',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1rem'
            }}>
              {ownerName.substring(0, 2).toUpperCase()}
            </div>
            <div style={{ textAlign: 'left' }}>
              <p style={{
                fontWeight: '600',
                fontSize: '0.875rem',
                color: '#1f2937',
                margin: 0
              }}>
                {ownerName}
              </p>
              <p style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                margin: 0
              }}>
                Pemilik Venue
              </p>
            </div>
          </div>

          {/* MENU DROPDOWN */}
          {isMenuOpen && (
            <div style={{
              position: 'absolute',
              top: '120%', // Muncul tepat di bawah profil
              right: 0,
              width: '180px',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              border: '1px solid #e5e7eb',
              overflow: 'hidden',
              zIndex: 1000
            }}>
              <button 
                onClick={() => { navigate('/partner/profile'); setIsMenuOpen(false); }}
                style={dropdownItemStyle}
              >
                <User size={16} />
                Profile
              </button>
              <hr style={{ margin: 0, border: 'none', borderTop: '1px solid #f3f4f6' }} />
              <button 
                onClick={handleLogout}
                style={{ ...dropdownItemStyle, color: '#ef4444' }}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// Style untuk tombol dropdown
const dropdownItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  width: '100%',
  padding: '12px 16px',
  backgroundColor: 'white',
  border: 'none',
  textAlign: 'left',
  fontSize: '0.875rem',
  fontWeight: '500',
  color: '#374151',
  cursor: 'pointer',
  outline: 'none',
};

export default Header;