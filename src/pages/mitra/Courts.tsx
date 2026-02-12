import React, { useState } from 'react'; 
import { useQuery, useMutation } from '@apollo/client';
import { Edit, Trash2, Plus, Loader2, AlertCircle } from 'lucide-react';
import { GET_PARTNER_COURTS, GET_PARTNER_STATS } from '../../graphql/queries';
import { SAVE_FIELD, DELETE_FIELD } from '../../graphql/mutations';
import CourtForm from '../../components/mitra/CourtForm';
import '../../styles/PartnerDashboard.css';

const MitraCourts: React.FC = () => {
  const venueId = localStorage.getItem('venueId')?.replace(/"/g, '') || "";
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState<any>(null);

  const [saveField] = useMutation(SAVE_FIELD);
  const [deleteField] = useMutation(DELETE_FIELD);

  // Tambahkan Fungsi Helper untuk Format Jam di sini
  const formatTime = (timeString: string) => {
    if (!timeString) return '--:--';
    try {
      // Jika formatnya ISO string "1970-01-01T08:00:00Z"
      const date = new Date(timeString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      }
      // Jika formatnya string biasa "08:00:00"
      return timeString.substring(0, 5);
    } catch (e) {
      return timeString;
    }
  };

  const { data: statsData, loading: statsLoading } = useQuery(GET_PARTNER_STATS, {
    variables: { venueId, timeRange: "year" },
    skip: !venueId,
  });

  const { data: courtsData, loading: courtsLoading, refetch } = useQuery(GET_PARTNER_COURTS, {
    variables: { venueId: venueId.trim() },
    skip: !venueId,
    fetchPolicy: "network-only",
  });

  const getTypeIcon = (type: string) => {
    const t = type?.toLowerCase() || '';
    if (t.includes('futsal')) return '⚽';
    if (t.includes('badminton')) return '🏸';
    if (t.includes('basket')) return '🏀';
    return '🏟️';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return { bg: '#d1fae5', text: '#065f46' };
      case 'maintenance': return { bg: '#fee2e2', text: '#991b1b' };
      default: return { bg: '#f3f4f6', text: '#6b7280' };
    }
  };

  // --- HANDLER UNTUK FORM ---
  const handleAddClick = () => {
    setSelectedCourt(null); // Reset data untuk tambah baru
    setIsFormOpen(true);
  };

  const handleEditClick = (court: any) => {
    // Map data dari DB ke format yang dibutuhkan Form Anda
    setSelectedCourt({
      id: court.id,
      name: court.name,
      type: court.field_categories?.[0]?.categories?.name?.toLowerCase() || 'futsal',
      price: court.pricePerHour,
      status: court.is_available ? 'available' : 'maintenance',
      description: court.description || '',
      city: court.city || '',
      province: court.province || '',
      full_address: court.full_address || ''
    });
    setIsFormOpen(true);
  };

  const handleSaveCourt = async (formData: any) => {
    try {
        const input = {
        id: formData.id ? formData.id.toString() : null,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        type: formData.type,
        venue_id: venueId,
        // Data lokasi sekarang diambil dari form, bukan default lagi
        city: formData.city,
        province: formData.province,
        full_address: formData.full_address,
        // Jam operasional (bisa dikembangkan lagi nanti)
        opening_time: "2024-01-01T08:00:00Z", 
        closing_time: "2024-01-01T22:00:00Z"
      };

      await saveField({ variables: { input } });
      
      setIsFormOpen(false);
      refetch(); // Refresh list agar data terbaru muncul
      alert("Data berhasil disimpan!");
    } catch (error: any) {
      alert("Gagal menyimpan: " + error.message);
    }
  };

  const handleDeleteCourt = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus lapangan ini?')) {
      try {
        await deleteField({ variables: { id } });
        refetch();
      } catch (error: any) {
        alert("Gagal menghapus: " + error.message);
      }
    }
  };

  if (courtsLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin mr-2" /> <span>Menghubungkan ke Database...</span>
      </div>
    );
  }

  if (!venueId) {
    return (
      <div className="p-10 text-center">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h2>Venue ID Tidak Ditemukan</h2>
      </div>
    );
  }

  const stats = statsData?.getPartnerStats.stats;
  const courts = courtsData?.getPartnerCourts || [];

  return (
    <div className="mitra-page fullscreen-content">
      <div className="page-content">
        <div className="page-header">
          <h1>🏟️ Kelola Lapangan</h1>
          <p>Kelola data dan jadwal operasional lapangan Anda.</p>
        </div>

        <div className="grid-4" style={{ marginBottom: '32px' }}>
          <StatCard emoji="🏟️" label="Total" value={stats?.totalCourts || 0} />
          <StatCard emoji="✅" label="Tersedia" value={stats?.availableCourts || 0} />
          <StatCard emoji="📅" label="Booking Hari Ini" value={stats?.bookingsToday || 0} />
          <StatCard emoji="🔧" label="Perawatan" value={stats?.maintenanceCourts || 0} />
        </div>

        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-primary" onClick={handleAddClick} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={20} /> Tambah Lapangan
          </button>
        </div>

        <div className="grid-3">
          {courts.map((court: any) => {
            const price = court.pricePerHour || 0;
            const categoryName = court.field_categories?.[0]?.categories?.name || 'Umum';
            const statusColors = getStatusColor(court.is_available ? 'available' : 'maintenance');

            return (
              <div key={court.id.toString()} className="court-card shadow-sm border" style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                <div style={{ backgroundColor: '#f8fafc', padding: '20px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{getTypeIcon(categoryName)}</div>
                  <h3 style={{ fontWeight: '700' }}>{court.name}</h3>
                  <span style={{ backgroundColor: statusColors.bg, color: statusColors.text, padding: '4px 12px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                    {court.is_available ? 'Tersedia' : 'Perawatan'}
                  </span>
                </div>

                <div style={{ padding: '20px' }}>
                  <div style={{ marginBottom: '15px' }}>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 'bold' }}>📍 LOKASI</p>
                    <p style={{ fontSize: '0.85rem', color: '#1f2937' }}>{court.full_address}</p>
                    <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>{court.city}, {court.province}</p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                    <div>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 'bold' }}>🕒 OPERASIONAL</p>
                      <p style={{ fontSize: '0.85rem', fontWeight: '600' }}>
                        {formatTime(court.opening_time)} - {formatTime(court.closing_time)}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 'bold' }}>💰 HARGA</p>
                      <p style={{ fontSize: '0.85rem', fontWeight: '700', color: '#059669' }}>
                        Rp {Number(price).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 'bold' }}>Deskripsi</p>
                    <p style={{ color: '#1f2937', marginBottom: '20px', fontSize: '0.9rem' }}>
                      {court.description || 'Tidak ada deskripsi lapangan.'}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', paddingTop: '15px', borderTop: '1px solid #f3f4f6' }}>
                    <button className="btn btn-secondary flex-1" onClick={() => handleEditClick(court)} style={{ flex: 1, fontSize: '0.8rem' }}><Edit size={14}/> Edit</button>
                    <button 
                      className="btn btn-danger flex-1" 
                      style={{ flex: 1, fontSize: '0.8rem' }}
                      onClick={() => handleDeleteCourt(court.id.toString())}
                    >
                      <Trash2 size={14}/> Hapus
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {isFormOpen && (
          <CourtForm 
            court={selectedCourt}
            onSave={handleSaveCourt} 
            onCancel={() => {
              setIsFormOpen(false);
              setSelectedCourt(null);
            }} 
          />
        )}
      </div>
    </div>
  );
};

const StatCard = ({ emoji, label, value }: any) => (
  <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{emoji}</div>
    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{label}</div>
    <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{value}</div>
  </div>
);

export default MitraCourts;