// src/components/mitra/Header.tsx
import React from 'react';
import { Bell, Search, Calendar } from 'lucide-react';

const Header: React.FC = () => {
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
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
    }}>
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

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{
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
        </div>

        <button style={{
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
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '8px 12px',
          backgroundColor: '#f3f4f6',
          borderRadius: '8px'
        }}>
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
            VA
          </div>
          <div>
            <p style={{
              fontWeight: '600',
              fontSize: '0.875rem',
              color: '#1f2937'
            }}>
              Vosue Akiti
            </p>
            <p style={{
              fontSize: '0.75rem',
              color: '#6b7280'
            }}>
              Pemilik Venue
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;