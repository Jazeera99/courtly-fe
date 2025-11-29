// src/App.tsx
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import BookingPage from './pages/BookingPage';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';
import VenueDetailPage from './pages/VenueDetailPage';
import './App.css';

type UserRole = 'guest' | 'user' | 'vendor' | 'admin';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogin = (userData: any) => {
    setUser({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      phone: userData.phone
    });
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleAuthSuccess = (userData: any) => {
    handleLogin(userData);
    // Redirect ke halaman profile setelah login/register sukses
    window.location.href = '/profile';
  };

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      <Header
        userRole={user?.role || 'guest'}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onLogin={handleLogin}
        onLogout={handleLogout}
        user={user}
      />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/profile" element={<ProfilePage user={user} />} />
          <Route path="/auth" element={<AuthPage onSuccess={handleAuthSuccess} />} />
          <Route path="/venue/:id" element={<VenueDetailPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;