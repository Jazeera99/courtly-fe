import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_BOOKING_DATA } from '../graphql/queries';
import { CREATE_RESERVATION_DRAFT, MUTATION_CONFIRM } from '../graphql/mutations';
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

interface BookingItem {
  id: string;
  courtId: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  courtName: string;
  venue: string;
  location: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentMethod: string;
  invoiceNumber: string;
  createdAt: string;
  canCancelUntil: string;
}

interface BookingPageProps {
  user?: { id: string; email: string; name: string } | null;
}

const HARD_CODED_COURTS: Court[] = [
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

const BookingPage: React.FC<BookingPageProps> = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedCourt, setSelectedCourt] = useState<string>('');
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<Array<{date: string, time: string}>>([]);
  const [bookingRepeat, setBookingRepeat] = useState<'none' | 'weekly' | 'monthly'>('none');
  const [repeatWeeks, setRepeatWeeks] = useState<number>(1);
  const [repeatMonths, setRepeatMonths] = useState<number>(1);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sportFilter, setSportFilter] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [step, setStep] = useState<number>(1);

  // Apollo GraphQL queries
  const { data: bookingData, loading: loadingCourts, error: courtsError } = useQuery(GET_BOOKING_DATA, {
    variables: { date: selectedDate || new Date().toISOString().split('T')[0] },
    skip: !selectedDate, // Only run when date is selected
  });

  // Transform database fields to Court interface
  const [courts, setCourts] = useState<Court[]>([]);
  // const courts: Court[] = bookingData?.getFields?.map((field: any) => ({
  //   id: field.id.toString(),
  //   name: field.name,
  //   venue: field.venues?.[0]?.name || 'Unknown Venue',
  //   type: field.name.includes('Futsal') ? 'Futsal' :
  //         field.name.includes('Basket') ? 'Basket' :
  //         field.name.includes('Tenis') ? 'Tenis' :
  //         field.name.includes('Badminton') ? 'Badminton' :
  //         field.name.includes('Voli') ? 'Voli Pantai' :
  //         field.name.includes('Padel') ? 'Padel Court' : 'Unknown',
  //   sport: field.name.toLowerCase().includes('futsal') ? 'futsal' :
  //          field.name.toLowerCase().includes('basket') ? 'basket' :
  //          field.name.toLowerCase().includes('tenis') ? 'tennis' :
  //          field.name.toLowerCase().includes('badminton') ? 'badminton' :
  //          field.name.toLowerCase().includes('voli') ? 'volleyball' :
  //          field.name.toLowerCase().includes('padel') ? 'padel' : 'unknown',
  //   indoor: true, // Default to indoor, can be updated based on database
  //   price: field.price_per_hour || 0,
  //   rating: 4.5, // Default rating, can be updated based on database
  //   image: field.field_images?.[0]?.image_path ? `http://localhost:4000${field.field_images[0].image_path}` : '🏟️',
  //   description: field.description || 'Lapangan berkualitas untuk olahraga Anda',
  //   facilities: field.field_facilities?.map((f: any) => f.facilities?.name).filter(Boolean) || [],
  //   location: field.full_address || field.city || 'Unknown Location'
  // })) || [];

  // Transform reservations to booked slots
  const bookedSlots: TimeSlot[] = bookingData?.getReservedSlots?.map((reservation: any) => ({
    time: reservation.start_time,
    available: false,
    courtId: reservation.field_id.toString()
  })) || [];

  // Mutation for creating reservation draft
  const [createReservationDraft, { loading: creatingDraft }] = useMutation(CREATE_RESERVATION_DRAFT);
  const [confirmReservation, { loading: confirming }] = useMutation(MUTATION_CONFIRM);

  // Store current month as YYYY-MM string to avoid timezone issues
  const today = new Date();
  const currentYearMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  const [currentMonth, setCurrentMonth] = useState<string>(currentYearMonth);

  // Check if venueId is provided from venue detail page
  useEffect(() => {
    const venueId = searchParams.get('venueId');
    if (venueId) {
      setSelectedCourt(venueId);
      setStep(2); // Skip to time selection step
    }
  }, [searchParams]);

  // Monitor selectedDate changes
  useEffect(() => {
    console.log('selectedDate changed to:', selectedDate);
  }, [selectedDate]);

  // Calendar helper (unchanged)
  const getDatesForMonth = (yearMonthStr: string) => {
    const dates = [];
    const [yearStr, monthStr] = yearMonthStr.split('-');
    const year = parseInt(yearStr);
    const monthIndex = parseInt(monthStr) - 1;
    const firstDay = new Date(year, monthIndex, 1);
    const firstDayOfWeek = firstDay.getDay();
    const startDate = new Date(year, monthIndex, 1 - firstDayOfWeek);
    const totalCells = 42;
    const todayObj = new Date();
    const todayStr = `${todayObj.getFullYear()}-${String(todayObj.getMonth() + 1).padStart(2, '0')}-${String(todayObj.getDate()).padStart(2, '0')}`;
    
    for (let i = 0; i < totalCells; i++) {
      const current = new Date(year, monthIndex, 1 - firstDayOfWeek + i);
      const dateStr = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`;
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

  // Fallback generator in case backend not available
  const generateBookedSlots = (courtIds: string[] = ['1','2','3','4']): TimeSlot[] => {
    const booked: TimeSlot[] = [];
    const courtsToBook = courtIds;
    courtsToBook.forEach(courtId => {
      const shuffled = [...timeSlots].sort(() => 0.5 - Math.random()).slice(0, 3);
      shuffled.forEach(time => {
        booked.push({ time, available: false, courtId });
      });
    });
    return booked;
  };





  // Filter courts berdasarkan pencarian dan filter
  const filteredCourts = courts.filter(court => {
    const matchesSearch = court.venue?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         court.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         court.location?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSport = sportFilter === 'all' || court.sport === sportFilter;
    const matchesPrice = priceFilter === 'all' ||
                        (priceFilter === 'low' && court.price < 100000) ||
                        (priceFilter === 'medium' && court.price >= 100000 && court.price <= 200000) ||
                        (priceFilter === 'high' && court.price > 200000);

    return matchesSearch && matchesSport && matchesPrice;
  });

  // Debug logging
  console.log('BookingPage Debug:', {
    selectedDate,
    loadingCourts,
    courtsError,
    bookingData,
    courts: courts.length,
    filteredCourts: filteredCourts.length
  });

  // Cek ketersediaan time slot untuk court tertentu
  const isTimeSlotAvailable = (courtId: string, time: string) => {
    const booked = bookedSlots.find(slot => slot.courtId === courtId && slot.time === time && !slot.available);
    return !booked;
  };

  // Fungsi untuk menambah/menghapus slot waktu yang dipilih
  const toggleTimeSlot = (time: string) => {
    if (!selectedDate) return;
    const existingIndex = selectedTimeSlots.findIndex(
      slot => slot.date === selectedDate && slot.time === time
    );
    if (existingIndex >= 0) {
      const newSlots = [...selectedTimeSlots];
      newSlots.splice(existingIndex, 1);
      setSelectedTimeSlots(newSlots);
    } else {
      setSelectedTimeSlots([...selectedTimeSlots, { date: selectedDate, time }]);
    }
  };

  // Fungsi untuk pilih banyak waktu sekaligus
  const selectMultipleTimeSlots = (startTime: string, endTime: string) => {
    if (!selectedDate) return;
    const startHour = parseInt(startTime.split(':')[0]);
    const endHour = parseInt(endTime.split(':')[0]);
    const newSlots = [...selectedTimeSlots];
    for (let hour = startHour; hour < endHour; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;
      const alreadySelected = newSlots.some(
        slot => slot.date === selectedDate && slot.time === time
      );
      const isAvailable = isTimeSlotAvailable(selectedCourt, time);
      const isPast = isTimeInPast(selectedDate, time);
      if (!alreadySelected && isAvailable && !isPast) {
        newSlots.push({ date: selectedDate, time });
      }
    }
    setSelectedTimeSlots(newSlots);
  };

  // Fungsi untuk generate repeat bookings (mingguan/bulanan)
  const generateRepeatBookings = () => {
    if (!selectedDate || selectedTimeSlots.length === 0 || bookingRepeat === 'none') {
      return selectedTimeSlots;
    }
    const allSlots: Array<{date: string, time: string}> = [...selectedTimeSlots];
    const baseDate = new Date(selectedDate);
    if (bookingRepeat === 'weekly') {
      for (let week = 1; week <= repeatWeeks; week++) {
        const weekDate = new Date(baseDate);
        weekDate.setDate(weekDate.getDate() + (week * 7));
        const dateStr = weekDate.toISOString().split('T')[0];
        selectedTimeSlots.forEach(slot => {
          allSlots.push({ date: dateStr, time: slot.time });
        });
      }
    } else if (bookingRepeat === 'monthly') {
      for (let month = 1; month <= repeatMonths; month++) {
        const monthDate = new Date(baseDate);
        monthDate.setMonth(monthDate.getMonth() + month);
        const dateStr = monthDate.toISOString().split('T')[0];
        selectedTimeSlots.forEach(slot => {
          allSlots.push({ date: dateStr, time: slot.time });
        });
      }
    }
    return allSlots;
  };

  // Hitung total harga
  const calculateTotalPrice = () => {
    const selectedCourtData = courts.find(c => c.id === selectedCourt);
    if (!selectedCourtData) return 0;
    const allBookings = generateRepeatBookings();
    return allBookings.length * selectedCourtData.price;
  };

  useEffect(() => {
    // Check for pending booking from location state
    if (location.state?.restoreBooking && location.state?.bookingData) {
      const bookingData = location.state.bookingData;
      if (bookingData.selectedDate) setSelectedDate(bookingData.selectedDate);
      if (bookingData.selectedCourt) setSelectedCourt(bookingData.selectedCourt);
      if (bookingData.selectedTimeSlots) setSelectedTimeSlots(bookingData.selectedTimeSlots);
      if (bookingData.step) setStep(bookingData.step);
    }

    // Check for pending booking from sessionStorage (fallback)
    const pendingBooking = sessionStorage.getItem('pendingBooking');
    if (pendingBooking && user) {
      const bookingData = JSON.parse(pendingBooking);
      if (bookingData.selectedDate) setSelectedDate(bookingData.selectedDate);
      if (bookingData.selectedCourt) setSelectedCourt(bookingData.selectedCourt);
      if (bookingData.selectedTimeSlots) setSelectedTimeSlots(bookingData.selectedTimeSlots);
      if (bookingData.step) setStep(bookingData.step);
      sessionStorage.removeItem('pendingBooking');
    }
  }, [location.state, user]);

  useEffect(() => {
    const pendingBooking = localStorage.getItem('pendingBooking');
    if (pendingBooking) {
      const bookingData = JSON.parse(pendingBooking);
      if (bookingData.selectedDate) setSelectedDate(bookingData.selectedDate);
      if (bookingData.selectedCourt) setSelectedCourt(bookingData.selectedCourt);
      if (bookingData.selectedTimeSlots) {
        setSelectedTimeSlots(bookingData.selectedTimeSlots);
        setStep(3);
      }
      localStorage.removeItem('pendingBooking');
    }
  }, []);

  useEffect(() => {
  if (bookingData && bookingData.fields) {
    const mappedCourts: Court[] = bookingData.fields.map((f: any) => ({
      id: f.id,
      name: f.name,
      venue: f.location || "Venue Utama", 
      location: f.city,
      type: "Umum",
      sport: "Padel", 
      price: parseFloat(f.price_per_hour), 
      image: f.field_images?.[0]?.image_path ? `http://localhost:4000${f.field_images[0].image_path}` : "🏟️",
      description: f.description,
      facilities: f.field_facilities?.map((ff: any) => ff.facilities.name) || [],
      rating: 4.8,
      indoor: true
    }));
    setCourts(mappedCourts);
  }
}, [bookingData]);
  // Reset selection ketika date berubah
  useEffect(() => {
    setSelectedTimeSlots([]);
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
            <div className="dates-grid">
              {availableDates.map((dateObj, index) => {
                const handleDateClick = () => {
                  if (dateObj.isCurrentMonth && !dateObj.isPast) {
                    setSelectedDate(dateObj.date);
                  }
                };
                return (
                  <button
                    key={`${dateObj.date}-${index}`}
                    className={`date-cell ${!dateObj.isCurrentMonth ? 'other-month' : ''} ${dateObj.isToday ? 'today' : ''} ${selectedDate === dateObj.date ? 'selected' : ''} ${dateObj.isPast ? 'past-date' : ''}`}
                    onClick={handleDateClick}
                    disabled={!dateObj.isCurrentMonth || dateObj.isPast}
                    title={dateObj.date}
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
          <p className="section-subtitle">Tanggal: {new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div style={{ background: '#f0f8ff', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '0.9rem', color: '#666' }}>
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

  // Step 2: Pilih Waktu dengan Multi Selection
  const renderStep2 = () => {
    const selectedCourtData = courts.find(c => c.id === selectedCourt);
    const allBookings = generateRepeatBookings();
    
    return (
      <div className="booking-step">
        <div className="time-selection-header">
          <h2 className="time-selection-title">🕐 Pilih Waktu Booking</h2>
          
          <div className="repeat-booking-section">
            <h3>🔄 Pemesanan Berulang</h3>
            <div className="repeat-options">
              <label className="repeat-option">
                <input
                  type="radio"
                  name="repeat"
                  value="none"
                  checked={bookingRepeat === 'none'}
                  onChange={(e) => setBookingRepeat(e.target.value as any)}
                />
                <span>Tidak berulang (sekali pesan)</span>
              </label>
              
              <label className="repeat-option">
                <input
                  type="radio"
                  name="repeat"
                  value="weekly"
                  checked={bookingRepeat === 'weekly'}
                  onChange={(e) => setBookingRepeat(e.target.value as any)}
                />
                <span>Setiap minggu (mingguan)</span>
                {bookingRepeat === 'weekly' && (
                  <div className="repeat-details">
                    <span>Selama:</span>
                    <select 
                      value={repeatWeeks}
                      onChange={(e) => setRepeatWeeks(Number(e.target.value))}
                      className="repeat-select"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                        <option key={num} value={num}>{num} minggu</option>
                      ))}
                    </select>
                  </div>
                )}
              </label>
              
              <label className="repeat-option">
                <input
                  type="radio"
                  name="repeat"
                  value="monthly"
                  checked={bookingRepeat === 'monthly'}
                  onChange={(e) => setBookingRepeat(e.target.value as any)}
                />
                <span>Setiap bulan (bulanan)</span>
                {bookingRepeat === 'monthly' && (
                  <div className="repeat-details">
                    <span>Selama:</span>
                    <select 
                      value={repeatMonths}
                      onChange={(e) => setRepeatMonths(Number(e.target.value))}
                      className="repeat-select"
                    >
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num}>{num} bulan</option>
                      ))}
                    </select>
                  </div>
                )}
              </label>
            </div>
          </div>
          
          <div className="booking-summary-large">
            <div className="summary-item-large">
              <span className="summary-label">Lapangan:</span>
              <span className="summary-value">{selectedCourtData?.name}</span>
            </div>
            <div className="summary-item-large">
              <span className="summary-label">Tanggal:</span>
              <span className="summary-value">
                {new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
            <div className="summary-item-large">
              <span className="summary-label">Harga per jam:</span>
              <span className="summary-value price">Rp {selectedCourtData?.price.toLocaleString()}</span>
            </div>
            <div className="summary-item-large">
              <span className="summary-label">Slot dipilih:</span>
              <span className="summary-value">{selectedTimeSlots.length} slot</span>
            </div>
          </div>
          
          <div className="time-range-selection">
            <h4>⏳ Pilih Rentang Waktu (Opsional)</h4>
            <div className="range-selection-buttons">
              <button 
                className="range-btn"
                onClick={() => selectMultipleTimeSlots('10:00', '12:00')}
              >
                10:00 - 12:00 (2 jam)
              </button>
              <button 
                className="range-btn"
                onClick={() => selectMultipleTimeSlots('14:00', '17:00')}
              >
                14:00 - 17:00 (3 jam)
              </button>
              <button 
                className="range-btn"
                onClick={() => selectMultipleTimeSlots('18:00', '21:00')}
              >
                18:00 - 21:00 (3 jam)
              </button>
              <button 
                className="range-btn"
                onClick={() => setSelectedTimeSlots([])}
              >
                🔄 Reset Semua Pilihan
              </button>
            </div>
          </div>
          
          {selectedTimeSlots.length > 0 && (
            <div className="selected-slots-preview">
              <h4>✅ Slot Waktu Dipilih ({selectedTimeSlots.length} slot):</h4>
              <div className="selected-slots-list">
                {selectedTimeSlots.map((slot, index) => (
                  <div key={index} className="selected-slot-badge">
                    {slot.time}:00 - {parseInt(slot.time) + 1}:00
                    <button 
                      className="remove-slot-btn"
                      onClick={() => {
                        const newSlots = [...selectedTimeSlots];
                        newSlots.splice(index, 1);
                        setSelectedTimeSlots(newSlots);
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="time-slots-section">
          <h3 className="time-slots-title">⏰ Slot Waktu Tersedia (Klik untuk pilih lebih dari satu)</h3>
          <p className="time-slots-subtitle">Tips: Klik tombol rentang waktu di atas untuk memilih beberapa jam sekaligus</p>
          
          <div className="time-slots-grid-ordered">
            {timeSlots.map(time => {
              const isAvailable = isTimeSlotAvailable(selectedCourt, time);
              const isSelected = selectedTimeSlots.some(slot => slot.date === selectedDate && slot.time === time);
              const isPast = isTimeInPast(selectedDate, time);
              
              return (
                <button
                  key={time}
                  className={`time-slot-btn-large ${isSelected ? 'selected' : ''} ${!isAvailable ? 'booked' : ''} ${isPast ? 'past-time' : ''}`}
                  onClick={() => isAvailable && !isPast && toggleTimeSlot(time)}
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
                  {isSelected && (
                    <div className="selected-checkmark">✓</div>
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
            disabled={selectedTimeSlots.length === 0}
            onClick={() => setStep(3)}
          >
            💳 Lanjut ke Pembayaran ({selectedTimeSlots.length} slot) →
          </button>
        </div>
      </div>
    );
  };

  // === Handler Pembayaran ===
  const handlePayment = async () => {
    const localUser = JSON.parse(localStorage.getItem('user') || 'null');

    if (!localUser) {
      const bookingData = {
        selectedDate,
        selectedTimeSlots,
        selectedCourt,
        selectedCourtData: courts.find(c => c.id === selectedCourt),
        bookingRepeat,
        repeatWeeks,
        repeatMonths,
        step: 3,
        timestamp: new Date().toISOString()
      };
      sessionStorage.setItem('pendingBooking', JSON.stringify(bookingData));
      navigate('/auth', { state: { redirectPath: '/booking', message: 'Silakan login untuk melanjutkan pembayaran' } });
      return;
    }

    const allBookings = generateRepeatBookings();
    const selectedCourtData = courts.find(c => c.id === selectedCourt);
    const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const cancelDeadline = new Date();
    cancelDeadline.setMinutes(cancelDeadline.getMinutes() + 15);

    const bookingRecords: BookingItem[] = allBookings.map((slot, index) => ({
      id: `booking-${Date.now()}-${index}`,
      courtId: selectedCourt,
      date: slot.date,
      time: slot.time,
      duration: 1,
      price: selectedCourtData?.price || 0,
      courtName: selectedCourtData?.name || '',
      venue: selectedCourtData?.venue || '',
      location: selectedCourtData?.location || '',
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: 'bca',
      invoiceNumber: index === 0 ? invoiceNumber : `${invoiceNumber}-${index + 1}`,
      createdAt: new Date().toISOString(),
      canCancelUntil: cancelDeadline.toISOString()
    }));

    // Try to create bookings via REST backend first
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookings: bookingRecords, userId: localUser.id })
      });
      if (!res.ok) throw new Error('Backend booking creation failed');
      const result = await res.json();
      alert(`Pembayaran berhasil! ${allBookings.length} booking telah dibuat.`);
      navigate('/my-bookings');
      return;
    } catch (err) {
      // GraphQL fallback
      try {
        const gRes = await fetch('/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `mutation ($input: [CreateBookingInput!]!) { createBookings(input: $input) { id } }`,
            variables: { input: bookingRecords.map(b => ({ ...b, userId: localUser.id })) }
          })
        });
        const gJson = await gRes.json();
        if (gJson.errors) throw new Error('GraphQL create failed');
        alert(`Pembayaran berhasil! ${allBookings.length} booking telah dibuat.`);
        navigate('/my-bookings');
        return;
      } catch (gErr) {
        // Final fallback: localStorage
        const existingBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
        const updatedBookings = [...existingBookings, ...bookingRecords];
        localStorage.setItem('userBookings', JSON.stringify(updatedBookings));
        alert(`Pembayaran (lokal) berhasil! ${allBookings.length} booking telah dibuat (offline).`);
        navigate('/my-bookings');
        return;
      }
    }
  };

  // Step 3: Konfirmasi & Pembayaran
  const renderStep3 = () => {
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
              <p>Untuk menyelesaikan pemesanan dan melakukan pembayaran, Anda harus register / login ke akun Anda terlebih dahulu.</p>
              
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

    const selectedCourtData = courts.find(c => c.id === selectedCourt);
    const allBookings = generateRepeatBookings();
    const totalPrice = calculateTotalPrice();
    
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
                <span>Jenis Lapangan:</span>
                <span>{selectedCourtData?.type}</span>
              </div>
              <div className="detail-item">
                <span>Pemesanan Berulang:</span>
                <span>
                  {bookingRepeat === 'none' ? 'Tidak berulang' : 
                   bookingRepeat === 'weekly' ? `Mingguan (${repeatWeeks} minggu)` : 
                   `Bulanan (${repeatMonths} bulan)`}
                </span>
              </div>
              <div className="detail-item">
                <span>Total Slot Waktu:</span>
                <strong>{allBookings.length} slot</strong>
              </div>
              
              <div className="detail-item-full">
                <span>Detail Slot Waktu:</span>
                <div className="time-slots-details">
                  {allBookings.map((slot, index) => (
                    <div key={index} className="slot-detail-item">
                      <span>Slot {index + 1}:</span>
                      <span>
                        {new Date(slot.date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })} • {slot.time}:00 - {parseInt(slot.time) + 1}:00
                      </span>
                    </div>
                  ))}
                </div>
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
                  <span>Jumlah Slot:</span>
                  <span>{allBookings.length} slot @ 1 jam</span>
                </div>
                {bookingRepeat !== 'none' && (
                  <div className="summary-item">
                    <span>Pemesanan Berulang:</span>
                    <span>
                      {bookingRepeat === 'weekly' ? `${repeatWeeks} minggu` : 
                       bookingRepeat === 'monthly' ? `${repeatMonths} bulan` : ''}
                    </span>
                  </div>
                )}
                <hr />
                <div className="summary-total">
                  <span>Total Pembayaran:</span>
                  <span className="total-amount">
                    Rp {totalPrice.toLocaleString()}
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
            onClick={handlePayment}
          >
            🎯 Konfirmasi & Bayar (Rp {calculateTotalPrice().toLocaleString()})
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="booking-page">
      <div style={{ background: '#ffefc2', padding: '10px', borderRadius: 8, marginBottom: 12, color: '#333', textAlign: 'center' }}>
        DEBUG: BookingPage component mounted
      </div>
      
      <div className="booking-header">
        <div className="booking-title-section">
          <h1 className="booking-main-title">🏀 Booking Lapangan</h1>
          <div className="progress-steps-centered">
            <div className="steps-container-centered">
              {[1, 2, 3].map(num => (
                <div key={num} className="step-item-centered">
                  <div className={`step-number-centered ${step >= num ? 'active' : ''}`}>
                    {num}
                  </div>
                  <div className="step-label-centered">
                    {num === 1 && 'Pilih Lapangan'}
                    {num === 2 && 'Pilih Waktu'}
                    {num === 3 && 'Pembayaran'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="booking-content">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>
    </div>
  );
};

export default BookingPage;