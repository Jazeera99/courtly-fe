import React, { useState } from 'react'; // Tambah useState
import { useQuery, useMutation } from '@apollo/client';
import { Edit, Trash2, Plus, Loader2, AlertCircle } from 'lucide-react';
import { GET_PARTNER_COURTS, GET_PARTNER_STATS } from '../../graphql/queries';
import { DELETE_FIELD } from '../../graphql/mutations';
import CourtForm from '../../components/mitra/CourtForm'; // Import Form Anda
import '../../styles/PartnerDashboard.css';
import '../../styles/PartnerCourt.css';

const MitraCourts: React.FC = () => {
  const venueId = localStorage.getItem('venueId')?.replace(/"/g, '') || "";

  // --- STATE UNTUK MODAL ---
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState<any>(null);

  const formatTime = (timeString: string) => {
    if (!timeString) return '--:--';
    try {
      const date = new Date(timeString);
      return !isNaN(date.getTime()) 
        ? date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        : timeString.substring(0, 5);
    } catch (e) { return timeString; }
  };

  const { data: statsData, loading: statsLoading } = useQuery(GET_PARTNER_STATS, {
    variables: { venueId },
    skip: !venueId,
  });

  const { data: courtsData, loading: courtsLoading, refetch } = useQuery(GET_PARTNER_COURTS, {
    variables: { venueId: venueId.trim() },
    skip: !venueId,
    fetchPolicy: "network-only",
  });

  const [deleteField] = useMutation(DELETE_FIELD);

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
      capacity: 10, // default jika di DB belum ada
      size: 'Standard', // default jika di DB belum ada
      description: court.description || ''
    });
    setIsFormOpen(true);
  };

  const handleSaveCourt = async (formData: any) => {
    try {
      // Di sini nanti panggil mutation CREATE atau UPDATE Anda
      console.log("Data yang akan dikirim ke DB:", formData);
      
      // Sederhananya sementara:
      alert("Fitur simpan ke database sedang disiapkan!");
      setIsFormOpen(false);
      refetch();
    } catch (error) {
      alert("Gagal menyimpan data");
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

  if (courtsLoading || statsLoading) return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin mr-2" /> Menghubungkan...</div>;

  const stats = statsData?.getPartnerStats;
  const courts = courtsData?.getPartnerCourts || [];

  return (
    <div className="mitra-page fullscreen-content">
      <div className="page-content">
        <div className="page-header">
          <h1>🏟️ Kelola Lapangan</h1>
        </div>

        {/* Stat Cards */}
        <div className="grid-4" style={{ marginBottom: '32px' }}>
          <StatCard emoji="🏟️" label="Total" value={stats?.totalCourts || 0} />
          <StatCard emoji="✅" label="Tersedia" value={stats?.availableCourts || 0} />
          <StatCard emoji="📅" label="Booking" value={stats?.bookingsToday || 0} />
          <StatCard emoji="🔧" label="Perawatan" value={stats?.maintenanceCourts || 0} />
        </div>

        {/* Button Tambah */}
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-primary" onClick={handleAddClick} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={20} /> Tambah Lapangan
          </button>
        </div>

        {/* Grid Lapangan */}
        <div className="grid-3">
          {courts.map((court: any) => (
            <div key={court.id.toString()} className="court-card shadow-sm border" style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{ padding: '20px' }}>
                <h3 style={{ fontWeight: '700' }}>{court.name}</h3>
                <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>{court.description || 'No description'}</p>
                
                <div style={{ display: 'flex', gap: '8px', marginTop: '15px' }}>
                  {/* Panggil fungsi handleEditClick */}
                  <button className="btn btn-secondary flex-1" onClick={() => handleEditClick(court)}><Edit size={14}/> Edit</button>
                  <button className="btn btn-danger flex-1" onClick={() => handleDeleteCourt(court.id.toString())}><Trash2 size={14}/> Hapus</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* MODAL FORM - Muncul hanya jika isFormOpen true */}
        {isFormOpen && (
          <CourtForm 
            court={selectedCourt} 
            onSave={handleSaveCourt} 
            onCancel={() => setIsFormOpen(false)} 
          />
        )}
      </div>
    </div>
  );
};

const StatCard = ({ emoji, label, value }: any) => (
  <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
    <div style={{ fontSize: '2rem' }}>{emoji}</div>
    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{label}</div>
    <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{value}</div>
  </div>
);

export default MitraCourts;