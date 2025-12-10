import React from 'react';

interface Booking { id: number; court: string; time: string; customer: string; status: string }

const BookingList: React.FC<{ bookings: Booking[] }> = ({ bookings }) => {
  return (
    <div>
      {bookings.map(b => (
        <div key={b.id} style={{ padding: 12, borderBottom: '1px solid #eee' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <strong>{b.court}</strong>
              <div style={{ color: 'var(--text-secondary)' }}>{b.time} — {b.customer}</div>
            </div>
            <div>
              <span style={{ padding: '6px 10px', borderRadius: 12, background: b.status === 'confirmed' ? 'var(--success)' : 'var(--warning)', color: 'white' }}>{b.status}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingList;
