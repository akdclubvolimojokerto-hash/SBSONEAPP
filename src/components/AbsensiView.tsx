import React, { useState } from 'react';
import {
  DataAbsen,
  DataMurid,
  StatusAbsen,
  User,
} from '../types';
import {
  ClipboardCheck,
  Plus,
  Calendar,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  XCircle,
  Send,
  X,
  Printer,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface AbsensiViewProps {
  absenList: DataAbsen[];
  muridList: DataMurid[];
  currentUser: User | null;
  onAddAbsen: (absen: DataAbsen) => Promise<void>;
  onOpenExport: (data: DataAbsen[]) => void;
}

const STATUS_CONFIG: Record<
  StatusAbsen,
  { label: string; bg: string; text: string; fullText: string }
> = {
  '.': { label: '.', bg: 'bg-emerald-100 border-emerald-300', text: 'text-emerald-800', fullText: 'Hadir' },
  S: { label: 'S', bg: 'bg-blue-100 border-blue-300', text: 'text-blue-800', fullText: 'Sakit' },
  I: { label: 'I', bg: 'bg-amber-100 border-amber-300', text: 'text-amber-800', fullText: 'Izin' },
  A: { label: 'A', bg: 'bg-rose-100 border-rose-300', text: 'text-rose-800', fullText: 'Alpa' },
  L: { label: 'L', bg: 'bg-slate-200 border-slate-300', text: 'text-slate-700', fullText: 'Libur' },
};

export const AbsensiView: React.FC<AbsensiViewProps> = ({
  absenList,
  muridList,
  currentUser,
  onAddAbsen,
  onOpenExport,
}) => {
  const [showCalendar, setShowCalendar] = useState<boolean>(true);
  const [selectedBulan, setSelectedBulan] = useState<string>('2026-09');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [tanggalWaktu, setTanggalWaktu] = useState('');
  const [selectedMuridId, setSelectedMuridId] = useState('');
  const [status, setStatus] = useState<StatusAbsen>('.');
  const [tanggalHari, setTanggalHari] = useState<number>(new Date().getDate());
  const [keterangan, setKeterangan] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canEdit = currentUser?.role === 'Admin' || currentUser?.role === 'Pengurus';

  const handleOpenModal = () => {
    const now = new Date();
    setTanggalWaktu(now.toISOString().slice(0, 19).replace('T', ' '));
    setTanggalHari(now.getDate());
    if (muridList.length > 0) {
      setSelectedMuridId(muridList[0].id);
    }
    setStatus('.');
    setKeterangan('');
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
    const newAbsen: DataAbsen = {
      id: `abs-${Date.now()}`,
      tanggalWaktu: tanggalWaktu || new Date().toISOString().slice(0, 19).replace('T', ' '),
      noKodeMurid: murid.noKodeMurid,
      nama: murid.nama,
      status: status,
      bulanTahun: selectedBulan,
      tanggalHari: Number(tanggalHari),
      keterangan: keterangan,
    };

    await onAddAbsen(newAbsen);
    setIsSubmitting(false);
    setIsModalOpen(false);
  };

  // Quick batch attend helper for today
  const handleQuickMarkAllHadir = async () => {
    if (!canEdit) return;
    const confirm = window.confirm(
      `Apakah Anda yakin ingin mencatat status HADIR (.) untuk semua ${muridList.length} murid pada hari ini?`
    );
    if (!confirm) return;

    const todayDate = new Date().getDate();
    const nowStr = new Date().toISOString().slice(0, 19).replace('T', ' ');

    for (const murid of muridList) {
      await onAddAbsen({
        id: `abs-${Date.now()}-${murid.id}`,
        tanggalWaktu: nowStr,
        noKodeMurid: murid.noKodeMurid,
        nama: murid.nama,
        status: '.',
        bulanTahun: selectedBulan,
        tanggalHari: todayDate,
        keterangan: 'Presensi Otomatis Hadir',
      });
    }
    alert('Berhasil mencatat absensi Hadir untuk seluruh murid!');
  };

  // Parse days in chosen month (e.g. 30 days for Sep)
  const [yearStr, monthStr] = selectedBulan.split('-');
  const daysInMonth = new Date(Number(yearStr), Number(monthStr), 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-blue-700" />
            Fitur Absensi &amp; Rekap Bulanan Murid
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pencatatan kehadiran atlet binaan, status harian, dan matriks rekapitulasi lengkap
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Fitur Munculkan dan Sembunyikan Kalender (Wajib) */}
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl shadow-sm transition cursor-pointer"
          >
            {showCalendar ? <EyeOff className="w-3.5 h-3.5 text-slate-500" /> : <Eye className="w-3.5 h-3.5 text-blue-600" />}
            <span>{showCalendar ? 'Sembunyikan Kalender' : 'Munculkan Kalender'}</span>
          </button>

          <button
            onClick={() => onOpenExport(absenList)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-sm transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Cetak Rekap (JPG / PDF)
          </button>

          {canEdit ? (
            <button
              onClick={handleOpenModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Input Absen Murid
            </button>
          ) : (
            <div className="text-xs text-slate-400 italic bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              🔒 Input Khusus Admin &amp; Pengurus
            </div>
          )}
        </div>
      </div>

      {/* Filter Month & Legend Box */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Month Selector */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Bulan Rekap:
          </label>
          <input
            type="month"
            value={selectedBulan}
            onChange={(e) => setSelectedBulan(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Legend: Keterangan : L= Libur,S= Sakit,I=izin, A=Alpa, .=Hadir */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-slate-500 text-[11px] uppercase mr-1">Keterangan:</span>
          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-bold border border-emerald-300 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <strong>.</strong> = Hadir
          </span>
          <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-900 font-bold border border-blue-300 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <strong>S</strong> = Sakit
          </span>
          <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold border border-amber-300 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-600"></span>
            <strong>I</strong> = Izin
          </span>
          <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-900 font-bold border border-rose-300 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-600"></span>
            <strong>A</strong> = Alpa
          </span>
          <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-800 font-bold border border-slate-300 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-600"></span>
            <strong>L</strong> = Libur
          </span>

          {canEdit && (
            <button
              onClick={handleQuickMarkAllHadir}
              className="ml-2 px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[11px] font-bold shadow-sm transition cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              Set Semua Hadir Hari Ini
            </button>
          )}
        </div>
      </div>

      {/* KALENDER BULANAN & MATRIKS REKAP ABSEN SEMUA MURID */}
      {showCalendar && (
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-700" />
                Matriks Rekapitulasi Presensi Atlet Binaan ({selectedBulan})
              </h3>
              <p className="text-[11px] text-slate-500">
                Geser secara horizontal untuk melihat tanggal 1 hingga {daysInMonth}
              </p>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full">
              Total {muridList.length} Murid
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300 text-[11px]">
                  <th className="py-2.5 px-3 border-r border-slate-200 sticky left-0 bg-slate-100 z-10 w-12 text-center">
                    No
                  </th>
                  <th className="py-2.5 px-3 border-r border-slate-200 sticky left-12 bg-slate-100 z-10 w-24">
                    Kode Murid
                  </th>
                  <th className="py-2.5 px-3 border-r border-slate-200 sticky left-36 bg-slate-100 z-10 min-w-[150px]">
                    Nama Murid
                  </th>

                  {/* Days 1..31 header columns */}
                  {daysArray.map((day) => {
                    const dateObj = new Date(Number(yearStr), Number(monthStr) - 1, day);
                    const dayOfWeek = dateObj.getDay();
                    const isSunday = dayOfWeek === 0;
                    return (
                      <th
                        key={day}
                        className={`py-2 px-1 text-center border-r border-slate-200 w-7 ${
                          isSunday ? 'bg-rose-50 text-rose-700 font-black' : 'text-slate-700'
                        }`}
                        title={`Tanggal ${day} ${selectedBulan}`}
                      >
                        {day}
                      </th>
                    );
                  })}

                  <th className="py-2.5 px-2 text-center border-r border-slate-200 bg-emerald-50 text-emerald-800 font-bold w-12">
                    Hadir (.)
                  </th>
                  <th className="py-2.5 px-2 text-center border-r border-slate-200 bg-blue-50 text-blue-800 font-bold w-10">
                    S
                  </th>
                  <th className="py-2.5 px-2 text-center border-r border-slate-200 bg-amber-50 text-amber-800 font-bold w-10">
                    I
                  </th>
                  <th className="py-2.5 px-2 text-center bg-rose-50 text-rose-800 font-bold w-10">
                    A
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {muridList.map((murid, idx) => {
                  // Find all attendance records for this student in this month
                  const studentRecords = absenList.filter(
                    (a) =>
                      a.noKodeMurid === murid.noKodeMurid &&
                      (a.bulanTahun === selectedBulan || a.tanggalWaktu.startsWith(selectedBulan))
                  );

                  let countHadir = 0;
                  let countSakit = 0;
                  let countIzin = 0;
                  let countAlpa = 0;

                  return (
                    <tr key={murid.id} className="hover:bg-slate-50 transition">
                      <td className="py-2 px-3 text-center text-slate-500 font-mono border-r border-slate-200 sticky left-0 bg-white z-10">
                        {idx + 1}
                      </td>
                      <td className="py-2 px-3 font-mono font-bold text-blue-900 border-r border-slate-200 sticky left-12 bg-white z-10 text-[11px]">
                        {murid.noKodeMurid}
                      </td>
                      <td className="py-2 px-3 font-semibold text-slate-800 border-r border-slate-200 sticky left-36 bg-white z-10 truncate max-w-[160px]">
                        {murid.nama}
                      </td>

                      {/* Render day cells */}
                      {daysArray.map((day) => {
                        const rec = studentRecords.find((r) => r.tanggalHari === day);
                        const statusVal: StatusAbsen | null = rec ? rec.status : null;

                        if (statusVal === '.') countHadir++;
                        else if (statusVal === 'S') countSakit++;
                        else if (statusVal === 'I') countIzin++;
                        else if (statusVal === 'A') countAlpa++;

                        const cfg = statusVal ? STATUS_CONFIG[statusVal] : null;

                        return (
                          <td
                            key={day}
                            className="py-1 px-0.5 text-center border-r border-slate-200"
                          >
                            {cfg ? (
                              <span
                                className={`inline-block w-5 h-5 leading-5 rounded text-[10px] font-black ${cfg.bg} ${cfg.text}`}
                                title={`${murid.nama} tgl ${day}: ${cfg.fullText} ${rec?.keterangan ? `(${rec.keterangan})` : ''}`}
                              >
                                {cfg.label}
                              </span>
                            ) : (
                              <span className="text-slate-300 text-[10px]">-</span>
                            )}
                          </td>
                        );
                      })}

                      {/* Total counters */}
                      <td className="py-2 px-2 text-center font-bold text-emerald-800 bg-emerald-50/50 border-r border-slate-200">
                        {countHadir}
                      </td>
                      <td className="py-2 px-2 text-center font-bold text-blue-800 bg-blue-50/50 border-r border-slate-200">
                        {countSakit}
                      </td>
                      <td className="py-2 px-2 text-center font-bold text-amber-800 bg-amber-50/50 border-r border-slate-200">
                        {countIzin}
                      </td>
                      <td className="py-2 px-2 text-center font-bold text-rose-800 bg-rose-50/50">
                        {countAlpa}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* MODAL INPUT ABSEN */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ClipboardCheck className="w-5 h-5 text-blue-300" />
                <div>
                  <h3 className="font-bold text-base">Input Presensi Atlet Murid</h3>
                  <p className="text-xs text-blue-200">
                    Google Sheets: <span className="font-mono">Data_Absen</span>
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
              {/* Tanggal & Waktu Otomatis */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Tanggal &amp; Waktu (Otomatis)
                </label>
                <input
                  type="text"
                  readOnly
                  value={tanggalWaktu || ''}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-xl text-xs font-mono text-slate-600"
                />
              </div>

              {/* Pilih Murid (Otomatis Mengambil NO KODE & NAMA dari Data_Murid) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Pilih Murid / Atlet Binaan
                </label>
                <select
                  value={selectedMuridId || ''}
                  onChange={(e) => setSelectedMuridId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {muridList.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.noKodeMurid} - {m.nama}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tanggal Hari (1-31) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Presensi Tanggal (Bulan {selectedBulan})
                </label>
                <input
                  type="number"
                  min={1}
                  max={daysInMonth}
                  value={tanggalHari ?? 1}
                  onChange={(e) => setTanggalHari(Number(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Status Absen Keterangan : L= Libur,S= Sakit,I=izin, A=Alpa, .=Hadir */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Status Presensi (Pilih Opsi)
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {(['.', 'S', 'I', 'A', 'L'] as StatusAbsen[]).map((st) => {
                    const cfg = STATUS_CONFIG[st];
                    const isSelected = status === st;
                    return (
                      <button
                        type="button"
                        key={st}
                        onClick={() => setStatus(st)}
                        className={`py-2 px-1 rounded-xl text-xs font-bold border transition flex flex-col items-center justify-center cursor-pointer ${
                          isSelected
                            ? `${cfg.bg} ${cfg.text} ring-2 ring-blue-700 shadow-sm`
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span className="text-base font-black leading-none">{cfg.label}</span>
                        <span className="text-[10px] mt-0.5">{cfg.fullText}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Keterangan Tambahan */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Keterangan / Alasan (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Izin ulangan sekolah, demam, dsb."
                  value={keterangan || ''}
                  onChange={(e) => setKeterangan(e.target.value)}
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
                  {isSubmitting ? 'Menyimpan...' : 'Kirim ke Data_Absen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
