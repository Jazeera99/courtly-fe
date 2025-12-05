import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../styles/BookingPage.css';

interface Court {
  id: string;
  name: string;
  venue: string;
  type: string;
  sport: string;
  indoor: boolean;
  price: number;
  rating: number;
  image: string;
  description: string;
  facilities: string[];
  location: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
  courtId: string;
}

interface BookingPageProps {
  user?: { id: string; email: string; name: string } | null;
}

const BookingPage: React.FC<BookingPageProps> = ({ user }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedCourt, setSelectedCourt] = useState<string>('');
  const [selectedVenueId, setSelectedVenueId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sportFilter, setSportFilter] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [step, setStep] = useState<number>(1);
  
  // Store current month as YYYY-MM string to avoid timezone issues
  const today = new Date();
  const currentYearMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  const [currentMonth, setCurrentMonth] = useState<string>(currentYearMonth);

  // Check if venueId is provided from venue detail page
  useEffect(() => {
    console.log('BookingPage mounted');
    const venueId = searchParams.get('venueId');
    if (venueId) {
      setSelectedVenueId(venueId);
      setStep(2); // Skip to time selection step
    }
  }, [searchParams]);

  // Monitor selectedDate changes
  useEffect(() => {
    console.log('selectedDate changed to:', selectedDate);
  }, [selectedDate]);

  // Data courts/lapangan yang lengkap
  const courts: Court[] = [
    {
      id: '1',
      name: 'Court A - Premium',
      venue: 'Balikpapan Padel Club',
      type: 'Padel Court',
      sport: 'padel',
      indoor: true,
      price: 250000,
      rating: 4.9,
      image: '🎾',
      description: 'Lapangan padel premium dengan surface berkualitas tinggi, cocok untuk pertandingan profesional',
      facilities: ['AC', 'Lighting', 'Changing Room', 'Shower'],
      location: 'Jl. Sudirman No. 123, Balikpapan'
    },
    {
      id: '2',
      name: 'Court B - Standard',
      venue: 'Balikpapan Padel Club',
      type: 'Padel Court',
      sport: 'padel',
      indoor: true,
      price: 200000,
      rating: 4.7,
      image: '🎾',
      description: 'Lapangan padel standar dengan fasilitas lengkap untuk latihan dan pertandingan casual',
      facilities: ['AC', 'Lighting', 'Changing Room'],
      location: 'Jl. Sudirman No. 123, Balikpapan'
    },
    {
      id: '3',
      name: 'Lapangan Futsal 1',
      venue: 'GOR Sidoarjo Sport Center',
      type: 'Futsal',
      sport: 'futsal',
      indoor: true,
      price: 150000,
      rating: 4.6,
      image: '⚽',
      description: 'Lapangan futsal indoor dengan rumput sintetis berkualitas, ukuran standar nasional',
      facilities: ['AC', 'Tribune', 'Lighting', 'Music System'],
      location: 'Jl. Pahlawan No. 45, Sidoarjo'
    },
    {
      id: '4',
      name: 'Lapangan Futsal 2',
      venue: 'GOR Sidoarjo Sport Center',
      type: 'Futsal',
      sport: 'futsal',
      indoor: true,
      price: 130000,
      rating: 4.5,
      image: '⚽',
      description: 'Lapangan futsal dengan surface terbaru, cocok untuk latihan tim',
      facilities: ['AC', 'Lighting', 'Changing Room'],
      location: 'Jl. Pahlawan No. 45, Sidoarjo'
    },
    {
      id: '5',
      name: 'Lapangan Basket Utama',
      venue: 'Sidoarjo Basketball Court',
      type: 'Basket',
      sport: 'basket',
      indoor: false,
      price: 120000,
      rating: 4.4,
      image: '🏀',
      description: 'Lapangan basket outdoor dengan flooring berkualitas, ring profesional',
      facilities: ['Lighting', 'Bench', 'Scoreboard'],
      location: 'Jl. Merdeka No. 67, Sidoarjo'
    },
    {
      id: '6',
      name: 'Court Tenis 1',
      venue: 'Sidoarjo Tennis Complex',
      type: 'Tenis',
      sport: 'tennis',
      indoor: false,
      price: 180000,
      rating: 4.7,
      image: '🎾',
      description: 'Lapangan tenis hard court dengan surface standar internasional',
      facilities: ['Lighting', 'Net', 'Bench'],
      location: 'Jl. Sport No. 89, Sidoarjo'
    },
    {
      id: '7',
      name: 'Lapangan Badminton A',
      venue: 'GOR Sidoarjo Sport Center',
      type: 'Badminton',
      sport: 'badminton',
      indoor: true,
      price: 80000,
      rating: 4.3,
      image: '🏸',
      description: 'Lapangan badminton indoor dengan lighting profesional, lantai kayu maple',
      facilities: ['AC', 'Lighting', 'Changing Room'],
      location: 'Jl. Pahlawan No. 45, Sidoarjo'
    },
    {
      id: '8',
      name: 'Lapangan Badminton B',
      venue: 'GOR Sidoarjo Sport Center',
      type: 'Badminton',
      sport: 'badminton',
      indoor: true,
      price: 70000,
      rating: 4.2,
      image: '🏸',
      description: 'Lapangan badminton untuk latihan dengan harga terjangkau',
      facilities: ['AC', 'Lighting'],
      location: 'Jl. Pahlawan No. 45, Sidoarjo'
    },
    {
      id: '9',
      name: 'Lapangan Voli Pantai',
      venue: 'Sidoarjo Beach Sport Arena',
      type: 'Voli Pantai',
      sport: 'volleyball',
      indoor: false,
      price: 100000,
      rating: 4.5,
      image: '🏐',
      description: 'Lapangan voli pantai dengan pasir putih berkualitas, area yang luas',
      facilities: ['Beach Area', 'Shower', 'Rest Area'],
      location: 'Pantai Sidoarjo, Jawa Timur'
    }
  ];

