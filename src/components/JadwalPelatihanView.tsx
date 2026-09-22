import React, { useState } from 'react';
import {
  JadwalPelatihan,
  DataPengurus,
  User,
  HariLatihan,
} from '../types';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  UserCheck,
  MapPin,
  Send,
  X,
  Printer,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

interface JadwalPelatihanViewProps {
  jadwalList: JadwalPelatihan[];
  pengurusList: DataPengurus[];
  currentUser: User | null;
  onAddJadwal: (jadwal: JadwalPelatihan) => Promise<void>;
  onOpenExport: (data: JadwalPelatihan[]) => void;
}

const HARI_OPTIONS: HariLatihan[] = ['SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT'];

const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

export const JadwalPelatihanView: React.FC<JadwalPelatihanViewProps> = ({
  jadwalList,
  pengurusList,
  currentUser,
  onAddJadwal,
  onOpenExport,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPengurusId, setSelectedPengurusId] = useState<string>('');
  const [hari, setHari] = useState<HariLatihan>('SENIN');
  const [jamMulai, setJamMulai] = useState('15:30');
  const [jamSelesai, setJamSelesai] = useState('18:00');
  const [lokasi, setLokasi] = useState('Lapangan Utama Bintang Samudra Kemlagi');
  const [catatan, setCatatan] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 12-Month calendar active year
  const [calendarYear, setCalendarYear] = useState<number>(new Date().getFullYear());
  const [selectedMonthIdx, setSelectedMonthIdx] = useState<number>(new Date().getMonth());

  const canEdit = currentUser?.role === 'Admin' || currentUser?.role === 'Pengurus';

  // Find coaches/pengurus
  const availableCoaches = pengurusList.filter(
    (p) =>
      p.jabatanPengurus.includes('COACH') ||
      p.jabatanPengurus.includes('MANAGER') ||
      p.jabatanPengurus.includes('KEBUGARAN') ||
      true
  );

  const handleOpenModal = () => {
    if (availableCoaches.length > 0) {
      setSelectedPengurusId(availableCoaches[0].id);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const coach = pengurusList.find((p) => p.id === selectedPengurusId) || availableCoaches[0];
    if (!coach) {
      alert('Pilih Pengurus / Coach terlebih dahulu!');
      return;
    }

    setIsSubmitting(true);
    const newJadwal: JadwalPelatihan = {
      id: `jdw-${Date.now()}`,
      tanggalWaktu: new Date().toISOString().slice(0, 19).replace('T', ' '),
      nipc: coach.nipc,
      nama: coach.nama,
      bidangKepengurusan: coach.jabatanPengurus,
      hari: hari,
      jam: `${jamMulai} - ${jamSelesai} WIB`,
      lokasi: lokasi,
      catatan: catatan,
    };

    await onAddJadwal(newJadwal);
    setIsSubmitting(false);
    setIsModalOpen(false);
    setCatatan('');
  };

  // Helper for generating month calendar days
  const renderMiniCalendar = (monthIdx: number) => {
    const daysInMonth = new Date(calendarYear, monthIdx + 1, 0).getDate();
    const firstDayIndex = new Date(calendarYear, monthIdx, 1).getDay(); // 0 is Sunday
    // Adjust so 0 is Monday: (day + 6) % 7
    const adjustedFirstDay = (firstDayIndex + 6) % 7;

    const cells = [];
    // Blank prefix cells
    for (let i = 0; i < adjustedFirstDay; i++) {
      cells.push(<div key={`blank-${i}`} className="h-6 w-6"></div>);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dayOfWeek = (adjustedFirstDay + d - 1) % 7; // 0: Sen, 1: Sel, 2: Rab, 3: Kam, 4: Jum, 5: Sab, 6: Min
      const isTrainingDay = dayOfWeek >= 0 && dayOfWeek <= 4; // Senin - Jumat latihan

      cells.push(
        <div
          key={`day-${d}`}
          className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-medium transition ${
            isTrainingDay
              ? 'bg-blue-100 text-blue-900 font-bold hover:bg-blue-200'
              : 'text-slate-400'
          }`}
          title={isTrainingDay ? 'Hari Latihan Resmi Club BS One' : 'Hari Libur'}
        >
          {d}
        </div>
      );
    }

    return (
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-slate-800">
            {MONTH_NAMES[monthIdx]} {calendarYear}
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">
            Sen-Jum
          </span>
        </div>
        <div className="grid grid-cols-7 gap-0.5 text-center mb-1 text-[9px] font-bold text-slate-400">
          <span>Sn</span>
          <span>Sl</span>
          <span>Rb</span>
          <span>Km</span>
          <span>Jm</span>
          <span>Sb</span>
          <span>Mg</span>
        </div>
        <div className="grid grid-cols-7 gap-0.5 place-items-center">{cells}</div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-blue-700" />
            Jadwal Pelatihan Volleyball Club Bintang Samudra
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Agenda sesi latihan intensif, pembagian hari, pelatih pengampu, dan kalender tahunan
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenExport(jadwalList)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-sm transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Cetak Jadwal (JPG / PDF)
          </button>

          {canEdit ? (
            <button
              onClick={handleOpenModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Tambah Jadwal Pelatihan
            </button>
          ) : (
            <div className="text-xs text-slate-400 italic bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              🔒 Input Khusus Admin &amp; Pengurus
            </div>
          )}
        </div>
      </div>

      {/* Grid: Daily Schedules (Senin - Jumat) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {HARI_OPTIONS.map((hariName) => {
          const sessions = jadwalList.filter((j) => j.hari === hariName);
          return (
            <div
              key={hariName}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <span className="px-2.5 py-1 rounded-lg bg-blue-900 text-white font-black text-xs tracking-wider uppercase">
                    {hariName}
                  </span>
                  <span className="text-[11px] font-medium text-slate-500">
                    {sessions.length} Sesi Terjadwal
                  </span>
                </div>

                {sessions.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-4 text-center">
                    Belum ada jadwal latihan di hari {hariName}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {sessions.map((sesi) => (
                      <div
                        key={sesi.id}
                        className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                            <UserCheck className="w-3.5 h-3.5 text-blue-700" />
                            {sesi.nama}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                            {sesi.nipc}
                          </span>
                        </div>
                        <div className="text-[11px] text-blue-800 font-semibold">
                          {sesi.bidangKepengurusan}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-700 font-medium pt-1">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>{sesi.jam}</span>
                        </div>
                        {sesi.catatan && (
                          <p className="text-[11px] text-slate-500 italic pt-0.5">
                            Fokus: {sesi.catatan}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 text-[10px] text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-rose-500" />
                <span>Lapangan Bintang Samudra Kemlagi</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* KALENDER KECIL 12 BULAN (JANUARI - DESEMBER) */}
      <section className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-blue-700" />
              Kalender Latihan Tiap Bulan (Januari - Desember {calendarYear})
            </h3>
            <p className="text-xs text-slate-500">
              Hari berwarna biru menunjukkan jadwal rutin latihan (Senin s/d Jumat)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCalendarYear((prev) => prev - 1)}
              className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold text-xs text-slate-800 font-mono px-2">
              Tahun {calendarYear}
            </span>
            <button
              onClick={() => setCalendarYear((prev) => prev + 1)}
              className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 12 Bulan Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {MONTH_NAMES.map((_, idx) => (
            <div key={idx}>{renderMiniCalendar(idx)}</div>
          ))}
        </div>
      </section>

      {/* MODAL INPUT JADWAL PELATIHAN */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CalendarIcon className="w-5 h-5 text-blue-300" />
                <div>
                  <h3 className="font-bold text-base">Input Jadwal Pelatihan Baru</h3>
                  <p className="text-xs text-blue-200">
                    Tersimpan di Google Sheets: <span className="font-mono">Jadwal_Pelatihan</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Pilih Coach dari Data_Pengurus */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Pilih Pelatih / Coach (Otomatis Ambil dari Data_Pengurus)
                </label>
                <select
                  value={selectedPengurusId}
                  onChange={(e) => setSelectedPengurusId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {pengurusList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nama} ({p.jabatanPengurus}) - {p.nipc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tampilan Otomatis NIPC & Bidang */}
              {(() => {
                const selected =
                  pengurusList.find((p) => p.id === selectedPengurusId) || pengurusList[0];
                return (
                  <div className="grid grid-cols-2 gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs">
                    <div>
                      <span className="text-[10px] text-blue-800 font-bold uppercase block">
                        NIPC Otomatis:
                      </span>
                      <strong className="font-mono text-blue-950">
                        {selected?.nipc || '-'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-blue-800 font-bold uppercase block">
                        Bidang Kepengurusan:
                      </span>
                      <strong className="text-blue-950">
                        {selected?.jabatanPengurus || '-'}
                      </strong>
                    </div>
                  </div>
                );
              })()}

              {/* Hari Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Hari Latihan (Dropdown: SENIN s/d JUMAT)
                </label>
                <select
                  value={hari}
                  onChange={(e) => setHari(e.target.value as HariLatihan)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {HARI_OPTIONS.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>

              {/* Jam: Real time selector with Clock Icon */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  Pilih Jam Latihan (Mulai &amp; Selesai)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-0.5">Jam Mulai:</span>
                    <input
                      type="time"
                      required
                      value={jamMulai || ''}
                      onChange={(e) => setJamMulai(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-0.5">Jam Selesai:</span>
                    <input
                      type="time"
                      required
                      value={jamSelesai || ''}
                      onChange={(e) => setJamSelesai(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Catatan / Materi Latihan */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Uraian Materi / Catatan Latihan
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Drill jump serve, rotasi posisi 4 &amp; 2, defense spike"
                  value={catatan || ''}
                  onChange={(e) => setCatatan(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Menyimpan...' : 'Kirim ke Jadwal_Pelatihan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
