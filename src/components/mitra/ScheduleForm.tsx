// src/components/mitra/ScheduleForm.tsx
import React, { useState } from 'react';
import { X, Save, Clock, Plus, Trash2 } from 'lucide-react';

interface ScheduleDay {
  day: string;
  open: boolean;
  openTime: string;
  closeTime: string;
  pricePerHour: number;
}

interface ScheduleFormProps {
  fieldId?: number;
  onSave: (schedules: ScheduleDay[]) => void;
  onCancel: () => void;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({ fieldId, onSave, onCancel }) => {
  const [schedules, setSchedules] = useState<ScheduleDay[]>([
    { day: 'Senin', open: true, openTime: '08:00', closeTime: '22:00', pricePerHour: 150000 },
    { day: 'Selasa', open: true, openTime: '08:00', closeTime: '22:00', pricePerHour: 150000 },
    { day: 'Rabu', open: true, openTime: '08:00', closeTime: '22:00', pricePerHour: 150000 },
    { day: 'Kamis', open: true, openTime: '08:00', closeTime: '22:00', pricePerHour: 150000 },
    { day: 'Jumat', open: true, openTime: '08:00', closeTime: '22:00', pricePerHour: 150000 },
    { day: 'Sabtu', open: true, openTime: '08:00', closeTime: '23:00', pricePerHour: 180000 },
    { day: 'Minggu', open: true, openTime: '08:00', closeTime: '23:00', pricePerHour: 200000 },
  ]);

  const handleScheduleChange = (index: number, field: keyof ScheduleDay, value: any) => {
    const newSchedules = [...schedules];
    
    if (field === 'open') {
      newSchedules[index][field] = value as boolean;
    } else if (field === 'pricePerHour') {
      newSchedules[index][field] = parseFloat(value) || 0;
    } else {
      newSchedules[index][field] = value;
    }
    
    setSchedules(newSchedules);
  };

  const handleAddDay = () => {
    setSchedules([
      ...schedules,
      { day: 'Hari Tambahan', open: true, openTime: '08:00', closeTime: '17:00', pricePerHour: 150000 }
    ]);
  };

  const handleRemoveDay = (index: number) => {
    if (schedules.length > 1) {
      const newSchedules = schedules.filter((_, i) => i !== index);
      setSchedules(newSchedules);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi jam buka harus sebelum jam tutup
    const hasInvalidTime = schedules.some(schedule => {
      if (!schedule.open) return false;
      
      const openTime = new Date(`1970-01-01T${schedule.openTime}:00`);
      const closeTime = new Date(`1970-01-01T${schedule.closeTime}:00`);
      return closeTime <= openTime;
    });

    if (hasInvalidTime) {
      alert('Jam tutup harus setelah jam buka!');
      return;
    }

    onSave(schedules);
  };

  const handleCopyToAll = (index: number) => {
    const template = schedules[index];
    const newSchedules = schedules.map((schedule, i) => 
      i !== index ? { ...schedule, openTime: template.openTime, closeTime: template.closeTime } : schedule
    );
    setSchedules(newSchedules);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '800px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Clock size={24} />
            <h2>Atur Jam Operasional Lapangan</h2>
          </div>
          <button onClick={onCancel} className="icon-btn">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="schedule-table-container">
            <table className="schedule-table">
              <thead>
                <tr>
                  <th>Hari</th>
                  <th>Status</th>
                  <th>Jam Buka</th>
                  <th>Jam Tutup</th>
                  <th>Harga/Jam (Rp)</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((schedule, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="text"
                        value={schedule.day}
                        onChange={(e) => handleScheduleChange(index, 'day', e.target.value)}
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }}
                      />
                    </td>
                    <td>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={schedule.open}
                          onChange={(e) => handleScheduleChange(index, 'open', e.target.checked)}
                        />
                        <span className="slider"></span>
                      </label>
                      <span style={{ marginLeft: '8px', fontSize: '0.875rem' }}>
                        {schedule.open ? 'Buka' : 'Tutup'}
                      </span>
                    </td>
                    <td>
                      <input
                        type="time"
                        value={schedule.openTime}
                        onChange={(e) => handleScheduleChange(index, 'openTime', e.target.value)}
                        disabled={!schedule.open}
                        style={{ 
                          width: '100%', 
                          padding: '8px', 
                          borderRadius: '6px', 
                          border: '1px solid #d1d5db',
                          opacity: schedule.open ? 1 : 0.5 
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="time"
                        value={schedule.closeTime}
                        onChange={(e) => handleScheduleChange(index, 'closeTime', e.target.value)}
                        disabled={!schedule.open}
                        style={{ 
                          width: '100%', 
                          padding: '8px', 
                          borderRadius: '6px', 
                          border: '1px solid #d1d5db',
                          opacity: schedule.open ? 1 : 0.5 
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={schedule.pricePerHour}
                        onChange={(e) => handleScheduleChange(index, 'pricePerHour', e.target.value)}
                        disabled={!schedule.open}
                        min="0"
                        style={{ 
                          width: '100%', 
                          padding: '8px', 
                          borderRadius: '6px', 
                          border: '1px solid #d1d5db',
                          opacity: schedule.open ? 1 : 0.5 
                        }}
                      />
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => handleCopyToAll(index)}
                          className="btn btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                          title="Salin ke semua hari"
                        >
                          Salin
                        </button>
                        {schedules.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveDay(index)}
                            className="btn btn-danger"
                            style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                            title="Hapus hari"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                onClick={handleAddDay}
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Plus size={16} />
                Tambah Hari Khusus
              </button>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => {
                    const newSchedules = schedules.map(schedule => ({
                      ...schedule,
                      open: true,
                      openTime: '08:00',
                      closeTime: '22:00'
                    }));
                    setSchedules(newSchedules);
                  }}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.875rem' }}
                >
                  Setel Standar (08:00-22:00)
                </button>
              </div>
            </div>
          </div>

          <div className="form-actions" style={{ marginTop: '24px' }}>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={18} />
              Simpan Jadwal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleForm;