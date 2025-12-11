// src/pages/mitra/Schedule.tsx
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Settings, Calendar } from 'lucide-react';
import '../../styles/PartnerDashboard.css';

interface TimeSlot {
  id: number;
  time: string;
  futsal1: { status: 'available' | 'booked' | 'maintenance'; booking?: any };
  futsal2: { status: 'available' | 'booked' | 'maintenance'; booking?: any };
  badmintonA: { status: 'available' | 'booked' | 'maintenance'; booking?: any };
  badmintonB: { status: 'available' | 'booked' | 'maintenance'; booking?: any };
}

const MitraSchedule: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('day'); // 'day', 'week', 'month'

  const timeSlots: TimeSlot[] = [
    { id: 1, time: '07:00 - 08:00', futsal1: { status: 'available' }, futsal2: { status: 'available' }, badmintonA: { status: 'available' }, badmintonB: { status: 'maintenance' } },
    { id: 2, time: '08:00 - 09:00', futsal1: { status: 'available' }, futsal2: { status: 'available' }, badmintonA: { status: 'available' }, badmintonB: { status: 'maintenance' } },
    { id: 3, time: '09:00 - 10:00', futsal1: { status: 'available' }, futsal2: { status: 'available' }, badmintonA: { status: 'available' }, badmintonB: { status: 'maintenance' } },
    { id: 4, time: '10:00 - 11:00', futsal1: { status: 'available' }, futsal2: { status: 'booked', booking: { customer: 'John Doe' } }, badmintonA: { status: 'available' }, badmintonB: { status: 'maintenance' } },
    { id: 5, time: '11:00 - 12:00', futsal1: { status: 'available' }, futsal2: { status: 'booked', booking: { customer: 'John Doe' } }, badmintonA: { status: 'available' }, badmintonB: { status: 'maintenance' } },
    { id: 6, time: '12:00 - 13:00', futsal1: { status: 'available' }, futsal2: { status: 'available' }, badmintonA: { status: 'available' }, badmintonB: { status: 'maintenance' } },
    { id: 7, time: '13:00 - 14:00', futsal1: { status: 'available' }, futsal2: { status: 'available' }, badmintonA: { status: 'available' }, badmintonB: { status: 'maintenance' } },
    { id: 8, time: '14:00 - 15:00', futsal1: { status: 'booked', booking: { customer: 'Alice Brown' } }, futsal2: { status: 'available' }, badmintonA: { status: 'available' }, badmintonB: { status: 'available' } },
    { id: 9, time: '15:00 - 16:00', futsal1: { status: 'booked', booking: { customer: 'Alice Brown' } }, futsal2: { status: 'available' }, badmintonA: { status: 'booked', booking: { customer: 'Bob Johnson' } }, badmintonB: { status: 'available' } },
    { id: 10, time: '16:00 - 17:00', futsal1: { status: 'booked', booking: { customer: 'David Lee' } }, futsal2: { status: 'available' }, badmintonA: { status: 'booked', booking: { customer: 'Bob Johnson' } }, badmintonB: { status: 'available' } },
    { id: 11, time: '17:00 - 18:00', futsal1: { status: 'booked', booking: { customer: 'David Lee' } }, futsal2: { status: 'booked', booking: { customer: 'Charlie Wilson' } }, badmintonA: { status: 'available' }, badmintonB: { status: 'booked', booking: { customer: 'Eve Taylor' } } },
    { id: 12, time: '18:00 - 19:00', futsal1: { status: 'booked', booking: { customer: 'David Lee' } }, futsal2: { status: 'booked', booking: { customer: 'Charlie Wilson' } }, badmintonA: { status: 'booked', booking: { customer: 'Frank Miller' } }, badmintonB: { status: 'booked', booking: { customer: 'Eve Taylor' } } },
    { id: 13, time: '19:00 - 20:00', futsal1: { status: 'booked', booking: { customer: 'Grace White' } }, futsal2: { status: 'available' }, badmintonA: { status: 'booked', booking: { customer: 'Frank Miller' } }, badmintonB: { status: 'booked', booking: { customer: 'Henry Clark' } } },
    { id: 14, time: '20:00 - 21:00', futsal1: { status: 'booked', booking: { customer: 'Grace White' } }, futsal2: { status: 'booked', booking: { customer: 'Ivy Lewis' } }, badmintonA: { status: 'available' }, badmintonB: { status: 'booked', booking: { customer: 'Henry Clark' } } },
    { id: 15, time: '21:00 - 22:00', futsal1: { status: 'booked', booking: { customer: 'Jack Walker' } }, futsal2: { status: 'booked', booking: { customer: 'Ivy Lewis' } }, badmintonA: { status: 'available' }, badmintonB: { status: 'available' } },
  ];

  const courts = [
    { id: 'futsal1', name: 'Lapangan Futsal 1', icon: '⚽' },
    { id: 'futsal2', name: 'Lapangan Futsal 2', icon: '⚽' },
    { id: 'badmintonA', name: 'Lapangan Badminton A', icon: '🏸' },
    { id: 'badmintonB', name: 'Lapangan Badminton B', icon: '🏸' },
  ];

  const getSlotStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#d1fae5';
      case 'booked': return '#fecaca';
      case 'maintenance': return '#fef3c7';
      default: return '#f3f4f6';
    }
  };

  const getSlotStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Tersedia';
      case 'booked': return 'Terbooking';
      case 'maintenance': return 'Perawatan';
      default: return 'Tidak Tersedia';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (view === 'day') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  return (
    <div className="mitra-page fullscreen-content">
      <div className="page-content">
        <div className="page-header">
          <h1>🕒 Jadwal & Ketersediaan</h1>
          <p>Kelola jadwal dan ketersediaan lapangan</p>
        </div>

        {/* Schedule Controls */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          marginBottom: '32px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                onClick={() => navigateDate('prev')}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ChevronLeft size={20} />
              </button>

              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937', minWidth: '300px', textAlign: 'center' }}>
                {formatDate(currentDate)}
              </h2>

              <button
                onClick={() => navigateDate('next')}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ChevronRight size={20} />
              </button>

              <button
                onClick={() => setCurrentDate(new Date())}
                className="btn btn-secondary"
                style={{ marginLeft: '16px' }}
              >
                Hari Ini
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              {['day', 'week', 'month'].map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: view === v ? '#3b82f6' : '#f3f4f6',
                    color: view === v ? 'white' : '#6b7280',
                    cursor: 'pointer',
                    fontWeight: view === v ? '600' : '400',
                    fontSize: '0.95rem',
                    transition: 'all 0.2s'
                  }}
                >
                  {v === 'day' ? 'Harian' : 
                   v === 'week' ? 'Mingguan' : 'Bulanan'}
                </button>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '20px', height: '20px', backgroundColor: '#d1fae5', borderRadius: '4px' }} />
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Tersedia</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '20px', height: '20px', backgroundColor: '#fecaca', borderRadius: '4px' }} />
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Terbooking</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '20px', height: '20px', backgroundColor: '#fef3c7', borderRadius: '4px' }} />
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Perawatan</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '20px', height: '20px', backgroundColor: '#f3f4f6', borderRadius: '4px' }} />
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Tidak Tersedia</span>
            </div>
          </div>
        </div>

        {/* Schedule Grid */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          overflow: 'hidden'
        }}>
          {/* Court Headers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '120px repeat(4, 1fr)',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <div style={{
              padding: '16px',
              fontWeight: '600',
              color: '#6b7280',
              backgroundColor: '#f9fafb',
              borderRight: '1px solid #e5e7eb'
            }}>
              Waktu
            </div>
            {courts.map((court) => (
              <div key={court.id} style={{
                padding: '16px',
                textAlign: 'center',
                fontWeight: '600',
                color: '#1f2937',
                backgroundColor: '#f9fafb',
                borderRight: court.id === 'badmintonB' ? 'none' : '1px solid #e5e7eb'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{court.icon}</div>
                <div>{court.name}</div>
              </div>
            ))}
          </div>

          {/* Time Slots */}
          {timeSlots.map((slot) => (
            <div key={slot.id} style={{
              display: 'grid',
              gridTemplateColumns: '120px repeat(4, 1fr)',
              borderBottom: slot.id === timeSlots.length ? 'none' : '1px solid #e5e7eb'
            }}>
              <div style={{
                padding: '12px 16px',
                fontWeight: '600',
                color: '#1f2937',
                backgroundColor: '#f9fafb',
                borderRight: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center'
              }}>
                {slot.time}
              </div>

              {courts.map((court) => {
                const courtSlot = slot[court.id as keyof TimeSlot] as any;
                return (
                  <div
                    key={`${slot.id}-${court.id}`}
                    style={{
                      padding: '12px',
                      borderRight: court.id === 'badmintonB' ? 'none' : '1px solid #e5e7eb',
                      backgroundColor: getSlotStatusColor(courtSlot.status),
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      position: 'relative',
                      minHeight: '80px'
                    }}
                    onClick={() => {
                      if (courtSlot.status === 'available') {
                        // Handle booking
                        console.log(`Book ${court.name} at ${slot.time}`);
                      } else if (courtSlot.status === 'booked') {
                        // Show booking details
                        console.log('Show booking details', courtSlot.booking);
                      }
                    }}
                  >
                    {courtSlot.status === 'booked' && courtSlot.booking && (
                      <div style={{
                        padding: '8px',
                        backgroundColor: 'white',
                        borderRadius: '6px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        height: '100%'
                      }}>
                        <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                          {courtSlot.booking.customer}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          {court.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: '500', marginTop: '4px' }}>
                          {slot.time}
                        </div>
                      </div>
                    )}
                    {courtSlot.status === 'available' && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        color: '#065f46',
                        fontWeight: '500'
                      }}>
                        Tersedia
                      </div>
                    )}
                    {courtSlot.status === 'maintenance' && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        color: '#92400e',
                        fontWeight: '500'
                      }}>
                        🔧 Perawatan
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{ marginTop: '32px', display: 'flex', gap: '16px' }}>
          <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={20} />
            Tambah Booking Baru
          </button>
          <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings size={20} />
            Atur Jam Operasional
          </button>
          <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={20} />
            Setel Libur
          </button>
        </div>
      </div>
    </div>
  );
};

export default MitraSchedule;