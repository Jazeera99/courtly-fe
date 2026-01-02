// src/pages/PaymentPage.tsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/PaymentPage.css';

interface PaymentPageProps {
  user: any;
}

const PaymentPage: React.FC<PaymentPageProps> = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [paymentData, setPaymentData] = useState<any>(null);
  const [countdown, setCountdown] = useState(300); // 5 menit dalam detik
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success' | 'failed'>('pending');
  
  // Generate QRIS data
  const generateQRISData = () => {
    // Simulasi generate QRIS data
    const transactionId = `TRX-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const amount = paymentData?.totalPrice || 0;
    
    return {
      transactionId,
      amount,
      merchantName: 'Courtly Booking System',
      merchantCity: 'Sidoarjo',
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`https://courtly.app/pay/${transactionId}?amount=${amount}`)}`,
      bankAccounts: [
        { bank: 'BCA', account: '1234567890', name: 'PT Courtly Indonesia' },
        { bank: 'BNI', account: '0987654321', name: 'PT Courtly Indonesia' },
        { bank: 'Mandiri', account: '1122334455', name: 'PT Courtly Indonesia' }
      ],
      expiryTime: new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 menit dari sekarang
    };
  };
  
  const [qrisData, setQrisData] = useState<any>(null);
  
  useEffect(() => {
    // Ambil data dari location state atau localStorage
    let bookingData = location.state?.bookingData || JSON.parse(localStorage.getItem('pendingBooking') || 'null');

    // Jika tidak ada booking data, gunakan dummy data untuk demo
    if (!bookingData) {
      bookingData = {
        selectedDate: new Date().toISOString().split('T')[0],
        selectedCourt: '1',
        selectedTimeSlots: [
          { date: new Date().toISOString().split('T')[0], time: '10:00' },
          { date: new Date().toISOString().split('T')[0], time: '11:00' }
        ],
        totalPrice: 500000,
        courtName: 'Court A - Premium',
        venue: 'Balikpapan Padel Club',
        location: 'Jl. Sudirman No. 123, Balikpapan'
      };
    }

    if (!bookingData && !user) {
      navigate('/booking');
      return;
    }

    setPaymentData(bookingData);
    setQrisData(generateQRISData());
    
    // Start countdown timer
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handlePaymentTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [location.state, user, navigate]);
  
  const handlePaymentTimeout = () => {
    setPaymentStatus('failed');
    alert('Waktu pembayaran telah habis. Silakan memesan ulang.');
    
    // Hapus pending booking
    localStorage.removeItem('pendingBooking');
    sessionStorage.removeItem('pendingBooking');
    
    // Redirect ke halaman booking setelah 3 detik
    setTimeout(() => {
      navigate('/booking');
    }, 3000);
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validasi file (max 5MB, hanya gambar)
      if (file.size > 5 * 1024 * 1024) {
        alert('File terlalu besar. Maksimal 5MB.');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        alert('Hanya file gambar yang diperbolehkan.');
        return;
      }
      
      setPaymentProof(file);
    }
  };
  
  const handleSubmitPayment = async () => {
    if (!paymentProof) {
      alert('Harap upload bukti pembayaran terlebih dahulu.');
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Simulasi upload file
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPaymentStatus('processing');
      
      // Simulasi verifikasi pembayaran
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setPaymentStatus('success');
      
      // Simpan booking ke localStorage
      const bookingRecord = {
        id: qrisData.transactionId,
        courtId: paymentData.selectedCourt,
        date: paymentData.selectedDate,
        time: paymentData.selectedTimeSlots[0]?.time,
        duration: paymentData.selectedTimeSlots.length,
        price: paymentData.totalPrice,
        courtName: paymentData.courtName || 'Lapangan',
        venue: paymentData.venue || 'Venue',
        location: paymentData.location || 'Lokasi',
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentMethod: 'QRIS',
        invoiceNumber: qrisData.transactionId,
        createdAt: new Date().toISOString(),
        canCancelUntil: new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 menit
      };
      
      // Simpan ke localStorage
      const existingBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
      localStorage.setItem('userBookings', JSON.stringify([...existingBookings, bookingRecord]));
      
      // Hapus pending booking
      localStorage.removeItem('pendingBooking');
      sessionStorage.removeItem('pendingBooking');
      
      // Redirect ke halaman bookings
      setTimeout(() => {
        navigate('/my-bookings');
      }, 2000);
      
    } catch (error) {
      setPaymentStatus('failed');
      alert('Gagal mengunggah bukti pembayaran. Silakan coba lagi.');
    } finally {
      setIsUploading(false);
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  if (!paymentData || !qrisData) {
    return (
      <div className="payment-loading">
        <div className="loading-spinner"></div>
        <p>Memuat data pembayaran...</p>
      </div>
    );
  }
  
  return (
    <div className="payment-page">
      <div className="payment-header">
        <h1>💳 Pembayaran QRIS</h1>
        <p>Selesaikan pembayaran dalam waktu {formatTime(countdown)}</p>
        
        <div className={`payment-timer ${countdown < 60 ? 'warning' : ''}`}>
          ⏰ {formatTime(countdown)}
        </div>
      </div>
      
      <div className="payment-container">
        <div className="payment-left">
          <div className="order-summary">
            <h3>📋 Ringkasan Pesanan</h3>
            <div className="summary-card">
              <div className="summary-item">
                <span>ID Transaksi:</span>
                <strong>{qrisData.transactionId}</strong>
              </div>
              <div className="summary-item">
                <span>Total Pembayaran:</span>
                <strong className="total-amount">Rp {paymentData.totalPrice?.toLocaleString() || '0'}</strong>
              </div>
              <div className="summary-item">
                <span>Jumlah Slot:</span>
                <span>{paymentData.selectedTimeSlots?.length || 0} slot</span>
              </div>
              <div className="summary-item">
                <span>Tanggal Booking:</span>
                <span>{new Date(paymentData.selectedDate).toLocaleDateString('id-ID')}</span>
              </div>
            </div>
          </div>
          
          <div className="payment-instructions">
            <h3>📝 Instruksi Pembayaran</h3>
            <ol className="instructions-list">
              <li>Scan kode QR di sebelah kanan menggunakan aplikasi e-wallet atau mobile banking Anda</li>
              <li>Nominal pembayaran sudah terisi otomatis</li>
              <li>Konfirmasi pembayaran di aplikasi Anda</li>
              <li>Ambil screenshot bukti pembayaran</li>
              <li>Upload bukti pembayaran di form bawah</li>
            </ol>
            
            <div className="bank-accounts">
              <h4>🏦 Atau transfer manual ke:</h4>
              {qrisData.bankAccounts.map((account: any, index: number) => (
                <div key={index} className="bank-account">
                  <strong>{account.bank}:</strong> {account.account} a.n {account.name}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="payment-right">
          <div className="qris-section">
            <h3>📱 Scan QRIS</h3>
            <div className="qris-card">
              <img src={qrisData.qrCode} alt="QR Code" className="qris-image" />
              <div className="amount-display">
                Rp {paymentData.totalPrice?.toLocaleString() || '0'}
              </div>
              <p className="scan-instruction">
                Scan dengan aplikasi e-wallet/m-banking
              </p>
            </div>
          </div>
          
          <div className="payment-form">
            <h3>📤 Upload Bukti Pembayaran</h3>
            
            {paymentStatus === 'pending' && (
              <div className="upload-section">
                <label className="upload-label">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="file-input"
                  />
                  <div className="upload-area">
                    <div className="upload-icon">📁</div>
                    <p>Klik untuk upload bukti pembayaran</p>
                    <small>Format: JPG, PNG (max 5MB)</small>
                  </div>
                </label>
                
                {paymentProof && (
                  <div className="file-preview">
                    <div className="preview-info">
                      <span className="file-name">{paymentProof.name}</span>
                      <button 
                        className="remove-file"
                        onClick={() => setPaymentProof(null)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}
                
                <button
                  className={`submit-btn ${!paymentProof ? 'disabled' : ''}`}
                  onClick={handleSubmitPayment}
                  disabled={!paymentProof || isUploading}
                >
                  {isUploading ? 'Mengunggah...' : 'Konfirmasi Pembayaran'}
                </button>
              </div>
            )}
            
            {paymentStatus === 'processing' && (
              <div className="processing-status">
                <div className="processing-spinner"></div>
                <h4>Memverifikasi pembayaran...</h4>
                <p>Harap tunggu beberapa saat</p>
              </div>
            )}
            
            {paymentStatus === 'success' && (
              <div className="success-status">
                <div className="success-icon">✅</div>
                <h4>Pembayaran Berhasil!</h4>
                <p>Anda akan diarahkan ke halaman booking dalam 3 detik...</p>
              </div>
            )}
            
            {paymentStatus === 'failed' && (
              <div className="failed-status">
                <div className="failed-icon">❌</div>
                <h4>Pembayaran Gagal</h4>
                <p>Waktu pembayaran telah habis. Silakan memesan ulang.</p>
                <button 
                  className="retry-btn"
                  onClick={() => navigate('/booking')}
                >
                  Booking Lagi
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="payment-footer">
        <button 
          className="back-btn"
          onClick={() => navigate('/booking')}
        >
          ← Kembali ke Booking
        </button>
        <div className="support-info">
          Butuh bantuan? WhatsApp: 0812-3456-7890
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;