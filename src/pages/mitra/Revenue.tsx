import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import React, { useState } from 'react';
import { TrendingUp, Download, Calendar, ArrowUpRight, DollarSign, BookOpen, Layout } from 'lucide-react';
import { useQuery } from '@apollo/client';
import { GET_PARTNER_STATS } from '../../graphql/queries';
import '../../styles/PartnerDashboard.css';

const MitraRevenue: React.FC = () => {
  const [timeRange, setTimeRange] = useState('month');

  const venueId = "80d2466a-055c-4e24-a225-29ba1ac1e0da"; 

  const { loading, error, data } = useQuery(GET_PARTNER_STATS, {
    variables: { venueId, timeRange },
    fetchPolicy: 'network-only' // Agar data selalu terbaru
  });
  
  if (loading) return <div className="p-10">Memproses data laporan...</div>;
  if (error) return <div className="p-10 text-red-500">Error: {error.message}</div>;

  // Destructure data dari database
  const { stats, monthlyTrend, topCourts, transactions } = data.getPartnerStats;

  // Helper untuk format Rupiah
  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const paidTransactions = transactions.filter((t: any) => t.status.toLowerCase() === 'paid');

    if (paidTransactions.length === 0) {
      alert("Tidak ada data lunas untuk PDF.");
      return;
    }

    // Header Laporan Resmi
    doc.setFontSize(18);
    doc.text('LAPORAN PENDAPATAN MITRA', 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Venue: Sidoarjo Jawa Timur`, 14, 30);
    doc.text(`Pemilik: Gerix Swa`, 14, 35);
    doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}`, 14, 45);

    // Tabel Transaksi
    autoTable(doc, {
      startY: 55,
      head: [['ID', 'Pelanggan', 'Lapangan', 'Tanggal', 'Jumlah']],
      body: paidTransactions.map(t => [
        t.id.slice(0, 8).toUpperCase(),
        t.customerName,
        t.fieldName,
        new Date(t.paidAt).toLocaleDateString('id-ID'),
        `Rp ${t.amount.toLocaleString('id-ID')}`
      ]),
      foot: [['', '', '', 'TOTAL AKHIR', `Rp ${paidTransactions.reduce((a, b) => a + b.amount, 0).toLocaleString('id-ID')}`]],
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] } // Warna biru dashboard
    });

    doc.save(`Laporan_Resmi_${timeRange}_${new Date().getTime()}.pdf`);
  };

  const handleExport = () => {
    // FILTER: Hanya ambil transaksi yang statusnya 'paid'
    const paidTransactions = transactions.filter((t: any) => 
      t.status.toLowerCase() === 'paid'
    );

    if (paidTransactions.length === 0) {
      alert("Tidak ada data transaksi lunas untuk periode ini.");
      return;
    }

    // MAPPING: Susun data untuk Excel
    const reportData = paidTransactions.map((t: any) => ({
      'ID Transaksi': `#${t.id.slice(0, 8).toUpperCase()}`,
      'Nama Pelanggan': t.customerName,
      'Nama Lapangan': t.fieldName,
      'Tanggal': new Date(t.paidAt).toLocaleDateString('id-ID', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
      }),
      'Jam': new Date(t.paidAt).toLocaleTimeString('id-ID', {
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      'Jumlah (IDR)': t.amount,
      'Status': 'LUNAS', // Karena sudah difilter, semua pasti Lunas
    }));

    // Tambahkan Baris Total di bagian paling bawah Excel
    const totalRevenue = paidTransactions.reduce((sum: number, t: any) => sum + t.amount, 0);
    reportData.push({
      'ID Transaksi': 'TOTAL',
      'Nama Pelanggan': '',
      'Nama Lapangan': '',
      'Tanggal': '',
      'Jam': '',
      'Jumlah (IDR)': totalRevenue,
      'Status': ''
    });

    // Proses Pembuatan File Excel
    const ws = XLSX.utils.json_to_sheet(reportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan Lunas");

    // Atur Lebar Kolom
    ws['!cols'] = [
      { wch: 15 }, { wch: 25 }, { wch: 20 }, 
      { wch: 20 }, { wch: 10 }, { wch: 15 }, { wch: 12 }
    ];

    // Unduh File
    const dateStr = new Date().toLocaleDateString('id-ID').replace(/\//g, '-');
    XLSX.writeFile(wb, `Laporan_Lunas_${timeRange}_${dateStr}.xlsx`);
  };

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
            {['week', 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                // Di sini kita tambahkan class 'active' jika range sedang dipilih
                className={`btn-filter ${timeRange === range ? 'active' : ''}`}
              >
                {
                range === 'week' ? 'Minggu Ini' : 
                range === 'month' ? 'Bulan Ini' : 'Tahun Ini'}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-primary" onClick={handleExportPDF}>
              <Layout size={18} /> Export PDF
            </button>
            <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={handleExport}>
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
                  {formatIDR(stats.totalRevenue)}
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
                +{stats.growth}%
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
                  {stats.totalBookings}
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
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '8px' }}>Rata-rata Transaksi</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1f2937' }}>
                {formatIDR(stats.averagePrice)}
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
                  {formatIDR(stats.totalRevenue / 30)}
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
                {/* <TrendingDown size={14} />
                -2.1% */}
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Detailed Data */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', marginBottom: '32px' }}>
          
          {/* Revenue Chart - Dinamis berdasarkan data.monthlyTrend */}
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>Trend Pendapatan</h3>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Data Real-time</span>
            </div>
            
            <div style={{ 
              height: '300px', 
              display: 'flex', 
              alignItems: 'flex-end', 
              gap: '24px', 
              padding: '20px 10px',
              borderBottom: '1px solid #f3f4f6', 
              overflowX: 'auto'
            }}>
              {monthlyTrend.map((item: any, index: number) => {
                // Logika kalkulasi tinggi bar: (Pendapatan Bulan Ini / Total Revenue) * Tinggi Maksimal (250px)
                const maxRevenue = Math.max(...monthlyTrend.map((t: any) => t.revenue), 1);
                const barHeight = (item.revenue / maxRevenue) * 230;

                return (
                  <div key={index} style={{ 
                    flex: 1, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    minWidth: timeRange === 'day' ? '40px' : '60px' // Kecilkan lebar jika data harian
                  }}>
                    {/* Tooltip sederhana saat hover */}
                    <div
                      className="bar-item"
                      style={{
                        width: '80%',
                        height: `${barHeight + 5}px`, // +5 agar bar nol tetap terlihat sedikit
                        background: item.revenue > 0 ? 'linear-gradient(to top, #3b82f6, #60a5fa)' : '#e5e7eb',
                        borderRadius: '4px 4px 0 0',
                        marginBottom: '8px',
                        transition: 'height 0.5s ease-in-out',
                        cursor: 'pointer'
                      }}
                      title={`${item.month}: ${formatIDR(item.revenue)}`}
                    />
                    {/* Label Bawah (Jam/Hari/Bulan) */}
                    <div style={{ 
                      fontSize: '0.75rem', 
                      color: '#6b7280', 
                      fontWeight: '600',
                      whiteSpace: 'nowrap'
                    }}>
                      {item.month}
                    </div>
                    {/* Info Tambahan di bawah label */}
                    <div style={{ fontSize: '0.65rem', color: '#9ca3af' }}>
                      {item.bookings} Bkg
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Performing Courts - Dinamis berdasarkan data.topCourts */}
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '20px' }}>
              Lapangan Terpopuler
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {topCourts.map((court: any, index: number) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '10px',
                  border: '1px solid #f3f4f6'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: '#1f2937', fontSize: '0.95rem', marginBottom: '2px' }}>
                      {court.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                      {court.bookings} Kali disewa
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '700', color: '#1f2937', fontSize: '0.95rem' }}>
                      {formatIDR(court.revenue)}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#3b82f6',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: '2px'
                    }}>
                      {court.percentage}% <span style={{ color: '#9ca3af', fontWeight: 'normal' }}>share</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card-white" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '24px' }}>Transaksi Terbaru</h3>
          
          {/* Pembungkus Scroll Tambahan */}
          <div style={{ 
            maxHeight: '400px', // Batas tinggi tabel
            overflowY: 'auto',   // Aktifkan scroll vertikal
            overflowX: 'hidden', // Hindari scroll horizontal yang tidak perlu
            paddingRight: '8px'  // Memberi ruang untuk bar scroll
          }}>
            <div className="data-table">
              {/* Header tetap di atas (Sticky) */}
              <div className="table-header" style={{ 
                gridTemplateColumns: '1fr 2fr 2fr 1.5fr 1fr 1fr',
                position: 'sticky',
                top: 0,
                backgroundColor: 'white',
                zIndex: 10,
                borderBottom: '2px solid #f3f4f6'
              }}>
                <div>ID Transaksi</div>
                <div>Pelanggan</div>
                <div>Lapangan</div>
                <div>Tanggal</div>
                <div>Jumlah</div>
                <div>Status</div>
              </div>

              {/* Baris Data */}
              {transactions.map((t: any) => (
                <div key={t.id.slice(0, 8).toUpperCase()} className="table-row" style={{ gridTemplateColumns: '1fr 2fr 2fr 1.5fr 1fr 1fr' }}>
                  <div className="table-cell" style={{ fontSize: '0.7rem' }}>#{t.id.slice}</div>
                  <div className="table-cell primary">{t.customerName}</div>
                  <div className="table-cell">{t.fieldName}</div>
                  <div className="table-cell">
                    {t.paidAt 
                      ? new Date(t.paidAt).toLocaleDateString('id-ID', { 
                          day: '2-digit', 
                          month: 'short', 
                          year: 'numeric' 
                        }) 
                      : 'Belum Lunas'}
                  </div>
                  <div className="table-cell" style={{ fontWeight: '600' }}>{formatIDR(t.amount)}</div>
                  <div className="table-cell">
                    <span className={`status-badge ${t.status}`}>{t.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MitraRevenue;