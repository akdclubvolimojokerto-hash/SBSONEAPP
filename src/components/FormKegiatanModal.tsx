import React, { useState, useEffect } from 'react';
import { X, Calendar, Image as ImageIcon, Send, Upload, Sparkles, Check, Edit3 } from 'lucide-react';
import { DataKegiatan } from '../types';

interface FormKegiatanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (kegiatan: DataKegiatan) => Promise<void>;
  currentUserName: string;
  initialData?: DataKegiatan | null;
}

export const FormKegiatanModal: React.FC<FormKegiatanModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentUserName,
  initialData,
}) => {
  const [tanggalWaktu, setTanggalWaktu] = useState('');
  const [judulKegiatan, setJudulKegiatan] = useState('');
  const [uraianKegiatan, setUraianKegiatan] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = Boolean(initialData);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTanggalWaktu(initialData.tanggalWaktu || '');
        setJudulKegiatan(initialData.judulKegiatan || '');
        setUraianKegiatan(initialData.uraianKegiatan || '');
        setFotoUrl(initialData.fotoUrl || '');
        setPreviewUrl(
          initialData.fotoUrl ||
            'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&auto=format&fit=crop&q=80'
        );
      } else {
        const now = new Date();
        const formatted = now.toISOString().slice(0, 19).replace('T', ' ');
        setTanggalWaktu(formatted);
        setJudulKegiatan('');
        setUraianKegiatan('');
        setFotoUrl('');
        setPreviewUrl(
          'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&auto=format&fit=crop&q=80'
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
    if (!judulKegiatan.trim() || !uraianKegiatan.trim()) {
      alert('Harap isi Judul dan Uraian Kegiatan!');
      return;
    }

    setIsSubmitting(true);
    const updatedKegiatan: DataKegiatan = {
      id: initialData?.id || `keg-${Date.now()}`,
      tanggalWaktu:
        tanggalWaktu ||
        initialData?.tanggalWaktu ||
        new Date().toISOString().slice(0, 19).replace('T', ' '),
      judulKegiatan: judulKegiatan.trim(),
      uraianKegiatan: uraianKegiatan.trim(),
      fotoUrl:
        fotoUrl ||
        previewUrl ||
        initialData?.fotoUrl ||
        'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&auto=format&fit=crop&q=80',
      createdBy: initialData?.createdBy || currentUserName || 'Admin',
    };

    await onSubmit(updatedKegiatan);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl">
              {isEditMode ? (
                <Edit3 className="w-5 h-5 text-amber-300" />
              ) : (
                <Calendar className="w-5 h-5 text-blue-300" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-base">
                {isEditMode ? 'Edit Data Kegiatan' : 'Tambah Data Kegiatan Baru'}
              </h3>
              <p className="text-xs text-blue-200">
                {isEditMode
                  ? 'Perbarui dokumentasi dan informasi kegiatan klub'
                  : 'Form Input > Google Sheets: Data_Kegiatan'}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Tanggal & Waktu (Otomatis terisi) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Tanggal & Waktu (Otomatis Terisi)
            </label>
            <input
              type="text"
              readOnly
              value={tanggalWaktu || ''}
              className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-xl text-xs font-mono text-slate-600 cursor-not-allowed"
            />
          </div>

          {/* Judul Kegiatan */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Judul Kegiatan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Latihan Taktik Smash & Blok Bersama Tim Inti"
              value={judulKegiatan || ''}
              onChange={(e) => setJudulKegiatan(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Uraian Kegiatan */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Uraian Kegiatan <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="Jelaskan detail jalannya kegiatan, materi latihan, hasil pertandingan, atau evaluasi pelatih..."
              value={uraianKegiatan || ''}
              onChange={(e) => setUraianKegiatan(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Input Foto / Gambar Kegiatan */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Input Foto / Gambar Kegiatan
            </label>
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <label className="flex-1 w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl cursor-pointer bg-slate-50 hover:bg-blue-50/50 transition">
                <Upload className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-slate-600 font-medium">
                  Pilih File Foto (JPG / PNG)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {previewUrl && (
                <div className="w-24 h-16 rounded-lg overflow-hidden border border-slate-300 shrink-0 relative bg-slate-100">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-0 inset-x-0 bg-slate-900/60 text-[9px] text-white text-center py-0.5 font-medium">
                    Pratinjau
                  </span>
                </div>
              )}
            </div>

            {/* Quick Sample Image Selector */}
            <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Atau pilih preset foto:</span>
              <button
                type="button"
                onClick={() =>
                  setPreviewUrl(
                    'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&auto=format&fit=crop&q=80'
                  )
                }
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Pertandingan
              </button>
              •
              <button
                type="button"
                onClick={() =>
                  setPreviewUrl(
                    'https://images.unsplash.com/photo-1592656094267-764a45160876?w=800&auto=format&fit=crop&q=80'
                  )
                }
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Latihan Fisik
              </button>
              •
              <button
                type="button"
                onClick={() =>
                  setPreviewUrl(
                    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80'
                  )
                }
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Kerja Bakti
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isEditMode ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
              {isSubmitting
                ? 'Menyimpan ke Google Sheets...'
                : isEditMode
                ? 'Simpan Perubahan Kegiatan'
                : 'Kirim Data Kegiatan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
