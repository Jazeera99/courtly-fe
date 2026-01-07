import { GraphQLScalarType, Kind, ValueNode } from 'graphql';
import { useQuery } from '@apollo/client';
import { GET_BOOKING_DATA } from '../graphql/queries';
import { CREATE_RESERVATION_DRAFT, MUTATION_CONFIRM } from '../graphql/mutations';
import { useMutation } from '@apollo/client';
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
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

interface ReservationDraft {
  reservationId: string;
  totalAmount: number;
  expiresAt: string;
  __typename?: string;
}

const BookingPage: React.FC<BookingPageProps> = ({ user: userProp }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedCourt, setSelectedCourt] = useState<string>('');
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<Array<{date: string, time: string}>>([]);
  const [bookingRepeat, setBookingRepeat] = useState<'none' | 'weekly' | 'monthly'>('none');
  const [repeatWeeks, setRepeatWeeks] = useState<number>(1);
  const [repeatMonths, setRepeatMonths] = useState<number>(1);
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sportFilter, setSportFilter] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [step, setStep] = useState<number>(1);
  const [reservationInfo, setReservationInfo] = useState<ReservationDraft | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [createReservationDraft, { loading: creatingDraft }] = useMutation(CREATE_RESERVATION_DRAFT);
  const [confirmReservation, { loading: confirming }] = useMutation(MUTATION_CONFIRM);

  const [bookingType, setBookingType] = useState<'single' | 'weekly' | 'monthly'>('single');
  const [multiDates, setMultiDates] = useState<string[]>([]); // Untuk menyimpan banyak tanggal
  const [duration, setDuration] = useState(1); // Untuk jumlah minggu/bulan
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);

  const localUser = JSON.parse(localStorage.getItem('user') || 'null');
  const currentUser = userProp || localUser;
  const [createDraft] = useMutation(CREATE_RESERVATION_DRAFT);
  const [confirmBooking] = useMutation(MUTATION_CONFIRM);
  const [resId, setResId] = useState<string | null>(null);

  const toggleMultiDate = (date: string) => {
    if (multiDates.includes(date)) {
      setMultiDates(multiDates.filter(d => d !== date));
    } else {
      setMultiDates([...multiDates, date]);
    }
  };

  // Data from backend
  const [courts, setCourts] = useState<Court[]>([]);
  const [bookedSlots, setBookedSlots] = useState<TimeSlot[]>([]);
  // const [loadingCourts, setLoadingCourts] = useState<boolean>(false);
  const [loadingBooked, setLoadingBooked] = useState<boolean>(false);

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
    // const [year, month, day] = selectedDate.split('-').map(Number);
    const [hours] = time.split(':').map(Number);
    // const slotDateTime = new Date(selectedDate);
    // slotDateTime.setHours(hours, 0, 0, 0);
    const [year, month, day] = selectedDate.split('-').map(Number);
    const slotDateTime = new Date(year, month - 1, day, hours, 0, 0);
    return slotDateTime < now;
  };

  const getSlotStatus = (courtId: string, time: string, date: string) => {
    // Cari data di bookedSlots dari database
    const slotData = bookedSlots.find(
      slot => slot.courtId === courtId && slot.time === time
    );

    // LOGIKA STATUS:
    // a. Cek Maintenance (Contoh: jika ada flag maintenance di data lapangan)
    const court = courts.find(c => c.id === courtId);
    if (court?.description?.toLowerCase().includes('maintenance')) {
       return 'MAINTENANCE';
    }

    // b. Cek Masa Lalu
    if (isTimeInPast(date, time)) return 'PAST';

    // c. Cek Penuh (Sudah dibooking & lunas)
    const isBooked = bookedSlots.some(
      slot => slot.courtId === courtId && slot.time === time && slot.date === date
    );
    if (isBooked) return 'FULL';
    // if (slotData) {
    //    // Di sini Anda bisa kembangkan: if (slotData.paymentStatus === 'paid') ...
    //    return 'FULL';
    // }

    // d. Cek Tidak Tersedia (Misal: Jam operasional 08:00 - 22:00)
    const hour = parseInt(time);
    if (hour < 7 || hour > 22) { // Contoh jam operasional
       return 'UNAVAILABLE';
    }

    return 'AVAILABLE';
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

  const { data: bookingData, loading: loadingCourts, error: courtsError } = useQuery(GET_BOOKING_DATA, {
    variables: { date: selectedDate },
    skip: !selectedDate,
  });

  useEffect(() => {
  console.log("Cek data dari GraphQL:", bookingData);

  if (bookingData && bookingData.fields) {
    console.log("Jumlah lapangan ditemukan:", bookingData.fields.length);
    const mappedCourts: Court[] = bookingData.fields.map((f: any) => ({
      id: String(f.id)|| '',
      name: f.name,
      venue: "Venue Utama", // Bisa sesuaikan jika ada tabel Venue
      location: `${f.full_address}, ${f.city}`,
      type: f.field_categories?.[0]?.categories?.name || 'Umum',
      price: Number(f.pricePerHour || '0'), 
      rating: 4.8,
      // Gunakan URL backend untuk image
      image: f.field_images?.[0]?.image_path 
             ? `http://localhost:4000${f.field_images[0].image_path}` 
             : '🏟️',
      description: f.description,
      facilities: f.field_facilities 
          ? f.field_facilities
              .map((ff: any) => ff.facilities?.name) 
              .filter((name: any) => name != null) 
          : [],
      indoor: true,
      // Simpan slots di sini agar bisa dipakai di Step 2
      slots: f.availableSlots 
    }));
    setCourts(mappedCourts);
  }
}, [bookingData]);

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

  // Cek ketersediaan time slot untuk court tertentu
  const isTimeSlotAvailable = (courtId: string, time: string) => {
    const court = courts.find(c => c.id === courtId);
    if (!court || !(court as any).slots) return false;
    
    // Cari slot yang jam-nya cocok (misal: "06:00")
    const slot = (court as any).slots.find((s: any) => s.start === time);
    return slot ? slot.available : false;
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

  // 1. Fungsi Hitung Harga di Frontend (Hanya untuk Tampilan)
  const calculateTotalPrice = () => {
    const selectedCourtData = courts.find(c => c.id === selectedCourt);
    if (!selectedCourtData) return 0;

    const pricePerHour = selectedCourtData.price; // Ambil dari data lapangan
    const totalHours = selectedSlots.length;
    
    // Jika single = 1 tanggal, jika weekly = jumlah multiDates
    const totalDays = bookingType === 'single' ? 1 : multiDates.length;

    return pricePerHour * totalHours * totalDays;
  };

  // 2. Fungsi Kirim Data ke Backend
  const handleConfirmBooking = async () => {
    // 1. CEK DULU DI CONSOLE (PENTING!)
    // Jika di console muncul 'Data Kosong', berarti masalahnya di state UI Anda
    console.log("ISI STATE SAAT INI:", { 
      lapangan: selectedCourt, 
      jam: selectedTimeSlots 
    });

    if (!selectedCourt || selectedTimeSlots.length === 0) {
      alert("Pilih lapangan dan jam terlebih dahulu!");
      return;
    }

    const datesToSend = bookingType === 'single' ? [selectedDate] : multiDates;

    try {
      // 2. KIRIM DENGAN STRING CASTING
      const { data } = await createReservationDraft({
        variables: {
          fieldId: String(selectedCourt), 
          slots: selectedSlots.map(s => ({ 
            start: String(s), 
            end: String(s) 
          })),
          recurring: {
            type: bookingType,
            dates: datesToSend,
            count: datesToSend.length
          }
        }
      });

      if (data?.createReservationDraft) {
        setReservationInfo(data.createReservationDraft);
        setStep(3); // Pindah ke layar pembayaran
      }
    } catch (err: any) {
      console.error("Error dari Server:", err);
      // Jika server kirim error (misal: BigInt error), akan muncul di alert ini
      alert(err.graphQLErrors?.[0]?.message || err.message);
    }
  };

  useEffect(() => {
    // 1. Ambil data dari location state (dikirim langsung dari AuthPage)
    // ATAU ambil dari sessionStorage (cadangan jika page refresh)
    const savedState = location.state?.bookingData;
    const savedSession = sessionStorage.getItem('pendingBooking');
    
    const bookingData = savedState || (savedSession ? JSON.parse(savedSession) : null);

    if (bookingData && currentUser) {
      console.log("Memulihkan data booking...", bookingData);

      // 2. Isi kembali semua state form
      if (bookingData.selectedCourt) setSelectedCourt(bookingData.selectedCourt);
      if (bookingData.selectedDate) setSelectedDate(bookingData.selectedDate);
      if (bookingData.selectedTimeSlots) setSelectedTimeSlots(bookingData.selectedTimeSlots);
      if (bookingData.bookingRepeat) setBookingRepeat(bookingData.bookingRepeat);
      if (bookingData.bookingType) setBookingType(bookingData.bookingType);
      if (bookingData.multiDates) setMultiDates(bookingData.multiDates);

      // 3. Paksa halaman ke Step 3 (Pembayaran) agar user tidak mengulang dari awal
      setStep(3); 

      // 4. Bersihkan penyimpanan agar tidak muncul lagi saat login berikutnya
      sessionStorage.removeItem('pendingBooking');
      // Bersihkan juga history state agar jika di-refresh tidak mengisi ulang
      window.history.replaceState({}, document.title);
    }
  }, [location.state, currentUser]);
 
  // useEffect(() => {
  //   // Check for pending booking from location state
  //   if (location.state?.restoreBooking && location.state?.bookingData) {
  //     const bookingData = location.state.bookingData;
  //     if (bookingData.selectedDate) setSelectedDate(bookingData.selectedDate);
  //     if (bookingData.selectedCourt) setSelectedCourt(bookingData.selectedCourt);
  //     if (bookingData.selectedTimeSlots) setSelectedTimeSlots(bookingData.selectedTimeSlots);
  //     if (bookingData.step) setStep(bookingData.step);
  //   }

  //   // Check for pending booking from sessionStorage (fallback)
  //   const pendingBooking = sessionStorage.getItem('pendingBooking');
  //   if (pendingBooking && user) {
  //     const bookingData = JSON.parse(pendingBooking);
  //     if (bookingData.selectedDate) setSelectedDate(bookingData.selectedDate);
  //     if (bookingData.selectedCourt) setSelectedCourt(bookingData.selectedCourt);
  //     if (bookingData.selectedTimeSlots) setSelectedTimeSlots(bookingData.selectedTimeSlots);
  //     if (bookingData.step) setStep(bookingData.step);
  //     sessionStorage.removeItem('pendingBooking');
  //   }
  // }, [location.state, user]);

  // useEffect(() => {
  //   const pendingBooking = localStorage.getItem('pendingBooking');
  //   if (pendingBooking) {
  //     const bookingData = JSON.parse(pendingBooking);
  //     if (bookingData.selectedDate) setSelectedDate(bookingData.selectedDate);
  //     if (bookingData.selectedCourt) setSelectedCourt(bookingData.selectedCourt);
  //     if (bookingData.selectedTimeSlots) {
  //       setSelectedTimeSlots(bookingData.selectedTimeSlots);
  //       setStep(3);
  //     }
  //     localStorage.removeItem('pendingBooking');
  //   }
  // }, []);

  // Reset selection ketika date berubah
  useEffect(() => {
    setSelectedTimeSlots([]);
  }, [selectedDate]);

  useEffect(() => {
  if (step === 3 && timeLeft > 0) {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          alert("Waktu habis! Lapangan dilepas kembali.");
          window.location.reload(); 
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }
}, [step, timeLeft]);

  // Gunakan useEffect untuk memicu Draft saat masuk Step 3
  useEffect(() => {
    if (step === 3 && selectedCourt && !reservationInfo) {
      handleCreateDraft();
    }
  }, [step]);

  const handleCreateDraft = async () => {
    try {
      const allBookings = generateRepeatBookings(); // Ambil semua tanggal (weekly/monthly)
      const uniqueDates = Array.from(new Set(allBookings.map(b => b.date)));
      
      const { data: draftResult } = await createDraft({
        variables: {
          fieldId: selectedCourt,
          date: selectedDate,
          slots: selectedTimeSlots.map(s => {
            const hour = String(s).padStart(2, '0');
            return { start: hour, end: (parseInt(hour) + 1).toString().padStart(2, '0') };
          }),
          recurring: {
            type: bookingRepeat,
            count: bookingRepeat === 'weekly' ? repeatWeeks : 1,
            dates: uniqueDates
          }
        }
      });

      if (draftResult?.createReservationDraft) {
        // Simpan ID reservasi yang didapat dari DB
        console.log("Data diterima:", draftResult.createReservationDraft);
        setReservationInfo({
          reservationId: draftResult.createReservationDraft.reservationId,
          totalAmount: draftResult.createReservationDraft.totalAmount,
          expiresAt: draftResult.createReservationDraft.expiresAt
        });
        
        const expiry = new Date(draftResult.createReservationDraft.expiresAt).getTime();
        const diff = Math.floor((expiry - Date.now()) / 1000);
        // setTimeLeft(diff > 0 ? diff : 0);
        setTimeLeft(600);

        setStep(3);
      }
    } catch (err: any) {
      alert("Gagal: " + (err.graphQLErrors?.[0]?.message || err.message));
      setStep(2); // Kembalikan ke pilih waktu
    }
  };

  const handleGoToPayment = async () => {
    const latestUser = userProp || JSON.parse(localStorage.getItem('user') || 'null');
    // Cek apakah user sudah login
    if (!latestUser?.id) {
      // Simpan semua state yang sudah dipilih user agar tidak hilang
      const pendingData = {
        selectedCourt,
        selectedDate,
        selectedTimeSlots,
        bookingRepeat,
        bookingType,
        multiDates,
      };
      
      sessionStorage.setItem('pendingBooking', JSON.stringify(pendingData));
      
      alert("Silakan login terlebih dahulu untuk melanjutkan pembayaran.");
      // Arahkan ke login dengan query redirect agar AuthPage tahu harus balik ke sini
      navigate('/auth?mode=login&redirect=/booking'); 
      return;
    }

    // Validasi awal
    if (!selectedCourt) {
      alert("Pilih lapangan dan jam terlebih dahulu!");
      return;
    }

    // 2. Format ulang data slot agar sesuai dengan 'TimeRangeInput' backend
    // Backend biasanya minta startTime & endTime (misal: "09:00" & "10:00")
    // const formattedSlots = selectedTimeSlots.map(slot => {
    //   const startHour = parseInt(slot.time.split(':')[0]);
    //   return {
    //     start: `${startHour.toString().padStart(2, '0')}:00`,
    //     end: `${(startHour + 1).toString().padStart(2, '0')}:00`
    //   };
    // });

    try {

      console.log("Mencoba membuat draft untuk Lapangan ID:", selectedCourt);

      // 3. Jalankan mutasi GraphQL
      const { data } = await createDraft({
        variables: {
          fieldId: String(selectedCourt),
          date: selectedDate,
          slots: selectedTimeSlots.map(slot => {
            const startHour = parseInt(slot.time.split(':')[0]);
            return {
              start: `${startHour.toString().padStart(2, '0')}:00`,
              end: `${(startHour + 1).toString().padStart(2, '0')}:00`
            };
          }),
          recurring: {
            type: bookingRepeat === 'none' ? 'SINGLE' : 'WEEKLY',
            dates: bookingType === 'single' ? [selectedDate] : multiDates,
            count: bookingType === 'single' ? 1 : multiDates.length
          }
        }
      });

      if (data?.createReservationDraft?.reservationId) {
        setReservationInfo(data.createReservationDraft);
        setStep(3); // Berhasil, lanjut ke ringkasan bayar
      } else {
        throw new Error("Gagal membuat draft reservasi. Server tidak mengembalikan ID.");
      }
    } catch (err: any) { 
      console.error("Detail Error dari Server:", err);

      // ANALISIS ERROR UNTUK ANDA:
      if (err.message.includes("null (reading 'id')")) {
        alert(
          "Backend Error: Server tidak menemukan data Lapangan atau User di database.\n\n" +
          "Cek apakah Lapangan ID '" + selectedCourt + "' benar-benar ada di database."
        );
      } else {
        alert("Gagal: " + err.message);
      }
    }
  };

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
                    <p className="court-venue">{court.type}</p>
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
                    <span className="price-amount">Rp {court.price.toLocaleString('id-ID')}</span>
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
          {/* --- TOMBOL NAVIGASI TIPE (BIRU JIKA AKTIF) --- */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center' }}>
            <button
              onClick={() => { setBookingType('single'); setMultiDates([]); }}
              style={{
                padding: '10px 20px', borderRadius: '20px', border: '1px solid #007bff', cursor: 'pointer',
                backgroundColor: bookingType === 'single' ? '#007bff' : '#fff',
                color: bookingType === 'single' ? '#fff' : '#007bff',
                fontWeight: 'bold'
              }}
            >
              🚫 Sekali Pesan
            </button>
            <button
              onClick={() => { setBookingType('weekly'); setMultiDates([]); }}
              style={{
                padding: '10px 20px', borderRadius: '20px', border: '1px solid #007bff', cursor: 'pointer',
                backgroundColor: bookingType === 'weekly' ? '#007bff' : '#fff',
                color: bookingType === 'weekly' ? '#fff' : '#007bff',
                fontWeight: 'bold'
              }}
            >
              📅 Pesanan Berulang
            </button>
            
          </div>

          <div className="booking-card" style={{ padding: '20px', border: '1px solid #eee', borderRadius: '15px' }}>
            
            {/* --- KONDISI 1: SEKALI PESAN --- */}
            {bookingType === 'single' && (
              <div className="single-ui">
                <h4 style={{ color: '#333' }}>📅 Pilih Tanggal Main</h4>
                <input 
                  type="date" 
                  value={selectedDate} 
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{ width: '100%', padding: '10px', marginTop: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
                />
              </div>
            )}

            {/* --- KONDISI 2: MINGGUAN --- */}
            {bookingType === 'weekly' && (
              <div className="weekly-ui">
                <h4 style={{ color: '#007bff' }}>🚀 Paket Bebas</h4>
                
                <p><small>Pilih hari apa saja dalam seminggu:</small></p>
                <input 
                  type="date" 
                  onChange={(e) => e.target.value && toggleMultiDate(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
                />
              </div>
            )}

        {/* --- TAGS TANGGAL (Hanya muncul jika bukan Single) --- */}
        {bookingType !== 'single' && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '15px' }}>
            {multiDates.map(d => (
              <div key={d} style={{ background: '#007bff', color: '#fff', padding: '5px 12px', borderRadius: '20px', fontSize: '12px' }}>
                {d} <span onClick={() => toggleMultiDate(d)} style={{ cursor: 'pointer', marginLeft: '5px' }}>×</span>
              </div>
            ))}
          </div>
        )}
          </div>
        </div>


        {/* Render Time Slots di bawahnya (berlaku untuk semua tanggal yang dipilih) */}
        <div className="time-slots-section" style={{ marginTop: '20px' }}>
          <h3>Pilih Jam</h3>
          <p><small>*Jam yang dipilih akan diterapkan ke semua tanggal di atas</small></p>
          {/* ... (Gunakan logika rendering slots yang sudah ada di file kamu) ... */}
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
              // const isAvailable = isTimeSlotAvailable(selectedCourt, time);
              // const isSelected = selectedTimeSlots.some(slot => slot.date === selectedDate && slot.time === time);
              // const isPast = isTimeInPast(selectedDate, time);
              
              // 1. Panggil fungsi status (Otak)
              const status = getSlotStatus(selectedCourt, time, selectedDate);
              
              // 2. Tentukan variabel berdasarkan status
              const isSelected = selectedTimeSlots.some(slot => slot.date === selectedDate && slot.time === time);
              
              let label = "✅ Tersedia";
              let btnClass = "";
              let isDisabled = false;

              // Logika penentuan tampilan
              if (status === 'FULL') {
                label = "⛔ Penuh";
                btnClass = "booked";
                isDisabled = true;
              } else if (status === 'PAST') {
                label = "⌛ Lewat";
                btnClass = "past-time";
                isDisabled = true;
              } else if (status === 'MAINTENANCE') {
                label = "🛠️ Perbaikan";
                btnClass = "maintenance"; // Anda bisa tambah CSS warna kuning
                isDisabled = true;
              } else if (status === 'UNAVAILABLE') {
                label = "🚫 Tutup";
                btnClass = "unavailable"; // Anda bisa tambah CSS warna abu-abu
                isDisabled = true;
              }

              return (
                <button
                  key={time}
                  // Tombol mati jika: Penuh, Lewat, Perbaikan, atau Tutup
                  disabled={isDisabled} 
                  className={`time-slot-btn-large ${isSelected ? 'selected' : ''} ${btnClass}`}
                  onClick={() => !isDisabled && toggleTimeSlot(time)}
                >
                  <div className="time-range-large">{time} - {parseInt(time) + 1}:00</div>
                  
                  <div className="time-status-large">{label}</div>

                  {/* Harga hanya muncul jika statusnya Tersedia */}
                  {status === 'AVAILABLE' && (
                    <div className="time-price-large">
                      Rp {selectedCourtData?.price.toLocaleString()}
                    </div>
                  )}

                  {isSelected && (
                    <div className="selected-checkmark">✓</div>
                  )}
                </button>
                // <button
                //   key={time}
                //   className={`time-slot-btn-large ${isSelected ? 'selected' : ''} ${!isAvailable ? 'booked' : ''} ${isPast ? 'past-time' : ''}`}
                //   onClick={() => isAvailable && !isPast && toggleTimeSlot(time)}
                //   disabled={!isAvailable || isPast}
                // >
                //   <div className="time-range-large">{time} - {parseInt(time) + 1}:00</div>
                //   <div className="time-status-large">
                //     {!isAvailable ? '⛔ Penuh' : isPast ? '⌛ Lewat' : '✅ Tersedia'}
                //   </div>
                //   {isAvailable && !isPast && (
                //     <div className="time-price-large">
                //       Rp {selectedCourtData?.price.toLocaleString()}
                //     </div>
                //   )}
                //   {isSelected && (
                //     <div className="selected-checkmark">✓</div>
                //   )}
                // </button>
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
            disabled={selectedTimeSlots.length === 0 || creatingDraft}
            onClick={handleGoToPayment} // Panggil fungsi yang baru kita buat
          >
            {creatingDraft ? "⏳ Mengunci Slot..." : `💳 Lanjut ke Pembayaran (${selectedTimeSlots.length} slot) →`}
          </button>
        </div>
      </div>
    );
  };

  // === Handler Pembayaran ===
  const handlePayment = async () => {
    // 1. CEK LOGIN
    const latestUser = userProp || JSON.parse(localStorage.getItem('user') || 'null');
    if (!latestUser || !latestUser.id) {
      alert("Silakan login terlebih dahulu.");
      navigate('/auth?mode=login&redirect=/booking');
      return;
    }

    // 2. CEK SESI BOOKING
    if (!reservationInfo?.reservationId) {
      alert("Sesi booking tidak ditemukan. Silakan pilih waktu lagi.");
      setStep(2); 
      return;
    }

    try {
      // 3. PANGGIL BACKEND UNTUK DAPAT URL
      const { data } = await confirmReservation({
        variables: { reservationId: reservationInfo.reservationId }
      });

      const snapUrl = data?.confirmReservation?.snapUrl;
      if (!snapUrl) throw new Error("Gagal mendapatkan link pembayaran.");

      // 4. EKSTRAK TOKEN DARI URL
      // Contoh URL: https://app.sandbox.midtrans.com/snap/v2/vtweb/TOKEN-ABC-123
      const snapToken = snapUrl.split('/').pop(); 

      // 5. JALANKAN POP-UP MIDTRANS
      if (window.snap) {
        window.snap.pay(snapToken, {
          onSuccess: (result: any) => {
            alert("Pembayaran Berhasil!");
            navigate('/my-bookings');
          },
          onPending: (result: any) => {
            alert("Silakan selesaikan pembayaran sesuai instruksi.");
            navigate('/my-bookings');
          },
          onError: (result: any) => {
            alert("Maaf, pembayaran gagal diproses.");
          },
          onClose: () => {
            console.log('Customer closed the popup without finishing the payment');
            navigate('/my-bookings');
          }
        });
      } else {
        console.warn("Snap JS tidak terdeteksi, mengalihkan ke redirect URL...");
        window.open(snapUrl, '_blank');
      }

    } catch (err: any) {
      console.error("Payment Error:", err);
      alert("Terjadi kesalahan: " + (err.message || "Gagal memproses pembayaran"));
    }
  };

  //   const handlePayment = async () => {
  //   // CEK LOGIN (Tetap pertahankan logika login kamu)
  //   // const user = JSON.parse(localStorage.getItem('user') || 'null');
  //   const latestUser = userProp || JSON.parse(localStorage.getItem('user') || 'null');

  //   if (!latestUser || !latestUser.id) {
  //     const bookingData = {
  //       selectedDate,
  //       selectedTimeSlots,
  //       selectedCourt,
  //       bookingRepeat,
  //       bookingType,
  //       multiDates,
  //       step: 3,
  //       timestamp: new Date().toISOString()
  //     };
  //     sessionStorage.setItem('pendingBooking', JSON.stringify(bookingData));
  //     alert("Silakan login terlebih dahulu.");
  //     navigate('/auth?mode=login&redirect=/booking');
  //     return;
  //   }

  //   // LOGIKA REAL (Koneksi ke Backend & Midtrans)
  //   try {
  //     if (!reservationInfo?.reservationId) {
  //       alert("Sesi booking tidak ditemukan. Silakan pilih waktu lagi.");
  //       setStep(2); // Mengembalikan user agar boking ulang (Logic dari Kode Saya)
  //       return;
  //     }

  //     console.log("Menghubungkan ke Midtrans untuk user:", latestUser .id);

  //     const { data } = await confirmReservation({
  //       variables: { reservationId: reservationInfo.reservationId }
  //     });
      

  //     if (data?.confirmReservation?.snapUrl) {
  //       // REDIRECT KE MIDTRANS
  //       // Ini akan membuka halaman pembayaran resmi (Gopay/QRIS/Bank)
  //       window.location.href = data.confirmReservation.snapUrl;
  //     } else {
  //       throw new Error("Gagal mendapatkan link pembayaran dari Midtrans.");
  //     }

  //   } catch (err: any) {
  //     console.error("Payment Error:", err);
  //     alert("Gagal memproses pembayaran: " + (err.graphQLErrors?.[0]?.message || err.message));
  //   }
  // };

  // Step 3: Konfirmasi & Pembayaran
  const renderStep3 = () => {
    // 1. LOGIN GATE (Pengecekan User)
    if (!currentUser) {
      return (
        <div className="booking-step">
          <div className="login-gate">
            <div className="login-gate-card" style={{ background: '#fff', padding: '40px', borderRadius: '15px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🔒</div>
              <h3>Akses Pembayaran</h3>
              <p style={{ color: '#666', marginBottom: '30px' }}>Silakan login atau daftar akun untuk melanjutkan pemesanan ini.</p>
              <div className="login-gate-actions" style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button className="btn btn-primary" onClick={() => navigate('/auth?mode=login')}>🔐 Login</button>
                <button className="btn btn-secondary" onClick={() => navigate('/auth?mode=register')}>📝 Daftar</button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const selectedCourtData = courts.find(c => c.id === selectedCourt);
    const allBookings = generateRepeatBookings();
    const totalPrice = calculateTotalPrice();

    if (!reservationInfo && step === 3) {
      return (
        <div className="booking-step" style={{ textAlign: 'center', padding: '50px' }}>
          <div className="loader"></div>
          <p>Menyiapkan detail pembayaran...</p>
        </div>
      );
    }

    return (
      <div className="booking-step">
        {/* Timer Alert */}
        <div className="payment-timer-alert" style={{ background: '#fffbeb', border: '1px solid #fef3c7', color: '#92400e', padding: '12px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', fontWeight: 'bold' }}>
          ⚠️ Selesaikan pembayaran dalam: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </div>

        <div className="confirmation-grid">
          {/* KOLOM KIRI: DETAIL PESANAN */}
          <div className="booking-details">
            <div className="details-card">
              <div className="detail-header">
                <h3 style={{ margin: 0, color: '#1a202c' }}>📋 Detail Pesanan</h3>
                <div style={{ marginTop: '10px', color: '#4f46e5', fontWeight: 'bold' }}>
                  {selectedCourtData?.name} — {selectedCourtData?.venue}
                </div>
              </div>

              <div className="detail-info-body">
                <div className="detail-row">
                  <span className="label">Lokasi</span>
                  <span className="value">{selectedCourtData?.location}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Jenis Lapangan</span>
                  <span className="value">{selectedCourtData?.type}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Venue</span>
                  <span className="value">{selectedCourtData?.venue}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Tipe Booking</span>
                  <span className="value">
                    {bookingRepeat === 'none' ? 'Single Session' : 
                    bookingRepeat === 'weekly' ? `Mingguan (${repeatWeeks}x)` : `Bulanan (${repeatMonths}x)`}
                  </span>
                </div>

                <div style={{ marginTop: '20px', fontWeight: '600', fontSize: '0.9rem' }}>
                  📅 Jadwal Terpilih ({allBookings.length} Slot):
                </div>
                
                <div className="time-slots-container">
                  {allBookings.map((slot, index) => (
                    <div key={index} className="slot-pill">
                      <span>
                        {new Date(slot.date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </span>
                      <span className="slot-time-tag">
                        {slot.time}:00 - {parseInt(slot.time) + 1}:00
                      </span>
                    </div>
                  ))}
                </div>

                {/* CATATAN (NOTES) */}
                <div className="notes-section">
                  <label className="label" style={{ fontWeight: '600' }}>📝 Catatan Tambahan (Opsional)</label>
                  <textarea 
                    className="form-textarea" 
                    rows={2}
                    placeholder="Contoh: Tolong siapkan rompi..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: PEMBAYARAN (PUTIH BERSIH) */}
          <div className="payment-section">
            <div className="payment-card">
              <h3 style={{ marginTop: 0, borderBottom: '1px solid #edf2f7', paddingBottom: '10px' }}>💰 Ringkasan Bayar</h3>
              
              <div className="price-summary">
                <div className="detail-row">
                  <span className="label">Harga / Jam</span>
                  <span className="value">Rp {reservationInfo?.totalAmount?.toLocaleString('id-ID') ?? totalPrice?.toLocaleString('id-ID') ?? '0'}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Total Durasi</span>
                  <span className="value">{allBookings.length} Jam</span>
                </div>
                <div style={{ borderTop: '2px solid #f1f5f9', marginTop: '15px', paddingTop: '15px' }} className="detail-row">
                  <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Total Bayar</span>
                  <span style={{ fontSize: '1.2rem', color: '#4f46e5', fontWeight: '800' }}>
                    Rp {reservationInfo?.totalAmount?.toLocaleString('id-ID') ?? totalPrice?.toLocaleString('id-ID') ?? '0'}
                  </span>
                </div>
              </div>

              <div className="payment-methods" style={{ marginTop: '25px' }}>
                <h4 style={{ fontSize: '0.9rem', color: '#718096', textTransform: 'uppercase' }}>Pilih Metode Pembayaran</h4>
                <div className="payment-options">
                  {['BCA Virtual Account', 'BNI Virtual Account', 'Mandiri Virtual Account', 'Gopay', 'QRIS'].map((method) => (
                    <label key={method} className="payment-option">
                      <input type="radio" name="payment" value={method.toLowerCase().replace(' ', '_')} defaultChecked={method === 'QRIS'} />
                      <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{method}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="step-actions" style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
          <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setStep(2)}>
            ← Ubah Waktu
          </button>
          <button 
            className="btn btn-primary" 
            style={{ flex: 2, height: '55px', fontSize: '1.1rem', borderRadius: '10px' }}
            onClick={handlePayment}
            disabled={confirming}
          >
            {confirming ? '⏳ Memproses...' : `Konfirmasi & Bayar Sekarang`}
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