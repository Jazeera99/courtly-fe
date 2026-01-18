import React, { useState, useEffect } from 'react';
import { X, Save, MapPin, Info, DollarSign, Activity, Wrench, CheckCircle } from 'lucide-react';

interface CourtFormData {
  id?: number;
  name: string;
  type: 'futsal' | 'badminton' | 'basket' | 'tennis' | 'voli';
  price: number;
  status: 'available' | 'maintenance' | 'booked';
  description: string;
  city: string;
  province: string;
  full_address: string;
}

interface CourtFormProps {
  court?: CourtFormData | null;
  onSave: (data: CourtFormData) => void;
  onCancel: () => void;
}

const CourtForm: React.FC<CourtFormProps> = ({ court, onSave, onCancel }) => {
  const [formData, setFormData] = useState<CourtFormData>({
    name: '',
    type: 'futsal',
    price: 0,
    status: 'available',
    description: '',
    city: '',
    province: '',
    full_address: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (court) setFormData(court);
  }, [court]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'price' ? parseFloat(value) || 0 : value 
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Nama wajib diisi';
    if (formData.price <= 0) newErrors.price = 'Harga tidak valid';
    if (!formData.city.trim()) newErrors.city = 'Kota wajib diisi';
    if (!formData.full_address.trim()) newErrors.full_address = 'Alamat wajib diisi';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Reusable Styles
  const labelStyle = { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '8px' };
  
  const inputStyle = (hasError: boolean) => ({
    width: '100%', 
    padding: '12px', 
    borderRadius: '10px', 
    border: `1.5px solid ${hasError ? '#ef4444' : '#e5e7eb'}`,
    fontSize: '14px', 
    outline: 'none', 
    transition: 'all 0.2s', 
    backgroundColor: '#fff', // Latar putih bersih
    color: '#000000', // Teks hitam pekat saat diketik
    fontWeight: '500'
  });

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px'
    }}>
      <div className="modal-content" style={{
        backgroundColor: '#fcfcfd', width: '100%', maxWidth: '750px', borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)', overflow: 'hidden'
      }}>
        
        {/* HEADER */}
        <div style={{
          padding: '24px 30px', borderBottom: '1px solid #f1f5f9',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.6rem', color: '#0f172a', fontWeight: '800' }}>
              {court ? '✏️ Edit Lapangan' : '🏟️ Tambah Lapangan'}
            </h2>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '14px' }}>Pastikan data lapangan sudah sesuai</p>
          </div>
          <button onClick={onCancel} style={{
            padding: '10px', borderRadius: '12px', border: 'none', backgroundColor: '#f1f5f9', 
            cursor: 'pointer', color: '#64748b', display: 'flex', transition: '0.2s'
          }}><X size={20} /></button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); if (validateForm()) onSave(formData); }} style={{ padding: '30px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
            
            {/* Nama Lapangan */}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}><Activity size={16} color="#3b82f6"/> Nama Lapangan *</label>
              <input name="name" value={formData.name} onChange={handleChange} 
                placeholder="Contoh: Lapangan Futsal VVIP" style={inputStyle(!!errors.name)} />
              {errors.name && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.name}</span>}
            </div>

            {/* Jenis & Harga */}
            <div>
              <label style={labelStyle}><Info size={16} color="#3b82f6"/> Jenis Olahraga</label>
              <select name="type" value={formData.type} onChange={handleChange} style={inputStyle(false)}>
                <option value="futsal">⚽ Futsal</option>
                <option value="badminton">🏸 Badminton</option>
                <option value="basket">🏀 Basket</option>
                <option value="tennis">🎾 Tennis</option>
                <option value="voli">🏐 Voli</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}><DollarSign size={16} color="#10b981"/> Harga per Jam (Rp)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} 
                style={inputStyle(!!errors.price)} />
            </div>

            {/* Status Selector - Custom Des ign */}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Status Operasional</label>
              <div style={{ display: 'flex', gap: '15px' }}>
                {/* Tersedia */}
                <button type="button" 
                  onClick={() => setFormData({...formData, status: 'available'})}
                  style={{
                    flex: 1, padding: '14px', borderRadius: '14px', border: '2px solid',
                    cursor: 'pointer', transition: 'all 0.3s', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    borderColor: formData.status === 'available' ? '#10b981' : '#e5e7eb',
                    backgroundColor: formData.status === 'available' ? '#ecfdf5' : '#fff',
                    color: formData.status === 'available' ? '#065f46' : '#6b7280'
                  }}>
                  <CheckCircle size={18} /> Tersedia
                </button>

                {/* Perawatan - Yellow/Amber Mode */}
                <button type="button" 
                  onClick={() => setFormData({...formData, status: 'maintenance'})}
                  style={{
                    flex: 1, padding: '14px', borderRadius: '14px', border: '2px solid',
                    cursor: 'pointer', transition: 'all 0.3s', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    borderColor: formData.status === 'maintenance' ? '#f59e0b' : '#e5e7eb',
                    backgroundColor: formData.status === 'maintenance' ? '#fffbeb' : '#fff',
                    color: formData.status === 'maintenance' ? '#92400e' : '#6b7280'
                  }}>
                  <Wrench size={18} /> Dalam Perawatan
                </button>
              </div>
            </div>

            {/* Separator Lokasi */}
            <div style={{ gridColumn: 'span 2', margin: '10px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', whiteSpace: 'nowrap' }}>Detail Lokasi</span>
                <div style={{ width: '100%', height: '1.5px', background: 'linear-gradient(to right, #e2e8f0, transparent)' }}></div>
              </div>
            </div>

            <div>
              <label style={labelStyle}><MapPin size={16} color="#f59e0b"/> Kota *</label>
              <input name="city" value={formData.city} onChange={handleChange} 
                placeholder="Sidoarjo" style={inputStyle(!!errors.city)} />
            </div>

            <div>
              <label style={labelStyle}><MapPin size={16} color="#f59e0b"/> Provinsi</label>
              <input name="province" value={formData.province} onChange={handleChange} 
                placeholder="Jawa Timur" style={inputStyle(false)} />
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Alamat Lengkap *</label>
              <textarea name="full_address" value={formData.full_address} onChange={handleChange} 
                rows={2} placeholder="Sebutkan jalan, nomor, atau patokan..." style={{...inputStyle(!!errors.full_address), resize: 'none'}} />
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Deskripsi Lapangan</label>
              <textarea name="description" value={formData.description} onChange={handleChange} 
                rows={3} placeholder="Fasilitas tambahan (Lampu, WC, Kantin, dll)..." style={{...inputStyle(false), resize: 'none'}} />
            </div>
          </div>

          {/* ACTIONS */}
          <div style={{
            marginTop: '40px', display: 'flex', gap: '16px', 
            paddingTop: '25px', borderTop: '1px solid #f1f5f9'
          }}>
            <button type="button" onClick={onCancel} style={{
              flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0',
              backgroundColor: '#fff', color: '#475569', fontWeight: '700', cursor: 'pointer', transition: '0.2s'
            }}>Batal</button>
            
            <button type="submit" style={{
              flex: 2, padding: '14px', borderRadius: '12px', border: 'none',
              backgroundColor: '#2563eb', color: '#fff', fontWeight: '700', 
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)',
              transition: '0.2s'
            }}>
              <Save size={20} />
              {court ? 'Simpan Perubahan' : 'Terbitkan Lapangan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourtForm;