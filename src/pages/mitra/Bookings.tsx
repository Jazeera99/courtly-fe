import React, { useState, useMemo } from 'react';
import { Search, Download, ChevronLeft, ChevronRight, Phone, User, MapPin, Clock 
} from 'lucide-react';
import { useQuery } from '@apollo/client';
import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel, flexRender, createColumnHelper } from '@tanstack/react-table';
import { GET_VENUE_BOOKINGS } from '../../graphql/queries';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import '../../styles/PartnerDashboard.css';
import '../../styles/PartnerBookings.css';

const columnHelper = createColumnHelper<any>();

const Bookings: React.FC = () => {
  const venueIdFromStorage = localStorage.getItem('venueId') || "";

  // 1. STATE UNTUK FILTER & SEARCH (Menghilangkan garis oranye)
  const [columnFilters, setColumnFilters] = useState<any[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const { data, loading } = useQuery(GET_VENUE_BOOKINGS, {
    variables: { venueId: venueIdFromStorage },
    skip: !venueIdFromStorage,
    fetchPolicy: 'network-only',
  });

  // --- LOGIKA MAPPING DATA ---
  const tableData = useMemo(() => {
    if (!data?.getVenueBookings) return [];
    return data.getVenueBookings.map((b: any) => {
      const startTimeNum = Number(b.start_time);
      const endTimeNum = Number(b.end_time);
      const start = new Date(startTimeNum);
      const end = new Date(endTimeNum);
      const isValidDate = !isNaN(start.getTime());

      return {
        id: b.id.substring(0, 8).toUpperCase(),
        originalId: b.id,
        court: b.fields?.name || 'N/A',
        customer: b.users?.name || 'Pelanggan',
        phone: b.users?.phone || '-',
        date: isValidDate ? start.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A',
        time: isValidDate ? `${start.getHours().toString().padStart(2, '0')}:00 - ${end.getHours().toString().padStart(2, '0')}:00` : '--:--',
        duration: isValidDate ? Math.max(1, Math.round((endTimeNum - startTimeNum) / (1000 * 60 * 60))) : 1,
        status: b.status.toLowerCase(),
        price: b.final_amount || 0,
        payment: b.payment_status === 'settlement' || b.payment_status === 'paid' ? 'paid' : 'unpaid'
      };
    });
  }, [data]);

  // --- DEFINISI KOLOM TANSTACK ---
  const columns = useMemo(() => [
    columnHelper.accessor('id', {
      header: 'ID BOOKING',
      cell: info => <span style={{ fontWeight: 700, color: '#6366f1', fontSize: '12px' }}>#{info.getValue()}</span>,
    }),
    columnHelper.accessor('court', {
      header: 'Informasi Lapangan',
      cell: info => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ padding: '6px', backgroundColor: '#f0f7ff', borderRadius: '6px' }}><MapPin size={14} color="#3b82f6"/></div>
          <div>
            <div className="court-name" style={{ fontWeight: 600 }}>{info.getValue()}</div>
            <div className="duration-tag" style={{ fontSize: '11px', color: '#64748b' }}>{info.row.original.duration} Jam Durasi</div>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('customer', {
      header: 'Pelanggan',
      cell: info => (
        <div>
          <div className="customer-name" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <User size={12}/> {info.getValue()}
          </div>
          <div className="customer-phone" style={{ fontSize: '12px', color: '#94a3b8' }}>{info.row.original.phone}</div>
        </div>
      ),
    }),
    columnHelper.accessor('date', {
      header: 'Waktu & Tanggal',
      cell: info => (
        <div>
          <div className="date-val" style={{ fontWeight: 500 }}>{info.getValue()}</div>
          <div className="time-val" style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={12}/> {info.row.original.time}
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('price', {
      header: 'TOTAL HARGA',
      cell: info => (
        <span style={{ fontWeight: 600 }}>
          Rp {info.getValue().toLocaleString('id-ID')}
        </span>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'STATUS',
      cell: info => {
        const val = info.getValue();
        const colors: any = { confirmed: '#ecfdf5', pending: '#fff7ed', paid: '#f0f9ff', cancelled: '#fef2f2' };
        const text: any = { confirmed: '#059669', pending: '#d97706', paid: '#30c702', cancelled: '#dc2626' };
        const label: any = { confirmed: 'Dikonfirmasi', pending: 'Menunggu', paid: 'Lunas', cancelled: 'Batal' };
        return (
          <span style={{ 
            padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
            backgroundColor: colors[val] || '#f1f5f9', color: text[val] || '#64748b',
            textTransform: 'uppercase', letterSpacing: '0.5px'
          }}>
            {label[val] || val}
          </span>
        );
      },
    }),
    columnHelper.accessor('payment', {
      header: 'Pembayaran',
      cell: info => (
        <div className="payment-status" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className={`dot ${info.getValue()}`} style={{ 
            width: '8px', height: '8px', borderRadius: '50%', 
            backgroundColor: info.getValue() === 'paid' ? '#22c55e' : '#ef4444' 
          }}></span>
          <span style={{ fontSize: '13px', fontWeight: 500 }}>
            {info.getValue() === 'paid' ? 'Lunas' : 'Belum Bayar'}
          </span>
        </div>
      ),
    }),
  ], []);

  const table = useReactTable({
    data: tableData,
    columns,
    state: { 
      columnFilters,
      globalFilter
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: { pagination: { pageSize: 7 } },
  });

  if (loading) return <div className="loading-state">Memuat data...</div>;

  // --- FUNGSI DOWNLOAD PDF ---
  const exportToPDF = () => {
    const doc = new jsPDF();
    const currentRows = table.getFilteredRowModel().rows.map(row => row.original);
    
    // Menentukan judul berdasarkan filter status
    const statusFilter = table.getColumn('status')?.getFilterValue() as string;
    const titleStatus = statusFilter ? statusFilter.toUpperCase() : 'SEMUA STATUS';

    // Header Laporan
    doc.setFontSize(18);
    doc.text('Laporan Reservasi Lapangan', 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Status: ${titleStatus}`, 14, 30);
    doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 14, 37);

    // Definisi Tabel untuk PDF
    const tableColumn = ["ID", "Lapangan", "Pelanggan", "Tanggal", "Jam", "Harga", "Status"];
    const tableRows = currentRows.map((b: any) => [
      b.id,
      b.court,
      `${b.customer}\n(${b.phone})`, // Nama dan nomor telepon
      b.date,
      b.time,
      `Rp ${b.price.toLocaleString('id-ID')}`,
      b.status.toUpperCase()
    ]);

    // Generate Tabel
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 45,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235], fontSize: 10 }, // Warna biru dashboard
      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: {
        5: { halign: 'right' }, // Kolom harga rata kanan
      }
    });

    // Simpan PDF
    doc.save(`Laporan_Booking_${titleStatus}_${new Date().getTime()}.pdf`);
  };

  return (
    <div className="mitra-page" style={{ position: 'relative', paddingBottom: '40px' }}>
      
      {/* 2. HEADER: TITLE FIXED LEFT, BUTTON FIXED RIGHT */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1>📅 Lihat Booking</h1>
          <p>Lihat list reservasi lapangan Anda</p>
        </div> 
          

        {/* <div className="title-wrapper">
          <h1>📅 Kelola Booking</h1>
          <p>Kelola data dan jadwal operasional lapangan Anda.</p>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', letterSpacing: '-0.5px' }}>Kelola Booking</h1>
          <p style={{ color: '#64748b' }}></p>
        </div> */}
        
        {/* Tombol Tambah Booking - Fixed Position on Desktop/Mobile Floating
        <button className="btn-add-booking" style={{
          position: 'fixed', bottom: '30px', right: '30px', zIndex: 100,
          backgroundColor: '#2563eb', color: 'white', padding: '14px 24px',
          borderRadius: '50px', border: 'none', boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.4)',
          display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600
        }}>
          <Plus size={20} /><span>Tambah Booking</span>
        </button> */}
      </div>

      {/* TOOLBAR */}
      <div className="booking-toolbar-container" style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div className="search-box" style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
          <Search className="search-icon" size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input 
            type="text" 
            placeholder="Cari pelanggan, ID, atau lapangan..." 
            className="modern-input" 
            value={globalFilter ?? ''}
            onChange={e => setGlobalFilter(e.target.value)}
            style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', border: '1px solid #e2e8f0' }}
          />
        </div>
        <div className="toolbar-actions" style={{ display: 'flex', gap: '10px' }}>
          <select 
            className="modern-select" 
            style={{ padding: '10px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: 'white' }}
            onChange={e => table.getColumn('status')?.setFilterValue(e.target.value)}
          >
            <option value="">Semua Status</option>
            <option value="confirmed">Dikonfirmasi</option>
            <option value="pending">Menunggu</option>
            <option value="paid">Lunas</option>
          </select>
          <button 
            className="btn-icon-action" 
            onClick={exportToPDF} // Memanggil fungsi download saat diklik
            title="Download Laporan PDF"
            style={{ 
              padding: '10px', 
              backgroundColor: 'white', 
              border: '1px solid #e2e8f0', 
              borderRadius: '12px',
              cursor: 'pointer', // Menambah kursor tangan agar user tahu ini bisa diklik
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* 3. TABLE DENGAN SCROLL X */}
      <div className="table-container shadow-sm" style={{ 
        backgroundColor: 'white', 
        borderRadius: '16px', 
        overflow: 'hidden', 
        border: '1px solid #f1f5f9' 
      }}>
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table className="clean-table" style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} style={{ backgroundColor: '#f8fafc' }}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} style={{ textAlign: 'left', padding: '16px 20px', color: '#64748b', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} style={{ padding: '16px 20px' }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MODERN PAGINATION */}
        <div className="pagination-container" style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '20px', borderTop: '1px solid #f1f5f9', backgroundColor: '#fff'
        }}>
          <p style={{ fontSize: '14px', color: '#64748b' }}>
            Menampilkan <b>{table.getRowModel().rows.length}</b> data
          </p>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <button 
              onClick={() => table.previousPage()} 
              disabled={!table.getCanPreviousPage()}
              style={{
                padding: '8px', borderRadius: '10px', border: '1px solid #e2e8f0',
                backgroundColor: table.getCanPreviousPage() ? '#fff' : '#f8fafc',
                cursor: table.getCanPreviousPage() ? 'pointer' : 'not-allowed',
                color: '#64748b'
              }}
            >
              <ChevronLeft size={18} />
            </button>
            
            <div style={{ display: 'flex', gap: '4px' }}>
              {[...Array(table.getPageCount())].map((_, i) => (
                <button 
                  key={i}
                  onClick={() => table.setPageIndex(i)}
                  style={{
                    width: '36px', height: '36px', borderRadius: '10px', border: 'none',
                    backgroundColor: table.getState().pagination.pageIndex === i ? '#2563eb' : 'transparent',
                    color: table.getState().pagination.pageIndex === i ? '#fff' : '#64748b',
                    fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button 
              onClick={() => table.nextPage()} 
              disabled={!table.getCanNextPage()}
              style={{
                padding: '8px', borderRadius: '10px', border: '1px solid #e2e8f0',
                backgroundColor: table.getCanNextPage() ? '#fff' : '#f8fafc',
                cursor: table.getCanNextPage() ? 'pointer' : 'not-allowed',
                color: '#64748b'
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* SUMMARY GRID */}
      <div className="summary-grid" style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <div className="summary-card" style={{ padding: '20px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
          <label style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>Total Booking</label>
          <div className="val" style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px' }}>{tableData.length}</div>
        </div>
        
        <div className="summary-card primary" style={{ padding: '20px', backgroundColor: '#eff6ff', borderRadius: '16px', border: '1px solid #dbeafe' }}>
          <label style={{ fontSize: '14px', color: '#2563eb', fontWeight: 500 }}>Estimasi Pendapatan</label>
          <div className="val" style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px', color: '#1e40af' }}>
            Rp {tableData
              .filter((booking: any) => booking.payment === 'paid') 
              .reduce((sum: number, booking: any) => sum + booking.price, 0) 
              .toLocaleString('id-ID')}
          </div>
        </div>

        <div className="summary-card warning" style={{ padding: '20px', backgroundColor: '#fff7ed', borderRadius: '16px', border: '1px solid #ffedd5' }}>
          <label style={{ fontSize: '14px', color: '#d97706', fontWeight: 500 }}>Perlu Konfirmasi</label>
          <div className="val" style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px', color: '#9a3412' }}>
            {tableData.filter((booking: any) => booking.status === 'pending').length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookings;