import { GraphQLScalarType, Kind, ValueNode } from 'graphql';
import { useQuery } from '@apollo/client';
import { GET_BOOKING_DATA, GET_AVAILABLE_SLOTS } from '../graphql/queries';
// import { GET_AVAILABLE_SLOTS, GET_BOOKING_DATA } from '../graphql/queries';
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
  availabilityId: string;
  time: string;
  date: string;
  available?: boolean;
  courtId?: string;
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

interface BookedSlot {
  courtId: string;
  date: string;
  start_time: string;
  end_time: string;
}

const BookingPage: React.FC<BookingPageProps> = ({ user: userProp }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedCourt, setSelectedCourt] = useState<string>('');

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
  // const [bookedSlots, setBookedSlots] = useState<TimeSlot[]>([]);
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);
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

  const venueIdFromUrl = searchParams.get('venueId');

  useEffect(() => {
    // Pesan dari App.tsx (setelah login)
    const targetStep = location.state?.goToStep;
    
    if (targetStep) {
      setStep(targetStep); 
    } 
    else if (venueIdFromUrl) {
      setStep(2); // Paksa ke Step 2 jika ada ID Venue di link
    }
  }, [location.state, venueIdFromUrl]);

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
    // Cek Maintenance
    const court = courts.find(c => c.id === courtId);
    if (court?.description?.toLowerCase().includes('maintenance')) return 'MAINTENANCE';

    // Cek Masa Lalu (Waktu sudah lewat)
    if (isTimeInPast(date, time)) return 'PAST';

    // Cek Penuh (Sudah ada di database bookedSlots)
    const isBooked = bookedSlots.some((slot: BookedSlot) => {
      if (slot.courtId !== courtId || slot.date !== date) return false;

      // Ubah jam "17:00" menjadi angka 17 agar bisa dibandingkan
      const currentHour = parseInt(time.split(':')[0]);
      const getHour = (val: string) => {
        if (!val) return 0; // Tambahkan pengaman jika nilai kosong
        if (val.includes('T')) return new Date(val).getUTCHours();
        return parseInt(val.split(':')[0]);
      };

      const startHour = getHour(slot.start_time);
      const endHour = getHour(slot.end_time);
      // const startHour = parseInt(slot.start_time.split(':')[0]);
      // const endHour = parseInt(slot.end_time.split(':')[0]);

      // Jika jam sekarang (misal 18) >= jam mulai (17) DAN jam sekarang < jam selesai (19)
      // Maka jam 17 dan 18 akan otomatis FULL.
      return currentHour >= startHour && currentHour < endHour;
  });
    // const isBooked = bookedSlots.some(
    //   slot => slot.courtId === courtId && slot.time === time && slot.date === date
    // );
    if (isBooked) return 'FULL';

    // Cek Jam Operasional (Contoh: Tutup jam 7 pagi dan 10 malam)
    const hour = parseInt(time);
    if (hour < 7 || hour > 22) return 'UNAVAILABLE';

    return 'AVAILABLE';
  };

  // const getSlotStatus = (courtId: string, time: string, date: string) => {
  //   // Cari data di bookedSlots dari database
  //   const slotData = bookedSlots.find(
  //     slot => slot.courtId === courtId && slot.time === time
  //   );

  //   // LOGIKA STATUS:
  //   // a. Cek Maintenance (Contoh: jika ada flag maintenance di data lapangan)
  //   const court = courts.find(c => c.id === courtId);
  //   if (court?.description?.toLowerCase().includes('maintenance')) {
  //      return 'MAINTENANCE';
  //   }

  //   // b. Cek Masa Lalu
  //   if (isTimeInPast(date, time)) return 'PAST';

  //   // c. Cek Penuh (Sudah dibooking & lunas)
  //   const isBooked = bookedSlots.some(
  //     slot => slot.courtId === courtId && slot.time === time && slot.date === date
  //   );
  //   if (isBooked) return 'FULL';
  //   // if (slotData) {
  //   //    // Di sini Anda bisa kembangkan: if (slotData.paymentStatus === 'paid') ...
  //   //    return 'FULL';
  //   // }

  //   // d. Cek Tidak Tersedia (Misal: Jam operasional 08:00 - 22:00)
  //   const hour = parseInt(time);
  //   if (hour < 7 || hour > 22) { // Contoh jam operasional
  //      return 'UNAVAILABLE';
  //   }

  //   return 'AVAILABLE';
  // };

  // Fallback generator in case backend not available
  // const generateBookedSlots = (courtIds: string[] = ['1','2','3','4']): TimeSlot[] => {
  //   const booked: TimeSlot[] = [];
  //   const courtsToBook = courtIds;
  //   courtsToBook.forEach(courtId => {
  //     const shuffled = [...timeSlots].sort(() => 0.5 - Math.random()).slice(0, 3);
  //     shuffled.forEach(time => {
  //       booked.push({ time, available: false, courtId });
  //     });
  //   });
  //   return booked;
  // };

  const generateBookedSlots = (courtIds: string[] = ['1','2','3','4']): TimeSlot[] => {
    const booked: TimeSlot[] = [];
    
    courtIds.forEach(courtId => {
      const shuffled = [...timeSlots].sort(() => 0.5 - Math.random()).slice(0, 3);
      shuffled.forEach(time => {
        booked.push({ 
          availabilityId: `temp-${courtId}-${time}`, // Tambahkan ID sementara
          time, 
          date: selectedDate, // Tambahkan tanggal
          available: false, 
          courtId 
        });
      });
    });
    return booked;
  };

  const { data: bookingData, loading: loadingCourts, error: courtsError } = useQuery(GET_BOOKING_DATA, {
    variables: { date: selectedDate },
    skip: !selectedDate,
  });

  const { data: slotsData, loading: loadingSlots } = useQuery(GET_AVAILABLE_SLOTS, {
    variables: { 
      fieldId: selectedCourt, 
      date: selectedDate 
    },
    skip: !selectedCourt || !selectedDate,
    fetchPolicy: "network-only"
  });

  const availableSlots = slotsData?.availableSlots || [];

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
      // Cek apakah slot ID ini sudah ada di daftar pilihan
      // const exists = prev.find((s) => s.availabilityId === slot.id);
      
      // if (exists) {
      //   // Jika sudah ada, hapus (unselect)
      //   return prev.filter((s) => s.availabilityId !== slot.id);
      // } else {
      //   // Jika belum ada, tambahkan ke daftar
      //   return [...prev, { 
      //     availabilityId: slot.id, // ID database (BigInt/String)
      //     time: slot.time,
      //     date: selectedDate 
      //   }];
      // }
  // const courtData = data?.fieldDetail; 

  // const toggleTimeSlot = (slot: any) => {
  //   const uniqueId = `${selectedDate}-${slot.start}`;

  //   setSelectedTimeSlots((prev) => {
  //     // Cek apakah slot ini sudah dipilih sebelumnya
  //     const isAlreadySelected = prev.some((s) => s.uniqueId === uniqueId);

  //     if (isAlreadySelected) {
  //       // Jika sudah ada, hapus (unselect)
  //       return prev.filter((s) => s.uniqueId !== uniqueId);
  //     } else {
  //       // Jika belum ada, tambahkan ke daftar pesanan
  //       return [
  //         ...prev,
  //         {
  //           ...slot,
  //           uniqueId, // ID unik untuk UI
  //           date: selectedDate, // Simpan tanggalnya juga!
  //           price: courtData?.price // Simpan harga saat itu
  //         },
  //       ];
  //     }
  //   });
    // const isSelected = selectedTimeSlots.some(s => s.id === slot.id);
    // if (isSelected) {
    //   setSelectedTimeSlots(selectedTimeSlots.filter(s => s.id !== slot.id));
    // } else {
    //   setSelectedTimeSlots([...selectedTimeSlots, slot]);
    // }
  // };
  
  // 1. Ambil data dari query (Gunakan nama yang konsisten, misal: slotsData)

