import React, { useState } from 'react';

const BookingPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedVenue, setSelectedVenue] = useState<string>('');
  const [step, setStep] = useState<number>(1);

  const venues = [
    { id: '1', name: 'GOR Sidoarjo Sport Center', type: 'Futsal', price: 150000 },
    { id: '2', name: 'Lapangan Basket Sidoarjo', type: 'Basket', price: 100000 },
    { id: '3', name: 'Sidoarjo Tennis Court', type: 'Tenis', price: 200000 },
  ];

  const timeSlots = [
    '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
    '19:00', '20:00', '21:00'
  ];

  const bookedSlots = ['09:00', '14:00', '18:00']; // Example booked slots

  const renderStep1 = () => (
    <div className="card">
      <h2 style={{ marginBottom: '24px' }}>Pilih Lapangan</h2>
      <div className="grid grid-2">
        {venues.map(venue => (
          <div 
            key={venue.id}
            className={`card ${selectedVenue === venue.id ? 'selected' : ''}`}
            style={{ 
              cursor: 'pointer',
              border: selectedVenue === venue.id ? '2px solid var(--primary)' : '2px solid transparent',
              transition: 'all 0.3s ease'
            }}
            onClick={() => setSelectedVenue(venue.id)}
          >
            <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '16px' }}>
              {venue.type === 'Futsal' ? '⚽' : venue.type === 'Basket' ? '🏀' : '🎾'}
            </div>
            <h3 style={{ marginBottom: '8px' }}>{venue.name}</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>
              {venue.type}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>
                Rp {venue.price.toLocaleString()}/jam
              </span>
              {selectedVenue === venue.id && (
                <span style={{ color: 'var(--success)' }}>✓ Terpilih</span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'right', marginTop: '24px' }}>
        <button 
          className="btn btn-primary"
          disabled={!selectedVenue}
          onClick={() => setStep(2)}
        >
          Lanjut ke Jadwal →
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="card">
      <h2 style={{ marginBottom: '24px' }}>Pilih Tanggal & Waktu</h2>
      
      <div className="form-group">
        <label className="form-label">Pilih Tanggal</label>
        <input
          type="date"
          className="form-input"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      {selectedDate && (
        <>
          <h3 style={{ marginBottom: '16px' }}>Pilih Slot Waktu</h3>
          <div className="time-slots">
            {timeSlots.map(time => {
              const isBooked = bookedSlots.includes(time);
              const isSelected = selectedTime === time;
              
              return (
                <div
                  key={time}
                  className={`time-slot ${isSelected ? 'selected' : ''} ${isBooked ? 'booked' : ''}`}
                  onClick={() => !isBooked && setSelectedTime(time)}
                >
                  {time}
                  {isBooked && <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>⛔ Penuh</div>}
                </div>
              );
            })}
          </div>
        </>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
        <button 
          className="btn btn-outline"
          onClick={() => setStep(1)}
        >
          ← Kembali
        </button>
        <button 
          className="btn btn-primary"
          disabled={!selectedDate || !selectedTime}
          onClick={() => setStep(3)}
        >
          Lanjut ke Pembayaran →
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => {
    const selectedVenueData = venues.find(v => v.id === selectedVenue);
    
    return (
      <div className="card">
        <h2 style={{ marginBottom: '24px' }}>Konfirmasi Booking</h2>
        
        <div className="grid grid-2">
          <div>
            <h3 style={{ marginBottom: '16px' }}>Detail Pesanan</h3>
            <div style={{ background: 'var(--background)', padding: '16px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Lapangan:</span>
                <strong>{selectedVenueData?.name}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Tanggal:</span>
                <strong>{selectedDate}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Waktu:</span>
                <strong>{selectedTime}:00 - {parseInt(selectedTime) + 1}:00</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Durasi:</span>
                <strong>1 Jam</strong>
              </div>
              <hr style={{ margin: '16px 0', border: '1px solid #E0E0E0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem' }}>
                <span>Total:</span>
                <span style={{ color: 'var(--primary)' }}>
                  Rp {selectedVenueData?.price.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ marginBottom: '16px' }}>Metode Pembayaran</h3>
            <div className="form-group">
              <select className="form-select">
                <option value="">Pilih metode pembayaran</option>
                <option value="bca">BCA Virtual Account</option>
                <option value="bni">BNI Virtual Account</option>
                <option value="mandiri">Mandiri Virtual Account</option>
                <option value="gopay">Gopay</option>
                <option value="shopeepay">ShopeePay</option>
                <option value="qris">QRIS</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Catatan (Opsional)</label>
              <textarea 
                className="form-textarea" 
                rows={3}
                placeholder="Tambahkan catatan khusus jika diperlukan..."
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
          <button 
            className="btn btn-outline"
            onClick={() => setStep(2)}
          >
            ← Kembali
          </button>
          <button 
            className="btn btn-primary"
            style={{ padding: '12px 32px' }}
          >
            💳 Bayar Sekarang
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="booking-page">
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1>Booking Lapangan</h1>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
          {[1, 2, 3].map(num => (
            <div key={num} style={{ display: 'flex', alignItems: 'center' }}>
              <div 
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: step >= num ? 'var(--primary)' : 'var(--background)',
                  color: step >= num ? 'white' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  border: step === num ? '2px solid var(--primary-dark)' : 'none'
                }}
              >
                {num}
              </div>
              {num < 3 && (
                <div 
                  style={{
                    width: '60px',
                    height: '2px',
                    background: step > num ? 'var(--primary)' : 'var(--background)',
                    margin: '0 8px'
                  }}
                />
              )}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px', gap: '120px' }}>
          <span style={{ fontSize: '0.9rem', color: step >= 1 ? 'var(--primary)' : 'var(--text-secondary)' }}>
            Pilih Lapangan
          </span>
          <span style={{ fontSize: '0.9rem', color: step >= 2 ? 'var(--primary)' : 'var(--text-secondary)' }}>
            Pilih Waktu
          </span>
          <span style={{ fontSize: '0.9rem', color: step >= 3 ? 'var(--primary)' : 'var(--text-secondary)' }}>
            Pembayaran
          </span>
        </div>
      </div>

      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </div>
  );
};

export default BookingPage;