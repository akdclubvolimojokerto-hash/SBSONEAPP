import React, { useState, useEffect, useRef } from 'react';
import { Image, Link2, Upload, RotateCcw, Check, X, Eye, Lock, ShieldAlert } from 'lucide-react';
import logoBsDefault from '../assets/images/LogoBS.jpg';
import { PbvsiLogo } from './Logos';
import { User } from '../types';

interface LogoSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveToast?: (title: string, desc: string) => void;
  currentUser?: User | null;
  isAdmin?: boolean;
  initialTarget?: 'club' | 'pbvsi';
}

export const LogoSettingsModal: React.FC<LogoSettingsModalProps> = ({
  isOpen,
  onClose,
  onSaveToast,
  currentUser,
  isAdmin,
  initialTarget = 'club',
}) => {
  const [activeLogoTab, setActiveLogoTab] = useState<'club' | 'pbvsi'>(initialTarget);
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [pbvsiUrl, setPbvsiUrl] = useState<string>('');
  const [previewError, setPreviewError] = useState(false);
  const [pbvsiPreviewError, setPbvsiPreviewError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pbvsiFileInputRef = useRef<HTMLInputElement>(null);

  const userFromStorage = (() => {
    try {
      const raw = localStorage.getItem('bs_one_current_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const effectiveIsAdmin =
    typeof isAdmin === 'boolean'
      ? isAdmin
      : currentUser?.role === 'Admin' || userFromStorage?.role === 'Admin';

  useEffect(() => {
    if (isOpen) {
      setActiveLogoTab(initialTarget);
      const savedClub = localStorage.getItem('bs_club_logo_url');
      setLogoUrl(savedClub || logoBsDefault);
      const savedPbvsi = localStorage.getItem('pbvsi_logo_url');
      setPbvsiUrl(savedPbvsi || '/logopbvsi.png');
      setPreviewError(false);
      setPbvsiPreviewError(false);
    }
  }, [isOpen, initialTarget]);

  if (!isOpen) return null;

  // Jika bukan Admin, tampilkan jendela akses ditolak
  if (!effectiveIsAdmin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
          <div className="px-6 py-4 bg-gradient-to-r from-red-800 to-rose-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-white/10 rounded-xl">
                <Lock className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Akses Khusus Admin</h3>
                <p className="text-[11px] text-red-200">Pengaturan Logo Klub Terkunci</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto border border-red-200">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Hanya Admin yang Berwenang</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Jendela pengaturan perubahan logo resmi klub Bintang Samudra dan logo PBVSI hanya dapat dibuka dan diubah oleh akun dengan hak akses <strong>Admin</strong>.
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-md"
              >
                Mengerti &amp; Tutup
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar yang valid (PNG, JPG, SVG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result) {
        setLogoUrl(result);
        setPreviewError(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePbvsiFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar yang valid (PNG, JPG, SVG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result) {
        setPbvsiUrl(result);
        setPbvsiPreviewError(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!effectiveIsAdmin) {
      alert('Akses Ditolak: Hanya Admin yang dapat mengubah logo!');
      return;
    }

    if (activeLogoTab === 'club') {
      if (logoUrl.trim()) {
        localStorage.setItem('bs_club_logo_url', logoUrl.trim());
      } else {
        localStorage.removeItem('bs_club_logo_url');
      }
      window.dispatchEvent(new Event('bs_logo_changed'));
      if (onSaveToast) {
        onSaveToast('Logo Klub Diperbarui', 'Logo klub pada Navbar dan Kop Surat cetak telah diperbarui.');
      }
    } else {
      if (pbvsiUrl.trim()) {
        localStorage.setItem('pbvsi_logo_url', pbvsiUrl.trim());
      } else {
        localStorage.removeItem('pbvsi_logo_url');
      }
      window.dispatchEvent(new Event('pbvsi_logo_changed'));
      if (onSaveToast) {
        onSaveToast('Logo PBVSI Diperbarui', 'Logo PBVSI pada Kop Surat resmi telah diperbarui.');
      }
    }
    onClose();
  };

  const handleResetDefault = () => {
    if (activeLogoTab === 'club') {
      setLogoUrl(logoBsDefault);
      setPreviewError(false);
    } else {
      setPbvsiUrl('/logopbvsi.png');
      setPbvsiPreviewError(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <Image className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Pengaturan Link Logo</h3>
              <p className="text-xs text-blue-200">
                Ubah gambar/link logo Resmi Klub dan Logo PBVSI untuk Kop Surat Cetak
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Logo Klub vs Logo PBVSI */}
        <div className="flex border-b border-slate-200 bg-slate-100/80 px-6 pt-3 gap-2">
          <button
            type="button"
            onClick={() => setActiveLogoTab('club')}
            className={`pb-2.5 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
              activeLogoTab === 'club'
                ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Logo Klub Bintang Samudra</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">
              Kanan Kop / Navbar
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveLogoTab('pbvsi')}
            className={`pb-2.5 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
              activeLogoTab === 'pbvsi'
                ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Logo PBVSI Pusat</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
              Kiri Kop Surat
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {activeLogoTab === 'club' ? (
            /* TAB LOGO KLUB BINTANG SAMUDRA */
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Tautan / Link URL Gambar Logo Klub:
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Link2 className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={logoUrl}
                    onChange={(e) => {
                      setLogoUrl(e.target.value);
                      setPreviewError(false);
                    }}
                    placeholder="https://... atau path gambar"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent font-mono text-slate-800"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Masukkan link gambar logo klub atau unggah langsung file gambar dari perangkat Anda.
                </p>
              </div>

              {/* Tombol Aksi Cepat */}
              <div className="flex flex-wrap gap-2 pt-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors border border-slate-300 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-blue-600" />
                  Unggah File Gambar Klub
                </button>
                <button
                  type="button"
                  onClick={handleResetDefault}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors border border-blue-200 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
                  Reset Logo Bawaan (LogoBS.jpg)
                </button>
              </div>
            </div>
          ) : (
            /* TAB LOGO PBVSI */
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Tautan / Link URL Gambar Logo PBVSI:
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Link2 className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={pbvsiUrl}
                    onChange={(e) => {
                      setPbvsiUrl(e.target.value);
                      setPbvsiPreviewError(false);
                    }}
                    placeholder="https://... atau path gambar"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent font-mono text-slate-800"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Masukkan tautan URL logo PBVSI baru atau gunakan file gambar yang baru saja diunggah.
                </p>
              </div>

              {/* Tombol Aksi Cepat PBVSI */}
              <div className="flex flex-wrap gap-2 pt-1">
                <input
                  type="file"
                  ref={pbvsiFileInputRef}
                  onChange={handlePbvsiFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => pbvsiFileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors border border-slate-300 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-blue-600" />
                  Unggah File Logo PBVSI
                </button>
                <button
                  type="button"
                  onClick={handleResetDefault}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors border border-emerald-200 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
                  Gunakan Logo Resmi PBVSI (logopbvsi.png)
                </button>
              </div>
            </div>
          )}

          {/* Pratinjau Tampilan */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <Eye className="w-4 h-4 text-slate-500" />
              Pratinjau Hasil Kop Surat Resmi Cetak (A4)
            </div>

            {/* Preview: Kop Surat Resmi Cetak */}
            <div className="bg-white border border-slate-300 p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between gap-3 border-b-2 border-slate-900 pb-2">
                {/* Logo Kiri (PBVSI) */}
                <div className="w-16 h-14 shrink-0 flex items-center justify-center p-1 bg-white">
                  {pbvsiPreviewError || !pbvsiUrl ? (
                    <PbvsiLogo className="w-12 h-12" forceVector />
                  ) : (
                    <img
                      src={pbvsiUrl}
                      alt="Logo PBVSI"
                      className="max-h-12 max-w-[60px] object-contain"
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                      onError={() => setPbvsiPreviewError(true)}
                    />
                  )}
                </div>

                {/* Teks Kop Tengah */}
                <div className="flex-1 text-center font-sans">
                  <div className="text-[8.5px] font-bold text-slate-700">PERSATUAN BOLA VOLI SELURUH INDONESIA</div>
                  <div className="text-[10px] font-extrabold text-slate-900">CLUB BOLA VOLI</div>
                  <div className="text-sm font-black text-blue-900">BINTANG SAMUDRA</div>
                </div>

                {/* Logo Kanan (Klub BS) */}
                <div className="w-16 h-14 shrink-0 flex items-center justify-center p-1 bg-white">
                  {previewError || !logoUrl ? (
                    <div className="text-[9px] text-red-500 text-center font-medium">Gagal muat</div>
                  ) : (
                    <img
                      src={logoUrl}
                      alt="Pratinjau Logo Kop Surat"
                      className="max-h-12 max-w-[65px] object-contain"
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                      onError={() => setPreviewError(true)}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            Simpan &amp; Terapkan Logo {activeLogoTab === 'club' ? 'Klub' : 'PBVSI'}
          </button>
        </div>
      </div>
    </div>
  );
};
