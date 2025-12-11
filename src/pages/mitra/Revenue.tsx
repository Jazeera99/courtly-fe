// src/pages/mitra/Revenue.tsx
import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Download, Calendar, Filter } from 'lucide-react';
import '../../styles/PartnerDashboard.css';

const MitraRevenue: React.FC = () => {
  const [timeRange, setTimeRange] = useState('month');
  
  const revenueData = {
    totalRevenue: 42500000,
    totalBookings: 124,
    averagePrice: 342741,
    growth: 15.2
  };

  const monthlyRevenue = [
    { month: 'Jan', revenue: 38500000, bookings: 112, growth: 12 },
    { month: 'Feb', revenue: 42500000, bookings: 124, growth: 15.2 },
    { month: 'Mar', revenue: 39800000, bookings: 118, growth: 8.5 },
    { month: 'Apr', revenue: 41000000, bookings: 120, growth: 10.3 },
    { month: 'May', revenue: 39500000, bookings: 116, growth: 7.8 },
    { month: 'Jun', revenue: 43000000, bookings: 128, growth: 18.2 },
  ];

  const topCourts = [
    { name: 'Lapangan Futsal 1', revenue: 12500000, bookings: 45, percentage: 29.4 },
    { name: 'Lapangan Futsal 2', revenue: 11500000, bookings: 42, percentage: 27.1 },
    { name: 'Lapangan Badminton A', revenue: 8500000, bookings: 32, percentage: 20.0 },
    { name: 'Lapangan Basket', revenue: 7000000, bookings: 28, percentage: 16.5 },
    { name: 'Lapangan Badminton B', revenue: 3000000, bookings: 15, percentage: 7.1 },
  ];

  const recentTransactions = [
    { id: 1, customer: 'John Doe', court: 'Lapangan Futsal 1', date: '2024-02-15', amount: 150000, method: 'Transfer' },
    { id: 2, customer: 'Jane Smith', court: 'Lapangan Badminton A', date: '2024-02-15', amount: 80000, method: 'Cash' },
    { id: 3, customer: 'Bob Johnson', court: 'Lapangan Basket', date: '2024-02-14', amount: 240000, method: 'QRIS' },
    { id: 4, customer: 'Alice Brown', court: 'Lapangan Futsal 2', date: '2024-02-14', amount: 150000, method: 'Transfer' },
    { id: 5, customer: 'Charlie Wilson', court: 'Lapangan Badminton B', date: '2024-02-13', amount: 80000, method: 'Cash' },
  ];

  return (
    <div className="mitra-page fullscreen-content">
      <div className="page-content">
        <div className="page-header">
          <h1>💰 Pendapatan & Laporan</h1>
          <p>Analisis pendapatan dan kinerja bisnis Anda</p>
        </div>

        {/* Time Range Selector */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['day', 'week', 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: timeRange === range ? '#3b82f6' : '#f3f4f6',
                  color: timeRange === range ? 'white' : '#6b7280',
                  cursor: 'pointer',
                  fontWeight: timeRange === range ? '600' : '400',
                  fontSize: '0.95rem',
                  transition: 'all 0.2s'
                }}
              >
                {range === 'day' ? 'Hari Ini' : 
                 range === 'week' ? 'Minggu Ini' : 
                 range === 'month' ? 'Bulan Ini' : 'Tahun Ini'}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} />
              Pilih Tanggal
            </button>
            <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={18} />
              Filter
            </button>
            <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Download size={18} />
              Export Laporan
            </button>
          </div>
        </div>

        {/* Revenue Overview Cards */}
        <div className="grid-4" style={{ marginBottom: '32px' }}>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '8px' }}>Total Pendapatan</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1f2937' }}>
                  Rp {revenueData.totalRevenue.toLocaleString()}
                </div>
              </div>
              <div style={{
                backgroundColor: '#d1fae5',
                color: '#065f46',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <TrendingUp size={14} />
                +{revenueData.growth}%
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '8px' }}>Total Booking</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1f2937' }}>
                  {revenueData.totalBookings}
                </div>
              </div>
              <div style={{
                backgroundColor: '#d1fae5',
                color: '#065f46',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <TrendingUp size={14} />
                +8.5%
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
          }}>
            <div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '8px' }}>Rata-rata Harga</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1f2937' }}>
                Rp {revenueData.averagePrice.toLocaleString()}
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '8px' }}>Pendapatan/Hari</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1f2937' }}>
                  Rp {Math.round(revenueData.totalRevenue / 30).toLocaleString()}
                </div>
              </div>
              <div style={{
                backgroundColor: '#fee2e2',
                color: '#991b1b',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <TrendingDown size={14} />
                -2.1%
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Detailed Data */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', marginBottom: '32px' }}>
          {/* Revenue Chart (Placeholder) */}
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>Trend Pendapatan Bulanan</h3>
              <select style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontSize: '0.875rem'
              }}>
                <option>6 Bulan Terakhir</option>
                <option>1 Tahun Terakhir</option>
              </select>
            </div>
            
            {/* Simple Bar Chart Placeholder */}
            <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', gap: '24px', padding: '20px 0' }}>
              {monthlyRevenue.map((item) => (
                <div key={item.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div
                    style={{
                      width: '40px',
                      height: `${(item.revenue / 50000000) * 250}px`,
                      background: 'linear-gradient(to top, #3b82f6, #60a5fa)',
                      borderRadius: '6px',
                      marginBottom: '8px'
                    }}
                  />
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{item.month}</div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '4px' }}>
                    Rp {(item.revenue / 1000000).toFixed(0)}jt
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performing Courts */}
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '24px' }}>
              Lapangan Terpopuler
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {topCourts.map((court, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px'
                }}>
                  <div>
                    <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>{court.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{court.bookings} booking</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                      Rp {court.revenue.toLocaleString()}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#3b82f6',
                      fontWeight: '500'
                    }}>
                      {court.percentage}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '24px' }}>
            Transaksi Terbaru
          </h3>

          <div className="data-table">
            <div className="table-header" style={{
              gridTemplateColumns: '80px 180px 180px 120px 120px 120px 100px'
            }}>
              <div>ID</div>
              <div>Pelanggan</div>
              <div>Lapangan</div>
              <div>Tanggal</div>
              <div>Jumlah</div>
              <div>Metode</div>
              <div>Status</div>
            </div>

            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="table-row" style={{
                gridTemplateColumns: '80px 180px 180px 120px 120px 120px 100px'
              }}>
                <div className="table-cell">#{transaction.id}</div>
                <div className="table-cell primary">{transaction.customer}</div>
                <div className="table-cell">{transaction.court}</div>
                <div className="table-cell">{transaction.date}</div>
                <div className="table-cell primary" style={{ fontWeight: '600' }}>
                  Rp {transaction.amount.toLocaleString()}
                </div>
                <div className="table-cell">
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    backgroundColor: transaction.method === 'Transfer' ? '#dbeafe' :
                                     transaction.method === 'QRIS' ? '#f3e8ff' : '#fef3c7',
                    color: transaction.method === 'Transfer' ? '#1e40af' :
                           transaction.method === 'QRIS' ? '#7c3aed' : '#92400e'
                  }}>
                    {transaction.method}
                  </span>
                </div>
                <div className="table-cell">
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    backgroundColor: '#d1fae5',
                    color: '#065f46'
                  }}>
                    Berhasil
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MitraRevenue;