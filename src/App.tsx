import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import BookingPage from './pages/BookingPage';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';
import VenueDetailPage from './pages/VenueDetailPage';
import MyBookingsPage from './pages/MyBookingsPage';
import './App.css';
import { ToastProvider } from './components/Toast';

// Import Layouts
import AdminLayout from './layouts/AdminLayout';
import MitraLayout from './layouts/MitraLayout';

// Import Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminVenues from './pages/admin/Venues';
import AdminBookings from './pages/admin/Bookings';
import AdminReports from './pages/admin/Reports';
import AdminSettings from './pages/admin/Settings';

// Import Mitra Pages
import MitraDashboard from './pages/mitra/Dashboard';
import MitraBookings from './pages/mitra/Bookings';
import MitraCourts from './pages/mitra/Courts';
import MitraSchedule from './pages/mitra/Schedule';
import MitraRevenue from './pages/mitra/Revenue';
import MitraProfile from './pages/mitra/Profile';

type UserRole = 'guest' | 'penyewa' | 'mitra' | 'admin';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  permissions?: string[];
  venueId?: string;
  venueName?: string;
}

function App() {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>('guest');
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  // Load user from localStorage on initial render
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setUserRole(parsedUser.role || 'user'); 
    }
  }, []);

  const handleLogin = (userData: any) => {
    const userObj: User = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      phone: userData.phone,
      permissions: userData.permissions,
      venueId: userData.venueId,
      venueName: userData.venueName
    };
    setUser(userObj);
    setUserRole(userData.role || 'user');

    // 2. Simpan ke LocalStorage (Agar kalau refresh tidak hilang)
    localStorage.setItem('user', JSON.stringify(userObj));
    // Simpan token juga jika ada di userData
    if (userData.token) {
      localStorage.setItem('token', userData.token);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/auth?mode=login');
  }; 

  const handleAuthSuccess = (userData: any) => {
    handleLogin(userData);

    // Try to restore any pending booking saved in localStorage or sessionStorage
    const pending = localStorage.getItem('pendingBooking') || sessionStorage.getItem('pendingBooking');
    if (pending && userData?.role === 'user') {
      try {
        const bookingData = JSON.parse(pending);
        setTimeout(() => {
          navigate('/booking', {
            state: {
              restoreBooking: true,
              bookingData
            }
          });
          // cleanup
          localStorage.removeItem('pendingBooking');
          sessionStorage.removeItem('pendingBooking');
        }, 500);
        return;
      } catch (e) {
        console.warn('Failed parsing pending booking:', e);
      }
    }

    // Default redirect after auth
    navigate('/profile');
  };

  // Protected Route Component untuk halaman dengan Header
  const ProtectedRoute = ({ children, allowedRoles }: { 
    children: React.ReactNode, 
    allowedRoles: UserRole[] 
  }) => {
    if (!user || !allowedRoles.includes(user.role)) {
      return <Navigate to="/auth?mode=login" replace />;
    }
    return children;
  };

  // Layout Route untuk Admin (tanpa Header global)
  const AdminLayoutRoute = ({ children }: { children: React.ReactNode }) => {
    if (!user || user.role !== 'admin') {
      return <Navigate to="/auth?mode=login" replace />;
    }
    return children;
  };

  // Layout Route untuk Mitra (tanpa Header global)
  const MitraLayoutRoute = ({ children }: { children: React.ReactNode }) => {
    if (!user || user.role !== 'mitra') {
      return <Navigate to="/auth?mode=login" replace />;
    }
    return children;
  };

  return (
    <ToastProvider>
      <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
        {/* Header hanya untuk route public */}
        <Routes>
          <Route path="/admin/*" element={null} />
          <Route path="/partner/*" element={null} />
          <Route 
            path="*" 
            element={
              <Header
                userRole={user?.role || 'guest'}
                darkMode={darkMode}
                onToggleDarkMode={() => setDarkMode(!darkMode)}
                onLogout={handleLogout}
                user={user}
              />
            } 
          />
        </Routes>

      <main className="main-content">
          <Routes>
            {/* Public Routes (dengan Header) */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/booking" element={<BookingPage user={user} />} />
            
            {/* MyBookingsPage - PERHATIAN: Pastikan path ini benar */}
            <Route path="/my-bookings" element={
              <ProtectedRoute allowedRoles={['penyewa']}>
                <MyBookingsPage />
              </ProtectedRoute>
            } />
            
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute allowedRoles={['penyewa', 'mitra', 'admin']}>
                  <ProfilePage user={user} />
                  
                </ProtectedRoute>
              } 
            />
            <Route path="/auth" element={<AuthPage onSuccess={handleAuthSuccess} />} />
            <Route path="/venue/:id" element={<VenueDetailPage />} />
            
            {/* Admin Routes dengan Layout Khusus (tanpa Header global) */}
            <Route 
              path="/admin/*" 
              element={
                <AdminLayoutRoute>
                  <AdminLayout />
                </AdminLayoutRoute>
              } 
            >
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="venues" element={<AdminVenues />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
            
            {/* Mitra/Partner Routes dengan Layout Khusus (tanpa Header global) */}
            <Route 
              path="/partner/*" 
              element={
                <MitraLayoutRoute>
                  <MitraLayout />
                </MitraLayoutRoute>
              } 
            >
              <Route index element={<MitraDashboard />} />
              <Route path="dashboard" element={<MitraDashboard />} />
              <Route path="bookings" element={<MitraBookings />} />
              <Route path="courts" element={<MitraCourts />} />
              <Route path="schedule" element={<MitraSchedule />} />
              <Route path="revenue" element={<MitraRevenue />} />
              <Route path="profile" element={<MitraProfile />} />
            </Route>
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </ToastProvider>
  );
}

export default App;