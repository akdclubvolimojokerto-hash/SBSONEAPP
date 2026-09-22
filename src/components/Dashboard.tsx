import React, { useState, useEffect } from 'react';
import {
  DataKegiatan,
  DataMurid,
  DataPengurus,
  Keuangan,
  User,
} from '../types';
import {
  Plus,
  Users,
  UserCheck,
  Calendar,
  Wallet,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Image as ImageIcon,
  ChevronRight,
  Eye,
  Edit3,
} from 'lucide-react';

interface DashboardProps {
  kegiatanList: DataKegiatan[];
  muridList: DataMurid[];
  pengurusList: DataPengurus[];
  keuanganList: Keuangan[];
  currentUser: User | null;
  onOpenAddKegiatan: () => void;
  onEditKegiatan?: (kegiatan: DataKegiatan) => void;
  onNavigateTab: (tab: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  kegiatanList,
  muridList,
  pengurusList,
  keuanganList,
  currentUser,
  onOpenAddKegiatan,
  onEditKegiatan,
  onNavigateTab,
}) => {
  const [liveDateString, setLiveDateString] = useState<string>('');
  const [selectedPhoto, setSelectedPhoto] = useState<DataKegiatan | null>(null);

  // Compute live current date
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setLiveDateString(
        now.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      );
    };
    update();
    const timer = setInterval(update, 60000);
    return () => clearInterval(timer);
  }, []);

  // Compute stats automatically as requested:
  // 1. Jumlah Murid: Otomatis dari Data_Murid
  const totalMurid = muridList.length;

  // 2. Manager Club: Otomatis dari Data_Pengurus
  const managerObj = pengurusList.find(
    (p) => p.jabatanPengurus.toUpperCase() === 'MANAGER CLUB'
  );
  const managerName = managerObj ? managerObj.nama : 'H. Budi Santoso, S.Pd';

  // 4. Keuangan Club: Total saldo akhir
  const latestKeuangan =
    keuanganList.length > 0 ? keuanganList[keuanganList.length - 1].totalSaldo : 0;
  const formattedSaldo = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(latestKeuangan);

  // Permission check: Admin or Pengurus
  const canAddData =
    currentUser?.role === 'Admin' || currentUser?.role === 'Pengurus';
  const isAdmin = currentUser?.role === 'Admin';

  return (
    <div className="space-y-8">
      {/* HERO BANNER & STATS SECTION */}
      <section className="bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 rounded-3xl p-6 md:p-8 text-white shadow-xl border border-blue-900/40 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Sisi Kiri: Tulisan Selamat Datang + Badge Biru Transparan */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold tracking-wide backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Sistem Manajemen Resmi Klub Bola Voli Bintang Samudra</span>
            </div>

            {/* Tulisan Wajib: "Selamat Datang di System Aplikasi Bintang Samudra One" */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight uppercase">
              Selamat Datang di System Aplikasi Bintang Samudra One
            </h1>

            {/* Di bawahnya tulisan berbackground Biru Transparan sesuai spesifikasi */}
            <div className="p-4 rounded-2xl bg-blue-600/20 border border-blue-400/30 backdrop-blur-md text-blue-100 text-sm sm:text-base font-medium shadow-inner">
              Kelola Administrasi Volleyball Club Bintang Samudra dengan Lebih mudah,
              Rapi, dan Terorganisir
            </div>

            {/* Role indicator info */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Hak Akses Anda:{' '}
                <strong className="text-white font-bold uppercase">
                  {currentUser ? `${currentUser.username} (${currentUser.role})` : 'Tamu / Umum (Hanya Lihat)'}
                </strong>
              </span>
              {!canAddData && (
                <span className="text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2.5 py-0.5 rounded-full text-[11px]">
                  Mode Lihat: Input data hanya terbuka untuk Admin &amp; Pengurus
                </span>
              )}
            </div>
          </div>

          {/* Sisi Kanan: 4 Kartu Statistik Otomatis */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4">
            {/* 1. Jumlah Murid (Otomatis dari Data_Murid) */}
            <div
              onClick={() => onNavigateTab('murid')}
              className="bg-white/10 hover:bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/10 transition cursor-pointer group"
            >
              <div className="flex items-center justify-between text-blue-300 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Jumlah Murid
                </span>
                <Users className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">
                {totalMurid}
              </div>
              <p className="text-[10px] text-blue-200/80 mt-1">
                Atlet Binaan Terdaftar
              </p>
            </div>

            {/* 2. Manager Club (Otomatis dari Data_Pengurus) */}
            <div
              onClick={() => onNavigateTab('pengurus')}
              className="bg-white/10 hover:bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/10 transition cursor-pointer group"
            >
              <div className="flex items-center justify-between text-amber-300 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Manager Club
                </span>
                <UserCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-sm font-bold text-white line-clamp-1">
                {managerName}
              </div>
              <p className="text-[10px] text-blue-200/80 mt-1">
                Pimpinan Klub Bintang Samudra
              </p>
            </div>

            {/* 3. Tanggal Live Hari Ini */}
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between text-sky-300 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Tanggal Live
                </span>
                <Calendar className="w-4 h-4" />
              </div>
              <div className="text-xs sm:text-sm font-bold text-white line-clamp-2">
                {liveDateString}
              </div>
              <p className="text-[10px] text-blue-200/80 mt-1 flex items-center gap-1">
                <Clock className="w-2.5 h-2.5 text-emerald-400" />
                Real Time Clock
              </p>
            </div>

            {/* 4. Keuangan Club */}
            <div
              onClick={() => onNavigateTab('keuangan')}
              className="bg-white/10 hover:bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/10 transition cursor-pointer group"
            >
              <div className="flex items-center justify-between text-emerald-300 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Keuangan Club
                </span>
                <Wallet className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-emerald-300 truncate">
                {formattedSaldo}
              </div>
              <p className="text-[10px] text-blue-200/80 mt-1">
                Saldo Kas Kasir Saat Ini
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* RANGKAIAN KEGIATAN & GALERI KEGIATAN SECTION */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-700" />
              Rangkaian &amp; Galeri Kegiatan Bintang Samudra
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Dokumentasi aktivitas latihan, sparing pertandingan, dan pembinaan klub
            </p>
          </div>

          {/* Tombol Tambah Data: Khusus Admin dan Pengurus Club */}
          {canAddData ? (
            <button
              onClick={onOpenAddKegiatan}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-md transition-all transform active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Tambah Data Kegiatan
            </button>
          ) : (
            <div className="text-xs text-slate-400 italic bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              🔒 Input Kegiatan Terkunci (Khusus Admin &amp; Pengurus)
            </div>
          )}
        </div>

        {/* Card Grid Kegiatan */}
        {kegiatanList.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-400">
            <ImageIcon className="w-12 h-12 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold">Belum ada data kegiatan yang diinput</p>
            {canAddData && (
              <button
                onClick={onOpenAddKegiatan}
                className="mt-3 text-xs text-blue-700 font-bold hover:underline cursor-pointer"
              >
                + Tambah Kegiatan Pertama
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kegiatanList.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col group"
              >
                {/* Image / Foto Kegiatan */}
                <div
                  className="relative h-48 sm:h-52 bg-slate-100 overflow-hidden cursor-pointer"
                  onClick={() => setSelectedPhoto(item)}
                >
                  <img
                    src={item.fotoUrl}
                    alt={item.judulKegiatan}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-xs text-white font-medium flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" /> Lihat Ukuran Penuh
                    </span>
                  </div>
                  <span className="absolute top-3 left-3 bg-slate-900/75 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-mono font-medium">
                    {item.tanggalWaktu}
                  </span>

                  {/* Floating Edit Button Khusus Admin */}
                  {isAdmin && onEditKegiatan && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditKegiatan(item);
                      }}
                      className="absolute top-3 right-3 bg-white/90 hover:bg-white text-blue-700 p-2 rounded-full shadow-md transition-all hover:scale-110 cursor-pointer z-10"
                      title="Edit Data Kegiatan (Khusus Admin)"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-blue-700 transition">
                      {item.judulKegiatan}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {item.uraianKegiatan}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>
                      Oleh: <strong className="text-slate-700 font-semibold">{item.createdBy}</strong>
                    </span>
                    <div className="flex items-center gap-2">
                      {/* Tombol Aksi Edit: Khusus Admin */}
                      {isAdmin && onEditKegiatan && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditKegiatan(item);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-blue-700 hover:text-white bg-blue-50 hover:bg-blue-600 rounded-lg transition-colors border border-blue-200 cursor-pointer shadow-xs"
                          title="Edit Kegiatan (Khusus Admin)"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedPhoto(item)}
                        className="text-blue-700 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        Detail <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Photo Detail Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="relative max-h-[60vh] bg-black">
              <img
                src={selectedPhoto.fotoUrl}
                alt={selectedPhoto.judulKegiatan}
                className="w-full h-full object-contain max-h-[60vh] mx-auto"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-3 right-3 p-1.5 bg-black/60 text-white hover:bg-black rounded-full transition cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-5 space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-slate-900">
                  {selectedPhoto.judulKegiatan}
                </h3>
                <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">
                  {selectedPhoto.tanggalWaktu}
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                {selectedPhoto.uraianKegiatan}
              </p>
              <div className="pt-2 flex justify-between items-center text-xs text-slate-500">
                <span>Diupload oleh: <strong>{selectedPhoto.createdBy}</strong></span>
                <div className="flex items-center gap-2">
                  {isAdmin && onEditKegiatan && (
                    <button
                      type="button"
                      onClick={() => {
                        const itemToEdit = selectedPhoto;
                        setSelectedPhoto(null);
                        onEditKegiatan(itemToEdit);
                      }}
                      className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition shadow-sm"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Kegiatan</span>
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedPhoto(null)}
                    className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
