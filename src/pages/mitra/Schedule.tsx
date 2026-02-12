// src/pages/mitra/Schedule.tsx
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Settings } from 'lucide-react';
import { useQuery } from '@apollo/client';
import { GET_VENUE_SCHEDULE } from '../../graphql/queries';
import '../../styles/PartnerDashboard.css';

interface Court {
  id: string;
  name: string;
}

const MitraSchedule: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('day');
  
  // const userData = JSON.parse(localStorage.getItem('user') || '{}');
  // const venueId = userData.venueId || userData.venues?.[0]?.id || "";

  // Cari bagian ini di Schedule.tsx
  const userData = JSON.parse(localStorage.getItem('user') || '{}');

  // Perbaikan pengambilan ID (tambahkan log untuk cek isi userData)
  console.log("Isi userData di LocalStorage:", userData);

  const venueId = userData.venueId || 
                  userData.venues?.[0]?.id || 
                  localStorage.getItem('venueId') || // Tambahan jika disimpan terpisah
                  "";

console.log("Venue ID yang akan dikirim ke query:", venueId);
  const formatLocalDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const { data, loading, error } = useQuery(GET_VENUE_SCHEDULE, {
    variables: { 
      venueId: venueId,
      date: formatLocalDate(currentDate) 
    },
    skip: !venueId || venueId === "",
    fetchPolicy: 'network-only',
  });

  // LOGIKA PENTING: Mengolah data agar grid selalu muncul
  const courts: Court[] = data?.getVenueSchedule?.courts || [];

  console.log("DEBUG: Data Courts yang diterima:", courts);
  
  // Jika timeSlots dari backend kosong, kita buat template jam 07:00 - 22:00 agar grid tetap muncul
  const rawTimeSlots = data?.getVenueSchedule?.timeSlots || [];
  const timeSlots = rawTimeSlots.length > 0 ? rawTimeSlots : Array.from({ length: 15 }, (_, i) => ({
    time: `${(i + 7).toString().padStart(2, '0')}:00 - ${(i + 8).toString().padStart(2, '0')}:00`,
    courtStatus: {} 
  }));

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const getSlotStatusColor = (status: string) => {
    switch (status) {
      case 'booked': return '#fecaca';
      case 'maintenance': return '#fef3c7';
      case 'available': return '#d1fae5';
      default: return '#f3f4f6';
    }
  };

  if (loading) return <div className="page-content">Memuat Jadwal...</div>;
  if (error) return <div className="page-content">Error: {error.message}</div>;

  return (
    <div className="mitra-page fullscreen-content">
      <div className="page-content">
        <div className="page-header">
          <h1>🕒 Jadwal & Ketersediaan</h1>
          <p>Kelola jadwal lapangan Anda secara real-time</p>
        </div>

        {/* Controls */}
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button onClick={() => navigateDate('prev')} className="btn-icon"><ChevronLeft /></button>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', minWidth: '250px', textAlign: 'center' }}>
                {formatDate(currentDate)}
              </h2>
              <button onClick={() => navigateDate('next')} className="btn-icon"><ChevronRight /></button>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setView('day')} className={`btn ${view === 'day' ? 'btn-primary' : 'btn-secondary'}`}>Harian</button>
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: 16, height: 16, backgroundColor: '#d1fae5', borderRadius: 4 }} /> <span>Tersedia</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: 16, height: 16, backgroundColor: '#fecaca', borderRadius: 4 }} /> <span>Terisi</span></div>
          </div>
        </div>

        {/* Schedule Grid */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflowX: 'auto' }}>
          
          {/* Header Lapangan */}
          <div style={{
            display: 'grid',
            // Dinamis berdasarkan jumlah lapangan
            gridTemplateColumns: `120px repeat(${courts.length > 0 ? courts.length : 1}, minmax(180px, 1fr))`,
            borderBottom: '2px solid #e5e7eb'
          }}>
            <div style={{ padding: '16px', fontWeight: 'bold', backgroundColor: '#f9fafb', borderRight: '1px solid #e5e7eb', position: 'sticky', left: 0, zIndex: 10 }}>Waktu</div>
            {courts.length > 0 ? courts.map(court => (
              <div key={court.id} style={{ padding: '16px', textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid #e5e7eb' }}>
                {court.name}
              </div>
            )) : <div style={{ padding: '16px', textAlign: 'center', color: 'red' }}>Tidak ada lapangan ditemukan</div>}
          </div>

          {/* Body Jam */}
          {timeSlots.map((slot: any, idx: number) => (
            <div key={idx} style={{
              display: 'grid',
              gridTemplateColumns: `120px repeat(${courts.length || 1}, minmax(180px, 1fr))`,
              borderBottom: '1px solid #e5e7eb'
            }}>
              <div style={{ padding: '20px 16px', fontWeight: '600', backgroundColor: '#f9fafb', borderRight: '1px solid #e5e7eb', position: 'sticky', left: 0, zIndex: 5 }}>
                {slot.time}
              </div>

              {courts.map(court => {
                const courtSlot = slot.courtStatus[court.id] || { status: 'available' };
                return (
                  <div key={court.id} style={{
                    padding: '10px',
                    backgroundColor: getSlotStatusColor(courtSlot.status),
                    borderRight: '1px solid #e5e7eb',
                    minHeight: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {courtSlot.status === 'booked' ? (
                      <div style={{ backgroundColor: 'white', padding: '8px', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', width: '100%' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '12px' }}>
                           {/* Mengakses nama customer sesuai struktur backend Anda */}
                          {courtSlot.booking?.customer || 'Penyewa'}
                        </div>
                      </div>
                    ) : (
                      <span style={{ fontSize: '12px', color: '#666' }}>
                        {courtSlot.status === 'available' ? 'Kosong' : '🔧'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MitraSchedule;