// 2. Definikan courtData SETELAH slotsData ada
// Pakai slotsData karena di atas kamu menamainya slotsData
const courtData = slotsData?.fieldDetail; 



  // Fungsi untuk pilih banyak waktu sekaligus
  const selectMultipleTimeSlots = (startTime: string, endTime: string) => {
    if (!selectedDate || !slotsData) return;

    const startHour = parseInt(startTime.split(':')[0]);
    const endHour = parseInt(endTime.split(':')[0]);
    
    const newSlots = [...selectedTimeSlots];

    for (let hour = startHour; hour < endHour; hour++) {
      const timeString = `${hour.toString().padStart(2, '0')}:00`;

      // 1. CARI DATA ASLI DARI BACKEND untuk jam ini
      const slotFromBackend = slotsData.availableSlots.find(
        (s: any) => s.start === timeString
      );

      // 2. CEK VALIDASI
      // Harus ada di backend, harus tersedia (available), dan belum pernah dipilih
      if (slotFromBackend && slotFromBackend.available) {
        const alreadySelected = newSlots.some(
          (s) => s.availabilityId === slotFromBackend.id
        );

        if (!alreadySelected) {
          // 3. MASUKKAN DATA LENGKAP (Garis orange hilang!)
          newSlots.push({ 
            availabilityId: slotFromBackend.id, 
            time: timeString, 
            date: selectedDate 
          });
        }
      }
    }

    setSelectedTimeSlots(newSlots);
  };
  // const selectMultipleTimeSlots = (startTime: string, endTime: string) => {
  //   if (!selectedDate) return;
  //   const startHour = parseInt(startTime.split(':')[0]);
  //   const endHour = parseInt(endTime.split(':')[0]);
  //   const newSlots = [...selectedTimeSlots];
  //   for (let hour = startHour; hour < endHour; hour++) {
  //     const time = `${hour.toString().padStart(2, '0')}:00`;
  //     const alreadySelected = newSlots.some(
  //       slot => slot.date === selectedDate && slot.time === time
  //     );
  //     const isAvailable = isTimeSlotAvailable(selectedCourt, time);
  //     const isPast = isTimeInPast(selectedDate, time);
  //     if (!alreadySelected && isAvailable && !isPast) {
  //       newSlots.push({ date: selectedDate, time });
  //     }
  //   }
  //   setSelectedTimeSlots(newSlots);
  // };

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

  // Fungsi Kirim Data ke Backend
  const handleConfirmBooking = async () => {
    // CEK DULU DI CONSOLE (PENTING!)
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
      // KIRIM DENGAN STRING CASTING
      const { data } = await createReservationDraft({
        variables: {
          fieldId: String(selectedCourt), 
          // slots: selectedSlots.map(s => ({ 
          //   start: String(s), 
          //   end: String(s) 
          // })),
          slots: selectedTimeSlots.map(s => {
            const startH = parseInt(s.split(':')[0]);
            const endH = startH + 1;
            return {
              start: `${startH.toString().padStart(2, '0')}:00`,
              end: `${endH.toString().padStart(2, '0')}:00`
            };
          }),
          recurring: {
            type: bookingType,
            dates: datesToSend,
            count: datesToSend.length
          }, 
          availabilityIds: selectedTimeSlots
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
  // useEffect(() => {
  //   if (step === 3 && selectedCourt && !reservationInfo) {
  //     handleCreateDraft();
  //   }
  // }, [step]);

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

  const isSlotExpired = (date: string, time: string) => {
  const now = new Date();
  const selected = new Date(date);
  // Asumsi format time adalah "HH:mm" (misal "08:00")
  const [hours, minutes] = time.split(':').map(Number);
  selected.setHours(hours, minutes, 0, 0);
  
  return selected < now;
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
      // --- LOGIKA PENENTU (Satu dan Banyak Tanggal) ---
      // Jika user sedang di tab 'single', maka tanggalnya cuma [selectedDate]
      // Jika user di tab 'weekly', maka tanggalnya adalah array multiDates
      const isSingle = bookingType === 'single';
      const finalDates = isSingle ? [selectedDate] : multiDates;

      // DEBUG: Cek apakah availabilityId benar-benar ada
      console.log("IDs yang dikirim:", selectedTimeSlots.map(slot => slot.availabilityId));

      if (finalDates.length === 0 || !finalDates[0]) {
        alert("Pilih tanggal terlebih dahulu!");
        return;
      }
      console.log("Mencoba membuat draft untuk Lapangan ID:", selectedCourt);

      
      // Jalankan mutasi GraphQL
      const { data } = await createDraft({
        variables: {
          fieldId: String(selectedCourt),
          date: finalDates[0],
          // date: selectedDate,
          availabilityIds: selectedTimeSlots.map(slot => slot.availabilityId),
          slots: selectedTimeSlots.map(slot => {
            const startHour = parseInt(slot.time.split(':')[0]);
            return {
              start: `${startHour.toString().padStart(2, '0')}:00`,
              end: `${(startHour + 1).toString().padStart(2, '0')}:00`
            };
          }),
          recurring: {
            type: isSingle ? 'SINGLE' : 'WEEKLY',
            dates: finalDates,
            count: finalDates.length
            // type: bookingRepeat === 'none' ? 'SINGLE' : 'WEEKLY',
            // dates: bookingType === 'single' ? [selectedDate] : multiDates,
            // count: bookingType === 'single' ? 1 : multiDates.length
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

  // GANTI renderStep2 dengan ini:
// Ganti fungsi renderStep2 dengan ini:
const renderStep2 = () => {
  const selectedCourtData = courts.find((c: any) => c.id === selectedCourt);
  const availableSlots = slotsData?.availableSlots || [];

  return (
    <div className="booking-step">
      {/* HEADER INFORMASI */}
      <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '15px', marginBottom: '20px' }}>
        <h3>📅 Pilih Tanggal & Waktu</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <p style={{ margin: 0, fontWeight: 'bold' }}>Lapangan: <strong>{selectedCourtData?.name}</strong></p>
            <p style={{ margin: '5px 0 0 0', color: '#666' }}>Harga: Rp {selectedCourtData?.price?.toLocaleString()}/jam</p>
          </div>
          
          {/* TOGGLE SINGLE/MULTI DATE */}
          <div style={{ display: 'flex', gap: '10px', background: '#fff', padding: '8px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <button
              onClick={() => { 
                setBookingType('single'); 
                setMultiDates([]);
              }}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: bookingType === 'single' ? '#007bff' : '#f1f5f9',
                color: bookingType === 'single' ? '#fff' : '#64748b',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
            >
              📅 Sekali Pesan
            </button>
            <button
              onClick={() => { 
                setBookingType('weekly');
              }}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: bookingType === 'weekly' ? '#007bff' : '#f1f5f9',
                color: bookingType === 'weekly' ? '#fff' : '#64748b',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
            >
              📆 Berulang
            </button>
          </div>
        </div>
      </div>

      {/* PILIH TANGGAL */}
      <div style={{ marginBottom: '20px' }}>
        {bookingType === 'single' ? (
          <div>
            <h4 style={{ marginBottom: '10px' }}>Pilih Tanggal Main:</h4>
            <input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '12px', 
                borderRadius: '8px', 
                border: '1px solid #ccc',
                fontSize: '16px'
              }}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        ) : (
          <div>
            <h4 style={{ marginBottom: '10px' }}>Pilih Tanggal Berulang (Bisa pilih lebih dari satu):</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
              <input 
                type="date" 
                onChange={(e) => e.target.value && toggleMultiDate(e.target.value)}
                style={{ 
                  padding: '10px', 
                  borderRadius: '8px', 
                  border: '1px solid #ccc',
                  flex: '1',
                  minWidth: '200px'
                }}
                min={new Date().toISOString().split('T')[0]}
              />
              <button
                onClick={() => {
                  const dates = getNext7Days();
                  setMultiDates(dates);
                }}
                style={{
                  padding: '10px 15px',
                  borderRadius: '8px',
                  border: '1px solid #10b981',
                  background: '#f0fdf4',
                  color: '#065f46',
                  cursor: 'pointer'
                }}
              >
                + 7 Hari Kedepan
              </button>
            </div>
            
            {/* DAFTAR TANGGAL TERPILIH */}
            {multiDates.length > 0 && (
              <div style={{ marginTop: '15px' }}>
                <p style={{ marginBottom: '8px', fontWeight: 'bold' }}>
                  Tanggal Terpilih ({multiDates.length}):
                </p>
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '8px',
                  maxHeight: '120px',
                  overflowY: 'auto',
                  padding: '10px',
                  background: '#f8fafc',
                  borderRadius: '8px'
                }}>
                  {multiDates.map(date => (
                    <div 
                      key={date} 
                      style={{ 
                        background: '#007bff', 
                        color: '#fff', 
                        padding: '8px 12px', 
                        borderRadius: '20px', 
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      {new Date(date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}
                      <button 
                        onClick={() => toggleMultiDate(date)} 
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          color: '#fff', 
                          cursor: 'pointer',
                          fontSize: '16px',
                          marginLeft: '5px'
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* PILIH JAM */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ margin: 0 }}>⏰ Slot Jam Tersedia</h3>
          {bookingType === 'single' && selectedDate && (
            <p style={{ margin: 0, color: '#666' }}>
              {new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          )}
        </div>

        {loadingSlots ? (
          <div style={{ textAlign: 'center', padding: '30px' }}>
            <div className="loader"></div>
            <p>Memuat slot waktu tersedia...</p>
          </div>
        ) : availableSlots.length > 0 ? (
          <div>
            {/* RANGE SELECTION BUTTONS */}
            <div style={{ 
              display: 'flex', 
              gap: '10px', 
              flexWrap: 'wrap', 
              marginBottom: '20px',
              padding: '15px',
              background: '#f0f9ff',
              borderRadius: '10px'
            }}>
              <button
                className="range-btn"
                onClick={() => selectMultipleTimeSlots('10:00', '12:00')}
                style={{ padding: '8px 12px', background: '#dbeafe', border: '1px solid #93c5fd', borderRadius: '6px' }}
              >
                10:00 - 12:00 (2 jam)
              </button>
              <button
                className="range-btn"
                onClick={() => selectMultipleTimeSlots('14:00', '17:00')}
                style={{ padding: '8px 12px', background: '#dbeafe', border: '1px solid #93c5fd', borderRadius: '6px' }}
              >
                14:00 - 17:00 (3 jam)
              </button>
              <button
                className="range-btn"
                onClick={() => setSelectedTimeSlots([])}
                style={{ padding: '8px 12px', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '6px' }}
              >
                🔄 Reset Semua
              </button>
            </div>

            {/* GRID SLOT JAM */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', 
              gap: '12px' 
            }}>
              {availableSlots.map((slot: any) => {
                const isFull = !slot.available;
                const isPast = isTimeInPast(bookingType === 'single' ? selectedDate : multiDates[0] || '', slot.start);
                const currentUniqueId = `${bookingType === 'single' ? selectedDate : 'multi'}-${slot.start}`;
                const isSelected = selectedTimeSlots.some(s => s.uniqueId === currentUniqueId);
                const isDisabled = isFull || isPast;

                return (
                  <button
                    key={`${slot.start}-${slot.end}`}
                    disabled={isDisabled}
                    onClick={() => toggleTimeSlot({
                      ...slot,
                      date: bookingType === 'single' ? selectedDate : multiDates[0] || ''
                    })}
                    style={{
                      padding: '15px 10px',
                      borderRadius: '12px',
                      border: isSelected ? '2px solid #007bff' : '1px solid #e2e8f0',
                      backgroundColor: isDisabled ? '#f1f5f9' : (isSelected ? '#007bff' : '#fff'),
                      color: isDisabled ? '#94a3b8' : (isSelected ? '#fff' : '#334155'),
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                      opacity: isDisabled ? 0.5 : 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      transition: 'all 0.2s',
                      position: 'relative'
                    }}
                  >
                    <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{slot.start}</span>
                    <span style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                      {isDisabled ? (isPast ? '⏰ Lewat' : '⛔ Penuh') : '✅ Tersedia'}
                    </span>
                    {!isDisabled && (
                      <span style={{ fontSize: '0.75rem', color: isSelected ? '#fff' : '#16a34a', marginTop: '4px' }}>
                        Rp {selectedCourtData?.price?.toLocaleString()}
                      </span>
                    )}
                    {isSelected && (
                      <div style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        background: '#22c55e',
                        color: 'white',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px'
                      }}>
                        ✓
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '30px', background: '#fef2f2', borderRadius: '10px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>😔</div>
            <p style={{ color: '#dc2626', fontWeight: 'bold' }}>Tidak ada slot tersedia untuk tanggal ini.</p>
            <p style={{ color: '#666', marginBottom: '20px' }}>Coba pilih tanggal lain atau lapangan berbeda.</p>
            <button 
              onClick={() => setStep(1)}
              style={{ padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px' }}
            >
              ← Kembali ke Pilih Lapangan
            </button>
          </div>
        )}
      </div>

      {/* RINGKASAN PESANAN */}
      {selectedTimeSlots.length > 0 && (
        <div style={{ 
          marginTop: '30px', 
          padding: '20px', 
          backgroundColor: '#eef7ff', 
          borderRadius: '15px', 
          border: '1px solid #cfe2ff' 
        }}>
          <h4 style={{ color: '#0056b3', marginBottom: '15px' }}>📋 Ringkasan Pesanan Anda:</h4>
          
          {/* Untuk Single Booking */}
          {bookingType === 'single' && (
            <div style={{ marginBottom: '15px' }}>
              <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Tanggal:</p>
              <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                {new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
          )}
          
          {/* Untuk Multi Date */}
          {bookingType === 'weekly' && multiDates.length > 0 && (
            <div style={{ marginBottom: '15px' }}>
              <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Tanggal Terpilih ({multiDates.length}):</p>
              <div style={{ 
                background: '#fff', 
                padding: '12px', 
                borderRadius: '8px', 
                border: '1px solid #e2e8f0',
                maxHeight: '120px',
                overflowY: 'auto'
              }}>
                {multiDates.map(date => (
                  <div key={date} style={{ padding: '5px 0', borderBottom: '1px solid #f1f5f9' }}>
                    {new Date(date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </div>
                ))}
              </div>
            </div>
          )}

          <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Jam Terpilih ({selectedTimeSlots.length}):</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '15px' }}>
            {selectedTimeSlots.map((item: any, index: number) => (
              <div 
                key={`${item.uniqueId}-${index}`} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  background: '#fff', 
                  padding: '12px', 
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}
              >
                <div>
                  <span style={{ fontWeight: 'bold' }}>⏰ {item.start}</span>
                  {bookingType === 'single' && (
                    <span style={{ marginLeft: '10px', color: '#666' }}>
                      ({new Date(item.date).toLocaleDateString('id-ID', { weekday: 'short' })})
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontWeight: 'bold', color: '#16a34a' }}>
                    Rp {item.price?.toLocaleString()}
                  </span>
                  <button 
                    onClick={() => toggleTimeSlot(item)} 
                    style={{ 
                      border: 'none', 
                      background: 'none', 
                      color: '#dc3545', 
                      cursor: 'pointer',
                      fontSize: '18px',
                      padding: '0 5px'
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ 
            marginTop: '15px', 
            paddingTop: '15px', 
            borderTop: '2px solid #cfe2ff', 
            textAlign: 'right' 
          }}>
            <div style={{ marginBottom: '10px' }}>
              <span style={{ marginRight: '15px' }}>
                Total Jam: <strong>{selectedTimeSlots.length}</strong>
              </span>
              {bookingType === 'weekly' && (
                <span>
                  Total Hari: <strong>{multiDates.length}</strong>
                </span>
              )}
            </div>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
              Total: Rp {calculateTotal().toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* TOMBOL NAVIGASI */}
      <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'space-between', gap: '15px' }}>
        <button 
          onClick={() => setStep(1)}
          className="btn-outline"
          style={{ padding: '12px 25px' }}
        >
          ← Kembali ke Pilih Lapangan
        </button>
        <button 
          disabled={selectedTimeSlots.length === 0 || (bookingType === 'weekly' && multiDates.length === 0)}
          onClick={handleGoToPayment} 
          className="btn-primary"
          style={{ padding: '12px 25px', fontSize: '16px' }}
        >
          {confirming ? '⏳ Memproses...' : `Lanjut Pembayaran →`}
        </button>
      </div>
    </div>
  );
};

// Tambahkan fungsi helper untuk mendapatkan 7 hari ke depan:
// const getNext7Days = () => {
//   const dates = [];
//   const today = new Date();
  
//   for (let i = 0; i < 7; i++) {
//     const nextDate = new Date(today);
//     nextDate.setDate(today.getDate() + i);
//     dates.push(nextDate.toISOString().split('T')[0]);
//   }
  
//   return dates;
// };

// Fungsi untuk toggle/pilih time slot
const toggleTimeSlot = (slot: any) => {
  // Buat ID unik: contoh "2024-05-20-08:00"
  const slotTime = slot.start || slot.time || '';
  const uniqueId = `${slot.date || selectedDate}-${slotTime}`;
  const selectedCourtData = courts.find(c => c.id === selectedCourt);
  const currentPrice = slot.price || (selectedCourtData?.price || courtData?.price || courtData?.pricePerHour || 0);

  // Ambil ID dengan mencoba beberapa kemungkinan nama field dari backend
  const aId = slot.id || slot.availabilityId || slot._id;

  setSelectedTimeSlots((prev) => {
    // Cek apakah slot di tanggal dan jam ini sudah ada di keranjang
    const isAlreadySelected = prev.some((s) => s.uniqueId === uniqueId);

    if (isAlreadySelected) {
      // Jika sudah ada, hapus dari pilihan (unselect)
      return prev.filter((s) => s.uniqueId !== uniqueId);
    } else {
      // Jika belum ada, tambahkan ke pilihan
      return [
        ...prev,
        {
          ...slot,
          uniqueId,           // ID Unik untuk identifikasi
          date: slot.date || selectedDate, // Simpan tanggalnya!
          availabilityId: aId,
          price: currentPrice || 0, // Simpan harga lapangan ini
          start: slotTime,
          time: slotTime,
          courtName: slot.courtName || selectedCourtData?.name || courtData?.name
        },
      ];
    }
  });
};

// FIX: Perbaiki fungsi calculateTotal
const calculateTotal = () => {
  // Pastikan semua item memiliki price
  const validSlots = selectedTimeSlots.filter(slot => slot.price > 0);
  
  // Hitung total berdasarkan tipe booking
  const totalHoursPrice = validSlots.reduce((acc, curr) => acc + (curr.price || 0), 0);
  
  if (bookingType === 'single') {
    return totalHoursPrice;
  } else {
    // Untuk multi-date, kalikan dengan jumlah tanggal
    return totalHoursPrice * multiDates.length;
  }
};

// FIX: Perbaiki fungsi handleGoToPayment untuk menghindari error split
// const handleGoToPayment = async () => {
//   console.log("handleGoToPayment dipanggil");
  
//   const latestUser = userProp || JSON.parse(localStorage.getItem('user') || 'null');
  
//   // Cek login
//   if (!latestUser?.id) {
//     const pendingData = {
//       selectedCourt,
//       selectedDate: bookingType === 'single' ? selectedDate : multiDates[0] || selectedDate,
//       selectedTimeSlots,
//       bookingRepeat: bookingType === 'single' ? 'none' : 'weekly',
//       bookingType,
//       multiDates,
//     };
    
//     sessionStorage.setItem('pendingBooking', JSON.stringify(pendingData));
//     alert("Silakan login terlebih dahulu untuk melanjutkan pembayaran.");
//     navigate('/auth?mode=login&redirect=/booking');
//     return;
//   }

//   // Validasi
//   if (!selectedCourt) {
//     alert("Pilih lapangan terlebih dahulu!");
//     return;
//   }

//   if (selectedTimeSlots.length === 0) {
//     alert("Pilih jam terlebih dahulu!");
//     return;
//   }

//   if (bookingType === 'weekly' && multiDates.length === 0) {
//     alert("Pilih minimal satu tanggal untuk booking berulang!");
//     return;
//   }

//   try {
//     // Tentukan tanggal berdasarkan tipe booking
//     const finalDates = bookingType === 'single' ? [selectedDate] : multiDates;
    
//     // Format slots untuk backend - FIX: Hindari error split
//     const formattedSlots = selectedTimeSlots.map(slot => {
//       // FIX: Gunakan start bukan time, dan pastikan ada nilai
//       const slotTime = slot.start || slot.time || '00:00';
//       const startHour = parseInt(slotTime.split(':')[0] || '0');
//       const endHour = startHour + 1;
      
//       return {
//         start: `${startHour.toString().padStart(2, '0')}:00`,
//         end: `${endHour.toString().padStart(2, '0')}:00`
//       };
//     });

    // Dapatkan availabilityIds dari slot yang dipilih
//     const availabilityIds = selectedTimeSlots
//       .map(slot => slot.availabilityId || slot.id)
//       .filter(id => id && id !== 'undefined');

//     console.log("Mengirim data ke backend:", {
//       fieldId: selectedCourt,
//       date: finalDates[0],
//       slots: formattedSlots,
//       availabilityIds,
//       recurring: {
//         type: bookingType === 'single' ? 'SINGLE' : 'WEEKLY',
//         dates: finalDates,
//         count: finalDates.length
//       }
//     });

//     // Panggil mutation
//     const { data } = await createDraft({
//       variables: {
//         fieldId: String(selectedCourt),
//         date: finalDates[0],
//         slots: formattedSlots,
//         availabilityIds: availabilityIds.length > 0 ? availabilityIds : ['temp-id'],
//         recurring: {
//           type: bookingType === 'single' ? 'SINGLE' : 'WEEKLY',
//           dates: finalDates,
//           count: finalDates.length
//         }
//       }
//     });

//     if (data?.createReservationDraft?.reservationId) {
//       setReservationInfo(data.createReservationDraft);
//       setStep(3);
//     } else {
//       throw new Error("Gagal membuat draft reservasi.");
//     }
//   } catch (err: any) {
//     console.error("Error dari Server:", err);
    
//     // Tampilkan pesan error yang lebih spesifik
//     if (err.message.includes("slot yang Anda pilih baru saja dipesan")) {
//       alert("⚠️ Slot waktu yang Anda pilih baru saja dipesan orang lain. Silakan pilih slot lain.");
//       // Refresh slot dengan memanggil ulang query
//       // Anda bisa menambahkan refetch di sini
//     } else if (err.message.includes("split")) {
//       alert("Error: Format waktu tidak valid. Silakan refresh halaman dan coba lagi.");
//     } else {
//       alert("Gagal: " + (err.graphQLErrors?.[0]?.message || err.message));
//     }
    
//     // Kembali ke step 2 untuk memilih ulang
//     setStep(2);
//   }
// };

// Tambahkan fungsi getNext7Days jika belum ada
const getNext7Days = () => {
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + i);
    dates.push(nextDate.toISOString().split('T')[0]);
  }
  
  return dates;
};

// Tambahkan CSS animation jika belum ada
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

  // // Step 2: Pilih Waktu dengan Multi Selection
  // const renderStep2 = () => {
  //   const selectedCourtData = courts.find(c => c.id === selectedCourt);
  //   const allBookings = generateRepeatBookings();

  //   return (
  //     <div className="booking-step">
  //       <div className="time-selection-header">
  //         <h2 className="time-selection-title">🕐 Pilih Waktu Booking</h2>
          
  //         <div className="repeat-booking-section">
  //         {/* --- TOMBOL NAVIGASI TIPE (BIRU JIKA AKTIF) --- */}
  //         <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center' }}>
  //           <button
  //             onClick={() => { setBookingType('single'); setMultiDates([]); }}
  //             style={{
  //               padding: '10px 20px', borderRadius: '20px', border: '1px solid #007bff', cursor: 'pointer',
  //               backgroundColor: bookingType === 'single' ? '#007bff' : '#fff',
  //               color: bookingType === 'single' ? '#fff' : '#007bff',
  //               fontWeight: 'bold'
  //             }}
  //           >
  //             🚫 Sekali Pesan
  //           </button>
  //           <button
  //             onClick={() => { setBookingType('weekly'); setMultiDates([]); }}
  //             style={{
  //               padding: '10px 20px', borderRadius: '20px', border: '1px solid #007bff', cursor: 'pointer',
  //               backgroundColor: bookingType === 'weekly' ? '#007bff' : '#fff',
  //               color: bookingType === 'weekly' ? '#fff' : '#007bff',
  //               fontWeight: 'bold'
  //             }}
  //           >
  //             📅 Pesanan Berulang
  //           </button>
            
  //         </div>

  //         <div className="booking-card" style={{ padding: '20px', border: '1px solid #eee', borderRadius: '15px' }}>
            
  //           {/* --- KONDISI 1: SEKALI PESAN --- */}
  //           {bookingType === 'single' && (
  //             <div className="single-ui">
  //               <h4 style={{ color: '#333' }}>📅 Pilih Tanggal Main</h4>
  //               <input 
  //                 type="date" 
  //                 value={selectedDate} 
  //                 onChange={(e) => setSelectedDate(e.target.value)}
  //                 style={{ width: '100%', padding: '10px', marginTop: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
  //               />
  //             </div>
  //           )}

  //           {/* --- KONDISI 2: MINGGUAN --- */}
  //           {bookingType === 'weekly' && (
  //             <div className="weekly-ui">
  //               <h4 style={{ color: '#007bff' }}>🚀 Paket Bebas</h4>
                
  //               <p><small>Pilih hari apa saja dalam seminggu:</small></p>
  //               <input 
  //                 type="date" 
  //                 onChange={(e) => e.target.value && toggleMultiDate(e.target.value)}
  //                 style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
  //               />
  //             </div>
  //           )}

  //       {/* --- TAGS TANGGAL (Hanya muncul jika bukan Single) --- */}
  //       {bookingType !== 'single' && (
  //         <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '15px' }}>
  //           {multiDates.map(d => (
  //             <div key={d} style={{ background: '#007bff', color: '#fff', padding: '5px 12px', borderRadius: '20px', fontSize: '12px' }}>
  //               {d} <span onClick={() => toggleMultiDate(d)} style={{ cursor: 'pointer', marginLeft: '5px' }}>×</span>
  //             </div>
  //           ))}
  //         </div>
  //       )}
  //         </div>
  //       </div>


  //       {/* Render Time Slots di bawahnya (berlaku untuk semua tanggal yang dipilih) */}
  //       <div className="time-slots-section" style={{ marginTop: '20px' }}>
  //         <h3>PILIH WAKTU DURASI SEWA</h3>
  //         {/* <p><small>*Jam yang dipilih akan diterapkan ke semua tanggal di atas</small></p> */}
  //         {/* ... (Gunakan logika rendering slots yang sudah ada di file kamu) ... */}
  //       </div>
          
  //         <div className="booking-summary-large">
  //           <div className="summary-item-large">
  //             <span className="summary-label">Lapangan:</span>
  //             <span className="summary-value">{selectedCourtData?.name}</span>
  //           </div>
  //           <div className="summary-item-large">
  //             <span className="summary-label">Tanggal:</span>
  //             <span className="summary-value">
  //               {new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
  //             </span>
  //           </div>
  //           <div className="summary-item-large">
  //             <span className="summary-label">Harga per jam:</span>
  //             <span className="summary-value price">Rp {selectedCourtData?.price.toLocaleString()}</span>
  //           </div>
  //           <div className="summary-item-large">
  //             <span className="summary-label">Slot dipilih:</span>
  //             <span className="summary-value">{selectedTimeSlots.length} slot</span>
  //           </div>
  //         </div>
          
  //         {/* <div className="time-range-selection">
  //           <h4>⏳ Pilih Rentang Waktu (Opsional)</h4>
  //           <div className="range-selection-buttons">
  //             <button 
  //               className="range-btn"
  //               onClick={() => selectMultipleTimeSlots('10:00', '12:00')}
  //             >
  //               10:00 - 12:00 (2 jam)
  //             </button>
  //             <button 
  //               className="range-btn"
  //               onClick={() => selectMultipleTimeSlots('14:00', '17:00')}
  //             >
  //               14:00 - 17:00 (3 jam)
  //             </button>
  //             <button 
  //               className="range-btn"
  //               onClick={() => selectMultipleTimeSlots('18:00', '21:00')}
  //             >
  //               18:00 - 21:00 (3 jam)
  //             </button>
  //             <button 
  //               className="range-btn"
  //               onClick={() => setSelectedTimeSlots([])}
  //             >
  //               🔄 Reset Semua Pilihan
  //             </button>
  //           </div>
  //         </div>
  //          */}

  //         {/* {selectedTimeSlots.length > 0 && (
  //           <div className="selected-slots-preview">
  //             <h4>✅ Slot Waktu Dipilih ({selectedTimeSlots.length} slot):</h4>
  //             <div className="selected-slots-list">
  //               {selectedTimeSlots.map((slot, index) => (
  //                 <div key={index} className="selected-slot-badge">
  //                   {slot.time}:00 - {parseInt(slot.time) + 1}:00
  //                   <button 
  //                     className="remove-slot-btn"
  //                     onClick={() => {
  //                       const newSlots = [...selectedTimeSlots];
  //                       newSlots.splice(index, 1);
  //                       setSelectedTimeSlots(newSlots);
  //                     }}
  //                   >
  //                     ✕
  //                   </button>
  //                 </div>
  //               ))}
  //             </div>
  //           </div>
  //         )}
  //       </div>

  //       <div className="time-slots-section">
  //         <h3 className="time-slots-title">⏰ Slot Waktu Tersedia (Klik untuk pilih lebih dari satu)</h3>
  //         <p className="time-slots-subtitle">Tips: Klik tombol rentang waktu di atas untuk memilih beberapa jam sekaligus</p>
          
  //         <div className="time-slots-grid-ordered">
  //            {loadingSlots ? (
  //               <p>Memuat jadwal...</p>
  //             ) : (
  //               // Gunakan data dari backend (slotsData) bukan array lokal lagi
  //               slotsData?.availableSlots.map((slot: any) => {
                  
  //                 const isFull = !slot.available; // Dari DB: is_booked = true maka available = false
  //                 const isSelected = selectedTimeSlots.some(s => s.availabilityId === slot.id);
                  
  //                 let label = "✅ Tersedia";
  //                 let btnClass = "";
                  
  //                 if (isFull) {
  //                   label = "⛔ Penuh";
  //                   btnClass = "booked";
  //                 }

  //                 return (
  //                   <button
  //                     key={slot.id}
  //                     // Tombol mati jika Penuh
  //                     disabled={isFull} 
  //                     className={`time-slot-btn-large ${isSelected ? 'selected' : ''} ${btnClass}`}
  //                     onClick={() => {
  //                       // Kita simpan ID dari database agar saat checkout backend tahu mana yang mau dikunci
  //                       toggleTimeSlot({
  //                         id: slot.id,
  //                         time: slot.start,
  //                         end: slot.end
  //                       });
  //                     }}
  //                   >
  //                     <div className="time-range-large">{slot.start} - {slot.end}</div>
  //                     <div className="time-status-large">{label}</div>

  //                     {!isFull && (
  //                       <div className="time-price-large">
  //                         Rp {selectedCourtData?.price.toLocaleString()}
  //                       </div>
  //                     )}

  //                     {isSelected && <div className="selected-checkmark">✓</div>}
  //                   </button>
  //                 );
  //               })
  //             )}
  //         </div>
  //       </div>

  //       {/* Navigasi Tipe Booking */}
  //         {/* <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center' }}>
  //           <button
  //             onClick={() => { setBookingType('single'); setMultiDates([]); }}
  //             style={{ padding: '10px 20px', borderRadius: '20px', cursor: 'pointer', backgroundColor: bookingType === 'single' ? '#007bff' : '#fff', color: bookingType === 'single' ? '#fff' : '#007bff', border: '1px solid #007bff' }}
  //           >
  //             🚫 Sekali Pesan
  //           </button>
  //           <button
  //             onClick={() => { setBookingType('weekly'); setMultiDates([]); }}
  //             style={{ padding: '10px 20px', borderRadius: '20px', cursor: 'pointer', backgroundColor: bookingType === 'weekly' ? '#007bff' : '#fff', color: bookingType === 'weekly' ? '#fff' : '#007bff', border: '1px solid #007bff' }}
  //           >
  //             📅 Pesanan Berulang
  //           </button>
  //         </div> */}

  //         {/* <div className="booking-card" style={{ padding: '20px', border: '1px solid #eee', borderRadius: '15px' }}>
  //           <h4 style={{ color: '#333' }}>📅 Pilih Tanggal Main</h4>
  //           <input 
  //             type="date" 
  //             value={selectedDate} 
  //             onChange={(e) => setSelectedDate(e.target.value)}
  //             style={{ width: '100%', padding: '10px', marginTop: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
  //           />
  //         </div> */}
  //       </div>

  //       <div className="time-slots-section">
  //       <h3 className="time-slots-title">⏰ Slot Waktu Tersedia</h3>
  //       <div className="time-slots-grid-ordered">
  //         {loadingSlots ? (
  //           <p>⏳ Memuat jadwal...</p>
  //         ) : (
  //           // Jaring pengaman: Menggunakan data dari database
  //           (slotsData?.availableSlots || slotsData?.fields)?.map((slot: any) => {
  //             const isFull = !slot.available; 
  //             const isSelected = selectedTimeSlots.some(s => s.id === slot.id);
              
  //             return (
  //               <button
  //                 key={slot.id}
  //                 disabled={isFull} 
  //                 className={`time-slot-btn-large ${isSelected ? 'selected' : ''} ${isFull ? 'booked' : ''}`}
  //                 onClick={() => toggleTimeSlot({ id: slot.id, time: slot.start, end: slot.end })}
  //                 style={{
  //                   opacity: isFull ? 0.3 : 1, // TRANSPARANSI: 0.3 artinya pudar/redup
  //                   cursor: isFull ? 'not-allowed' : 'pointer',
  //                 }}
  //               >
  //                 <div className="time-range-large">{slot.start} - {slot.end}</div>
  //                 <div className="time-status-large">{isFull ? "⛔ Penuh" : "✅ Tersedia"}</div>
  //                 {!isFull && <div className="time-price-large">Rp {selectedCourtData?.price.toLocaleString()}</div>}
  //               </button>
  //             );
  //           })
  //         )}
  //       </div>
  //     </div>

  //     <div className="step-actions" style={{ marginTop: '20px' }}>
  //       <button className="btn btn-outline" onClick={() => setStep(1)}>← Kembali</button>
  //       <button 
  //         className="btn btn-primary" 
  //         disabled={selectedTimeSlots.length === 0}
  //         onClick={handleGoToPayment}
  //       >
  //         Lanjut ke Pembayaran ({selectedTimeSlots.length} slot) →
  //       </button>
  //     </div>
  //     </div>
  //   );
  // };

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
  //       / / Ini akan membuka halaman pembayaran resmi (Gopay/QRIS/Bank)
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

                {/* <div style={{ marginTop: '20px', fontWeight: '600', fontSize: '0.9rem' }}>
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
                </div> */}

                <div className="time-slots-container">
                  {(reservationInfo as any)?.timeSlots?.dates?.map((tgl: string, index: number) => (
                    <div key={index} className="slot-pill" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', background: '#f8fafc', padding: '10px', borderRadius: '8px', alignItems: 'center' }}>
                      <span style={{ fontWeight: 'bold' }}>
                        {new Date(tgl).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </span>
                      
                      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                        {/* Kita ambil jam dari reservationInfo.timeSlots.hours */}
                        {(reservationInfo as any)?.timeSlots?.hours?.map((slot: any, idx: number) => (
                          <span key={idx} className="slot-time-tag" style={{ background: '#4f46e5', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>
                            {/* slice(0, 5) untuk membuang :00 (detik) */}
                            {slot.start.slice(0, 5)} - {slot.end.slice(0, 5)}
                          </span>
                        ))}
                      </div>
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
                <div style={{ marginTop: '15px', padding: '10px', background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '8px' }}>
                  <p style={{ margin: 0, fontSize: '12px', color: '#92400e', lineHeight: '1.5' }}>
                    <strong>⚠️ Catatan Durasi:</strong><br />
                    Waktu sewa efektif adalah <strong>50 menit</strong> per jam. 10 menit terakhir digunakan untuk pergantian pemain dan sterilisasi lapangan agar jadwal berikutnya tepat waktu.
                  </p>
                </div>
              </div>

              {/* <div className="payment-methods" style={{ marginTop: '25px' }}>
                <h4 style={{ fontSize: '0.9rem', color: '#718096', textTransform: 'uppercase' }}>Pilih Metode Pembayaran</h4>
                <div className="payment-options">
                  {['BCA Virtual Account', 'BNI Virtual Account', 'Mandiri Virtual Account', 'Gopay', 'QRIS'].map((method) => (
                    <label key={method} className="payment-option">
                      <input type="radio" name="payment" value={method.toLowerCase().replace(' ', '_')} defaultChecked={method === 'QRIS'} />
                      <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{method}</span>
                    </label>
                  ))}
                </div>
              </div> */}
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