// Generate dates untuk 1 bulan penuh
    const getDatesForMonth = (yearMonthStr: string) => {
    const dates = [];
    
    // Parse YYYY-MM format
    const [yearStr, monthStr] = yearMonthStr.split('-');
    const year = parseInt(yearStr);
    const monthIndex = parseInt(monthStr) - 1; // Convert to 0-based month
    
    console.log('getDatesForMonth - yearMonthStr:', yearMonthStr, 'year:', year, 'monthIndex:', monthIndex);
    
    // Dapatkan hari pertama bulan
    const firstDay = new Date(year, monthIndex, 1);
    const firstDayOfWeek = firstDay.getDay(); // 0 = Minggu, 1 = Senin, dst.
    
    console.log('firstDay:', firstDay.toDateString(), 'firstDayOfWeek:', firstDayOfWeek);
    
    // Tanggal mulai dari bulan sebelumnya
    const startDate = new Date(year, monthIndex, 1 - firstDayOfWeek);
    
    console.log('startDate:', startDate.toDateString());
    
    // Jumlah sel kalender (6 minggu x 7 hari)
    const totalCells = 42;
    const todayObj = new Date();
    const todayStr = `${todayObj.getFullYear()}-${String(todayObj.getMonth() + 1).padStart(2, '0')}-${String(todayObj.getDate()).padStart(2, '0')}`;
    
    for (let i = 0; i < totalCells; i++) {
      const current = new Date(year, monthIndex, 1 - firstDayOfWeek + i);
      const dateStr = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`;
      
      if (i < 7 || i >= 35) {
        console.log(`i=${i}, date: ${dateStr}, display: ${current.getDate()}, isCurrentMonth: ${current.getMonth() === monthIndex}`);
      }
      
      dates.push({
        date: dateStr,
        display: current.getDate().toString(),
        dayName: current.toLocaleDateString('id-ID', { weekday: 'short' }),
        isCurrentMonth: current.getMonth() === monthIndex,
        isToday: dateStr === todayStr,
        isPast: dateStr < todayStr,
        fullDate: current
      });
    }
  
  return dates;
  };

  const availableDates = getDatesForMonth(currentMonth);

  // Navigasi bulan
  const goToPreviousMonth = () => {
    setCurrentMonth(prev => {
      const [year, month] = prev.split('-').map(Number);
      let newMonth = month - 1;
      let newYear = year;
      if (newMonth < 1) {
        newMonth = 12;
        newYear -= 1;
      }
      return `${newYear}-${String(newMonth).padStart(2, '0')}`;
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => {
      const [year, month] = prev.split('-').map(Number);
      let newMonth = month + 1;
      let newYear = year;
      if (newMonth > 12) {
        newMonth = 1;
        newYear += 1;
      }
      return `${newYear}-${String(newMonth).padStart(2, '0')}`;
    });
  };

  // Time slots lengkap dan terurut
  const timeSlots = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
    '20:00', '21:00', '22:00', '23:00'
  ];

  // Fungsi untuk cek apakah waktu sudah lewat
  const isTimeInPast = (selectedDate: string, time: string) => {
  if (!selectedDate) return false;
  
  const now = new Date();
  const [hours] = time.split(':').map(Number);
  const slotDateTime = new Date(selectedDate);
  slotDateTime.setHours(hours, 0, 0, 0);
  
  return slotDateTime < now;
};


  // Mock data untuk jadwal yang sudah dibooking (lebih realistis)
  const generateBookedSlots = (): TimeSlot[] => {
    const booked: TimeSlot[] = [];
    const courtsToBook = ['1', '2', '3', '4'];
    
    courtsToBook.forEach(courtId => {
      // Book random time slots untuk setiap court
      const randomSlots = timeSlots
        .sort(() => 0.5 - Math.random())
        .slice(0, 4); // Book 4 random slots per court
        
      randomSlots.forEach(time => {
        booked.push({ time, available: false, courtId });
      });
    });
    
    return booked;
  };

  const bookedSlots = generateBookedSlots();

  // Filter courts berdasarkan pencarian dan filter
  const filteredCourts = courts.filter(court => {
    const matchesSearch = court.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         court.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         court.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSport = sportFilter === 'all' || court.sport === sportFilter;
    const matchesPrice = priceFilter === 'all' || 
                        (priceFilter === 'low' && court.price < 100000) ||
                        (priceFilter === 'medium' && court.price >= 100000 && court.price <= 200000) ||
                        (priceFilter === 'high' && court.price > 200000);
    
    return matchesSearch && matchesSport && matchesPrice;
  });

  // Cek ketersediaan time slot untuk court tertentu
  const isTimeSlotAvailable = (courtId: string, time: string) => {
    const booked = bookedSlots.find(slot => 
      slot.courtId === courtId && slot.time === time && !slot.available
    );
    return !booked;
  };

  // Reset selection ketika date berubah
  useEffect(() => {
    setSelectedTime('');
    setSelectedCourt('');
  }, [selectedDate]);

  // Step 1: Pilih Tanggal & Cari Lapangan
  const renderStep1 = () => (
    <div className="booking-step">
      <div className="search-filters">
        <div className="search-box">
          <input
            type="text"
            className="form-input"
            placeholder="Cari lapangan, venue, atau lokasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filters-row">
          <select 
            className="filter-select"
            value={sportFilter}
            onChange={(e) => setSportFilter(e.target.value)}
          >
            <option value="all">Semua Olahraga</option>
            <option value="padel">Padel</option>
            <option value="futsal">Futsal</option>
            <option value="basket">Basket</option>
            <option value="tennis">Tennis</option>
            <option value="badminton">Badminton</option>
            <option value="volleyball">Voli</option>
          </select>

          <select 
            className="filter-select"
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
          >
            <option value="all">Semua Harga</option>
            <option value="low">Dibawah Rp 100k</option>
            <option value="medium">Rp 100k - 200k</option>
            <option value="high">Diatas Rp 200k</option>
          </select>
        </div>
      </div>

      <div className="date-selection">
        <div className="calendar-header">
          <button className="month-nav-btn" onClick={goToPreviousMonth}>
            ←
          </button>
          <h3 className="current-month">
            {new Date(`${currentMonth}-01`).toLocaleDateString('id-ID', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </h3>
          <button className="month-nav-btn" onClick={goToNextMonth}>
            →
          </button>
        </div>

        <div className="calendar-container">
          <div className="calendar-grid">
    

        {/* Grid tanggal - DI TENGAH SEMPURNA */}
        <div className="dates-grid">
          {availableDates.map((dateObj, index) => {
            // Debug: console log untuk memastikan tanggal benar
            const handleDateClick = () => {
              if (dateObj.isCurrentMonth && !dateObj.isPast) {
                console.log('Tanggal dipilih:', dateObj.date, 'Display:', dateObj.display);
                setSelectedDate(dateObj.date);
              }
            };
            return (
               <button
              key={`${dateObj.date}-${index}`}
              className={`date-cell ${
                !dateObj.isCurrentMonth ? 'other-month' : ''
              } ${dateObj.isToday ? 'today' : ''} ${
                selectedDate === dateObj.date ? 'selected' : ''
              } ${dateObj.isPast ? 'past-date' : ''}`}
              onClick={handleDateClick}
              disabled={!dateObj.isCurrentMonth || dateObj.isPast}
              title={dateObj.date} // Tooltip untuk debugging
            >
              <div className="date-number">{dateObj.display}</div>
              <div className="day-name">{dateObj.dayName}</div>
              {dateObj.isToday && <div className="today-indicator">Hari ini</div>}
              {dateObj.isPast && <div className="past-indicator">⛔</div>}
            </button>
          );
        })}
      </div>
    </div>
  </div>
</div>

      {selectedDate && (
        <div className="courts-section">
          <h3>🏟️ Pilih Lapangan Tersedia</h3>
          <p className="section-subtitle">Tanggal: {new Date(selectedDate).toLocaleDateString('id-ID', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>

          {/* Debug info - bisa dihapus setelah testing */}
          <div style={{ 
            background: '#f0f8ff', 
            padding: '10px', 
            borderRadius: '8px', 
            marginBottom: '15px',
            fontSize: '0.9rem',
            color: '#666'
          }}>
            <strong>Debug Info:</strong> Selected Date: {selectedDate}
          </div>
          
          <div className="courts-grid">
            {filteredCourts.map(court => (
              <div 
                key={court.id}
                className={`court-card ${selectedCourt === court.id ? 'selected' : ''}`}
                onClick={() => setSelectedCourt(court.id)}
              >
                <div className="court-header">
                  <div className="court-image">{court.image}</div>
                  <div className="court-info">
                    <h4>{court.name}</h4>
                    <p className="court-venue">{court.venue}</p>
                    <p className="court-location">📍 {court.location}</p>
                    <div className="court-details">
                      <span className="sport-type">{court.type}</span>
                      <span className={`indoor ${court.indoor ? 'yes' : 'no'}`}>
                        {court.indoor ? '🏠 Indoor' : '☀️ Outdoor'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="court-description">
                  <p>{court.description}</p>
                </div>

                <div className="court-facilities">
                  <strong>Fasilitas:</strong>
                  <div className="facilities-list">
                    {court.facilities.map((facility, index) => (
                      <span key={index} className="facility-tag">✓ {facility}</span>
                    ))}
                  </div>
                </div>
                
                <div className="court-footer">
                  <div className="court-rating">
                    ⭐ {court.rating}
                  </div>
                  <div className="court-price">
                    <span className="price-amount">Rp {court.price.toLocaleString()}</span>
                    <span className="price-unit">/jam</span>
                  </div>
                </div>

                <div className="court-actions">
                  <button 
                    className="btn btn-outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/venue/${court.id}`);
                    }}
                  >
                    👁️ Lihat Detail
                  </button>
                </div>

                {selectedCourt === court.id && (
                  <div className="selected-indicator">
                    ✓ Terpilih
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredCourts.length === 0 && (
            <div className="no-results">
              <div className="no-results-icon">😔</div>
              <h4>Tidak ada lapangan yang ditemukan</h4>
              <p>Coba ubah kata kunci pencarian atau filter yang Anda gunakan</p>
              <button 
                className="btn btn-outline"
                onClick={() => {
                  setSearchQuery('');
                  setSportFilter('all');
                  setPriceFilter('all');
                }}
              >
                🔄 Reset Filter
              </button>
            </div>
          )}

          {filteredCourts.length > 0 && (
            <div className="step-actions">
              <button 
                className="btn btn-primary"
                disabled={!selectedCourt}
                onClick={() => setStep(2)}
              >
                🕐 Lanjut ke Pilih Waktu →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Step 2: Pilih Waktu
    const renderStep2 = () => {
    const selectedCourtData = courts.find(c => c.id === selectedCourt);
    
    return (
      <div className="booking-step">
        <div className="time-selection-header">
          <h2 className="time-selection-title">🕐 Pilih Waktu Booking</h2>
          <div className="booking-summary-large">
            <div className="summary-item-large">
              <span className="summary-label">Lapangan:</span>
              <span className="summary-value">{selectedCourtData?.name}</span>
            </div>
            <div className="summary-item-large">
              <span className="summary-label">Tanggal:</span>
              <span className="summary-value">
                {new Date(selectedDate).toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            <div className="summary-item-large">
              <span className="summary-label">Harga:</span>
              <span className="summary-value price">Rp {selectedCourtData?.price.toLocaleString()}/jam</span>
            </div>
          </div>
        </div>

        <div className="time-slots-section">
          <h3 className="time-slots-title">⏰ Slot Waktu Tersedia</h3>
          <div className="time-slots-grid-ordered">
            {timeSlots.map(time => {
              const isAvailable = isTimeSlotAvailable(selectedCourt, time);
              const isSelected = selectedTime === time;
              const isPast = isTimeInPast(selectedDate, time);
              
              return (
                <button
                  key={time}
                  className={`time-slot-btn-large ${isSelected ? 'selected' : ''} ${
                    !isAvailable ? 'booked' : ''} ${isPast ? 'past-time' : ''}`}
                  onClick={() => isAvailable && !isPast && setSelectedTime(time)}
                  disabled={!isAvailable || isPast}
                >
                  <div className="time-range-large">{time} - {parseInt(time) + 1}:00</div>
                  <div className="time-status-large">
                    {!isAvailable ? '⛔ Penuh' : isPast ? '⌛ Lewat' : '✅ Tersedia'}
                  </div>
                  {isAvailable && !isPast && (
                    <div className="time-price-large">
                      Rp {selectedCourtData?.price.toLocaleString()}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="step-actions">
          <button 
            className="btn btn-outline"
            onClick={() => setStep(1)}
          >
            ← Kembali ke Pilih Lapangan
          </button>
          <button 
            className="btn btn-primary"
            disabled={!selectedTime}
            onClick={() => setStep(3)}
          >
            💳 Lanjut ke Pembayaran →
          </button>
        </div>
      </div>
    );
  };

  // Step 3: Konfirmasi & Pembayaran
  const renderStep3 = () => {
    // Check if user is logged in
    if (!user) {
      return (
        <div className="booking-step">
          <div className="confirmation-header">
            <h2>🔒 Login Diperlukan</h2>
            <p>Silakan login terlebih dahulu untuk melanjutkan pembayaran</p>
          </div>

          <div className="login-gate">
            <div className="login-gate-card">
              <h3>Akses Pembayaran</h3>
              <p>Untuk menyelesaikan pemesanan dan melakukan pembayaran, Anda harus login ke akun Anda terlebih dahulu.</p>
              
              <div className="login-gate-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/auth?mode=login')}
                >
                  🔐 Login Sekarang
                </button>
                <span className="divider">atau</span>
                <button 
                  className="btn btn-secondary"
                  onClick={() => navigate('/auth?mode=register')}
                >
                  📝 Daftar Akun Baru
                </button>
              </div>

              <button 
                className="btn btn-outline"
                onClick={() => setStep(2)}
              >
                ← Kembali ke Pemilihan Waktu
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Original payment UI if user is logged in
    const selectedCourtData = courts.find(c => c.id === selectedCourt);
    
    return (
      <div className="booking-step">
        <div className="confirmation-header">
          <h2>✅ Konfirmasi Booking</h2>
          <p>Review detail pesanan Anda sebelum melanjutkan pembayaran</p>
        </div>

        <div className="confirmation-grid">
          <div className="booking-details">
            <h3>📋 Detail Pesanan</h3>
            <div className="details-card">
              <div className="detail-item">
                <span>Lapangan:</span>
                <strong>{selectedCourtData?.name}</strong>
              </div>
              <div className="detail-item">
                <span>Venue:</span>
                <span>{selectedCourtData?.venue}</span>
              </div>
              <div className="detail-item">
                <span>Lokasi:</span>
                <span>{selectedCourtData?.location}</span>
              </div>
              <div className="detail-item">
                <span>Tanggal:</span>
                <span>{new Date(selectedDate).toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="detail-item">
                <span>Waktu:</span>
                <span>{selectedTime}:00 - {parseInt(selectedTime) + 1}:00</span>
              </div>
              <div className="detail-item">
                <span>Durasi:</span>
                <span>1 Jam</span>
              </div>
              <div className="detail-item">
                <span>Jenis Lapangan:</span>
                <span>{selectedCourtData?.type}</span>
              </div>
            </div>
          </div>

          <div className="payment-section">
            <h3>💰 Pembayaran</h3>
            <div className="payment-card">
              <div className="price-summary">
                <div className="summary-item">
                  <span>Harga per jam:</span>
                  <span>Rp {selectedCourtData?.price.toLocaleString()}</span>
                </div>
                <div className="summary-item">
                  <span>Durasi:</span>
                  <span>1 Jam</span>
                </div>
                <hr />
                <div className="summary-total">
                  <span>Total Pembayaran:</span>
                  <span className="total-amount">
                    Rp {selectedCourtData?.price.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="payment-methods">
                <h4>💳 Metode Pembayaran</h4>
                <div className="payment-options">
                  <label className="payment-option">
                    <input type="radio" name="payment" value="bca" defaultChecked />
                    <span>BCA Virtual Account</span>
                  </label>
                  <label className="payment-option">
                    <input type="radio" name="payment" value="bni" />
                    <span>BNI Virtual Account</span>
                  </label>
                  <label className="payment-option">
                    <input type="radio" name="payment" value="mandiri" />
                    <span>Mandiri Virtual Account</span>
                  </label>
                  <label className="payment-option">
                    <input type="radio" name="payment" value="gopay" />
                    <span>Gopay</span>
                  </label>
                  <label className="payment-option">
                    <input type="radio" name="payment" value="qris" />
                    <span>QRIS</span>
                  </label>
                </div>
              </div>

              <div className="notes-section">
                <label className="form-label">📝 Catatan (Opsional)</label>
                <textarea 
                  className="form-textarea" 
                  rows={3}
                  placeholder="Tambahkan catatan khusus untuk venue atau instruksi khusus..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="step-actions">
          <button 
            className="btn btn-outline"
            onClick={() => setStep(2)}
          >
            ← Kembali ke Pilih Waktu
          </button>
          <button 
            className="btn btn-primary"
            style={{ padding: '12px 32px', fontSize: '1.1rem' }}
          >
            🎯 Konfirmasi & Bayar
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="booking-page">
      {/* Debug banner to check rendering */}
      <div style={{ background: '#ffefc2', padding: '10px', borderRadius: 8, marginBottom: 12, color: '#333', textAlign: 'center' }}>
        DEBUG: BookingPage component mounted
      </div>
      {/* Progress Steps */}
      <div className="booking-header">
        <h1>🏀 Booking Lapangan</h1>
        <div className="progress-steps">
          <div className="steps-container">
            {[1, 2, 3].map(num => (
              <div key={num} className="step-item">
                <div className={`step-number ${step >= num ? 'active' : ''}`}>
                  {num}
                </div>
                <div className="step-label">
                  {num === 1 && 'Pilih Lapangan'}
                  {num === 2 && 'Pilih Waktu'}
                  {num === 3 && 'Pembayaran'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="booking-content">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>
    </div>
  );
};

export default BookingPage;