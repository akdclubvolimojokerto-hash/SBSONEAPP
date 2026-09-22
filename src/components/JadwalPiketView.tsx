import React, { useState } from 'react';
import {
  JadwalPiket,
  DataMurid,
  HariLatihan,
  User,
} from '../types';
import {
  Brush,
  Calendar,
  Plus,
  Send,
  X,
  Printer,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Users,
} from 'lucide-react';

interface JadwalPiketViewProps {
  piketList: JadwalPiket[];
  muridList: DataMurid[];
  currentUser: User | null;
  onAddPiket: (piket: JadwalPiket) => Promise<void>;
  onOpenExport: (data: JadwalPiket[]) => void;
}

const HARI_LIST: HariLatihan[] = ['SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT'];

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

export const JadwalPiketView: React.FC<JadwalPiketViewProps> = ({
  piketList,
  muridList,
  currentUser,
  onAddPiket,
  onOpenExport,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMuridId, setSelectedMuridId] = useState('');
  const [hari, setHari] = useState<HariLatihan>('SENIN');
  const [piketDutyText, setPiketDutyText] = useState(
    'Membasahi lapangan dan Menyiapkan peralatan'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calendarYear, setCalendarYear] = useState<number>(new Date().getFullYear());

  const canEdit = currentUser?.role === 'Admin' || currentUser?.role === 'Pengurus';

  const handleOpenModal = () => {
    if (muridList.length > 0) {
      setSelectedMuridId(muridList[0].id);
    }
    setPiketDutyText('Membasahi lapangan dan Menyiapkan peralatan');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const murid = muridList.find((m) => m.id === selectedMuridId) || muridList[0];
    if (!murid) {
      alert('Pilih data murid terlebih dahulu!');
      return;
    }

    setIsSubmitting(true);
    const newPiket: JadwalPiket = {
      id: `pkt-${Date.now()}`,
      tanggalWaktu: new Date().toISOString().slice(0, 19).replace('T', ' '),
      noKodeMurid: murid.noKodeMurid,
      nama: murid.nama,
      hari: hari,
      piket: piketDutyText,
    };

    await onAddPiket(newPiket);
    setIsSubmitting(false);
    setIsModalOpen(false);
  };

  // Helper for generating month calendar days for piket
  const renderMiniCalendar = (monthIdx: number) => {
    const daysInMonth = new Date(calendarYear, monthIdx + 1, 0).getDate();
    const firstDayIndex = new Date(calendarYear, monthIdx, 1).getDay();
    const adjustedFirstDay = (firstDayIndex + 6) % 7;

    const cells = [];
    for (let i = 0; i < adjustedFirstDay; i++) {
      cells.push(<div key={`blank-${i}`} className="h-6 w-6"></div>);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dayOfWeek = (adjustedFirstDay + d - 1) % 7;
      const isWeekday = dayOfWeek >= 0 && dayOfWeek <= 4;

      cells.push(
        <div
          key={`day-${d}`}
          className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-medium transition ${
            isWeekday
              ? 'bg-amber-100 text-amber-900 font-bold hover:bg-amber-200'
              : 'text-slate-400'
          }`}
          title={isWeekday ? 'Hari Piket Lapangan' : 'Libur'}
        >
          {d}
        </div>
      );
    }

    return (
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-amber-300 transition">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-slate-800">
            {MONTH_NAMES[monthIdx]} {calendarYear}
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 font-semibold">
            Piket Sen-Jum
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
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Brush className="w-5 h-5 text-amber-600" />
            Jadwal Piket Kebersihan &amp; Lapangan Murid
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tugas harian atlet: Membasahi lapangan, menyiapkan bola, dan merapikan net latihan
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenExport(piketList)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-sm transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Cetak Jadwal Piket (JPG / PDF)
          </button>

          {canEdit ? (
            <button
              onClick={handleOpenModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Input Jadwal Piket
            </button>
          ) : (
            <div className="text-xs text-slate-400 italic bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              🔒 Input Khusus Admin &amp; Pengurus
            </div>
          )}
        </div>
      </div>

      {/* Grid: 5 Days (Senin s/d Jumat) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {HARI_LIST.map((hariName) => {
          const duties = piketList.filter((p) => p.hari === hariName);
          return (
            <div
              key={hariName}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <span className="px-3 py-1 rounded-lg bg-amber-600 text-white font-black text-xs tracking-wider uppercase">
                    {hariName}
                  </span>
                  <span className="text-[11px] font-medium text-slate-500">
                    {duties.length} Petugas Piket
                  </span>
                </div>

                {duties.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-6 text-center">
                    Belum ada petugas piket di hari {hariName}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {duties.map((duty) => (
                      <div
                        key={duty.id}
                        className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/80 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-amber-700" />
                            {duty.nama}
                          </span>
                          <span className="text-[10px] font-mono text-amber-900 bg-white px-1.5 py-0.5 rounded border border-amber-200 font-bold">
                            {duty.noKodeMurid}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-700 font-medium">
                          📋 {duty.piket}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 text-[10px] text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Wajib hadir 30 menit sebelum latihan dimulai</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* KALENDER KECIL REAL TIME 12 BULAN (Januari - Desember) */}
      <section className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-600" />
              Kalender Real Time Piket Tiap Bulan (Januari - Desember {calendarYear})
            </h3>
            <p className="text-xs text-slate-500">
              Hari berwarna oranye menandakan jadwal aktif piket murid binaan
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

        {/* 12 Month Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {MONTH_NAMES.map((_, idx) => (
            <div key={idx}>{renderMiniCalendar(idx)}</div>
          ))}
        </div>
      </section>

      {/* MODAL INPUT JADWAL PIKET */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-amber-700 to-amber-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Brush className="w-5 h-5 text-amber-200" />
                <div>
                  <h3 className="font-bold text-base">Input Jadwal Piket Murid</h3>
                  <p className="text-xs text-amber-100">
                    Google Sheets: <span className="font-mono">Jadwal_Piket</span>
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
              {/* Pilih Murid (NO KODE & NAMA otomatis terisi) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Pilih Murid (Otomatis Ambil dari Data_Murid)
                </label>
                <select
                  value={selectedMuridId || ''}
                  onChange={(e) => setSelectedMuridId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  {muridList.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.noKodeMurid} - {m.nama}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tampilan Otomatis Kode & Nama */}
              {(() => {
                const selected =
                  muridList.find((m) => m.id === selectedMuridId) || muridList[0];
                return (
                  <div className="grid grid-cols-2 gap-3 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs">
                    <div>
                      <span className="text-[10px] text-amber-800 font-bold uppercase block">
                        No Kode Murid (Otomatis):
                      </span>
                      <strong className="font-mono text-amber-950">
                        {selected?.noKodeMurid || '-'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-800 font-bold uppercase block">
                        Nama Murid:
                      </span>
                      <strong className="text-amber-950">
                        {selected?.nama || '-'}
                      </strong>
                    </div>
                  </div>
                );
              })()}

              {/* Hari Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Hari Piket (Dropdown: SENIN s/d JUMAT)
                </label>
                <select
                  value={hari || 'SENIN'}
                  onChange={(e) => setHari(e.target.value as HariLatihan)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-amber-500"
                >
                  {HARI_LIST.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>

              {/* PIKET (Otomatis terisi text 'Membasahi lapangan dan Menyiapkan peralatan') */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Deskripsi Tugas Piket (Otomatis Terisi)
                </label>
                <input
                  type="text"
                  required
                  value={piketDutyText || ''}
                  onChange={(e) => setPiketDutyText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Menyimpan...' : 'Kirim ke Jadwal_Piket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
