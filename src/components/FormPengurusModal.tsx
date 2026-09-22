import React, { useState, useEffect } from 'react';
import { X, UserCheck, Send, Upload, Sparkles, Edit3 } from 'lucide-react';
import { DataPengurus, JabatanPengurus } from '../types';

interface FormPengurusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (pengurus: DataPengurus) => Promise<void>;
  initialData?: DataPengurus | null;
}

const JABATAN_LIST: JabatanPengurus[] = [
  'MANAGER CLUB',
  'ASSISTEN MANAGER CLUB',
  'HEAD COACH',
  'COACH',
  'BENDAHARA',
  'SEKRETARIS',
  'SIE PROTOKOLER',
  'SIE PERWASITAN/PERTANDINGAN',
  'SIE KEAMANAN',
  'SIE DOKUMENTASI/PROMOSI',
  'SIE KEBUGARAN',
  'SIE HUMAS',
];

export const FormPengurusModal: React.FC<FormPengurusModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const isEditMode = Boolean(initialData);

  const [tanggalWaktu, setTanggalWaktu] = useState('');
  const [nipc, setNipc] = useState('');
  const [nama, setNama] = useState('');
  const [jabatanPengurus, setJabatanPengurus] = useState<JabatanPengurus>('COACH');
  const [alamat, setAlamat] = useState('');
  const [noWa, setNoWa] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTanggalWaktu(initialData.tanggalWaktu || new Date().toISOString().slice(0, 19).replace('T', ' '));
        setNipc(initialData.nipc || '');
        setNama(initialData.nama || '');
        setJabatanPengurus(initialData.jabatanPengurus || 'COACH');
        setAlamat(initialData.alamat || '');
        setNoWa(initialData.noWa || '');
        setFotoUrl(initialData.fotoUrl || '');
        setPreviewUrl(
          initialData.fotoUrl ||
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'
        );
      } else {
        const now = new Date();
        setTanggalWaktu(now.toISOString().slice(0, 19).replace('T', ' '));
        const randomCode = Math.floor(1000 + Math.random() * 9000);
        setNipc(`PBS-${randomCode}`);
        setNama('');
        setJabatanPengurus('COACH');
        setAlamat('');
        setNoWa('');
        setFotoUrl('');
        setPreviewUrl(
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'
        );
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFotoUrl(result);
        setPreviewUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !alamat.trim() || !noWa.trim()) {
      alert('Harap lengkapi semua data pengurus club!');
      return;
    }

    setIsSubmitting(true);
    try {
      if (initialData) {
        const updatedPengurus: DataPengurus = {
          ...initialData,
          tanggalWaktu: tanggalWaktu || initialData.tanggalWaktu,
          nipc: nipc || initialData.nipc,
          nama: nama.trim(),
          jabatanPengurus: jabatanPengurus,
          alamat: alamat.trim(),
          noWa: noWa.trim(),
          fotoUrl:
            fotoUrl ||
            previewUrl ||
            initialData.fotoUrl ||
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
        };
        await onSubmit(updatedPengurus);
      } else {
        const newPengurus: DataPengurus = {
          id: `pengurus-${Date.now()}`,
          tanggalWaktu: tanggalWaktu || new Date().toISOString().slice(0, 19).replace('T', ' '),
          nipc: nipc || `PBS-${Math.floor(1000 + Math.random() * 9000)}`,
          nama: nama.trim(),
          jabatanPengurus: jabatanPengurus,
          alamat: alamat.trim(),
          noWa: noWa.trim(),
          fotoUrl:
            fotoUrl ||
            previewUrl ||
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
        };
        await onSubmit(newPengurus);
      }
      onClose();
    } catch (err) {
      console.error('Error submitting pengurus:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl">
              {isEditMode ? (
                <Edit3 className="w-5 h-5 text-amber-300" />
              ) : (
                <UserCheck className="w-5 h-5 text-blue-300" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-base">
                {isEditMode ? 'Edit Data Pengurus Club' : 'Input Data Pengurus Club'}
              </h3>
              <p className="text-xs text-blue-200">
                {isEditMode
                  ? `Mengubah profil pengurus (NIPC: ${nipc})`
                  : 'Tersimpan di Google Sheets: Data_Pengurus'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-3.5 max-h-[80vh] overflow-y-auto">
          {/* Row 1: Tanggal & Waktu + NIPC */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Tanggal &amp; Waktu
              </label>
              <input
                type="text"
                readOnly
                value={tanggalWaktu || ''}
                className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-xl text-xs font-mono text-slate-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nomor Induk Pengurus (NIPC)
              </label>
              <input
                type="text"
                readOnly
                value={nipc || ''}
                className="w-full px-3 py-2 bg-blue-50 border border-blue-200 rounded-xl text-xs font-mono font-bold text-blue-900"
              />
            </div>
          </div>

          {/* Row 2: Nama Lengkap */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Nama Lengkap Beserta Gelar <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: H. Budi Santoso, S.Pd"
              value={nama || ''}
              onChange={(e) => setNama(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Row 3: Jabatan Pengurus */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Jabatan Pengurus <span className="text-rose-500">*</span>
            </label>
            <select
              value={jabatanPengurus}
              onChange={(e) => setJabatanPengurus(e.target.value as JabatanPengurus)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-blue-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {JABATAN_LIST.map((jab) => (
                <option key={jab} value={jab}>
                  {jab}
                </option>
              ))}
            </select>
          </div>

          {/* Row 4: No WA */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Nomor WhatsApp Aktif <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              required
              placeholder="Contoh: 0859-4400-4657"
              value={noWa || ''}
              onChange={(e) => setNoWa(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Row 5: Alamat Domisili */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Alamat Domisili Pengurus <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={2}
              placeholder="Contoh: Dsn. Japanan Kidul RT 02 RW 01, Kec. Kemlagi, Kab. Mojokerto"
              value={alamat || ''}
              onChange={(e) => setAlamat(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Row 6: Input Foto */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Input Foto Pengurus Club
            </label>
            <div className="flex items-center gap-3">
              <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl cursor-pointer bg-slate-50 hover:bg-blue-50/50 transition">
                <Upload className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-slate-600 font-medium">Unggah Pas Foto Pengurus</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>

              {previewUrl && (
                <div className="w-14 h-16 rounded-lg overflow-hidden border border-slate-300 shrink-0 bg-slate-100">
                  <img src={previewUrl} alt="Foto Pengurus" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isEditMode ? <Edit3 className="w-4 h-4" /> : <Send className="w-4 h-4" />}
              {isSubmitting
                ? 'Menyimpan...'
                : isEditMode
                ? 'Simpan Perubahan Pengurus'
                : 'Kirim Data Pengurus'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
