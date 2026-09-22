import React, { useState, useEffect } from 'react';
import {
  X,
  UserPlus,
  Send,
  Upload,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Edit3,
  Calendar,
  CalendarDays,
  Check,
  MapPin,
  Clock,
} from 'lucide-react';
import { DataMurid, JenisKelamin, User } from '../types';

export const generateRandomKodeMurid = () => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `BSM-${randomNum}`;
};

export const POSISI_VOLI_OPTIONS = [
  'Open Spike',
  'Opposite Hitter',
  'Middle Blocker',
  'Setter',
  'Libero',
  'Universal / All-Round',
];

export const BULAN_INDONESIA = [
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

export const KOTA_POPULER = [
  'Mojokerto',
  'Surabaya',
  'Sidoarjo',
  'Jombang',
  'Gresik',
  'Malang',
  'Kediri',
  'Pasuruan',
];

const parseCurrentTempatTanggal = (val: string) => {
  if (!val) {
    return {
      kota: 'Mojokerto',
      hari: 14,
      bulan: 4, // Mei (0-indexed)
      tahun: 2008,
      isoDate: '2008-05-14',
    };
  }
  const parts = val.split(',');
  const kota = parts[0] ? parts[0].trim() : 'Mojokerto';
  const rest = parts.length > 1 ? parts.slice(1).join(',').trim() : '';

  let hari = 14;
  let bulan = 4;
  let tahun = 2008;

  if (rest) {
    const tokens = rest.split(/\s+/);
    if (tokens.length >= 3) {
      const d = parseInt(tokens[0], 10);
      const mIdx = BULAN_INDONESIA.findIndex(
        (b) => b.toLowerCase() === tokens[1].toLowerCase()
      );
      const y = parseInt(tokens[2], 10);
      if (!isNaN(d) && d >= 1 && d <= 31) hari = d;
      if (mIdx >= 0) bulan = mIdx;
      if (!isNaN(y) && y >= 1970 && y <= 2030) tahun = y;
    } else {
      const parsed = new Date(rest);
      if (!isNaN(parsed.getTime())) {
        hari = parsed.getDate();
        bulan = parsed.getMonth();
        tahun = parsed.getFullYear();
      }
    }
  }

  const mm = String(bulan + 1).padStart(2, '0');
  const dd = String(hari).padStart(2, '0');
  return {
    kota: kota || 'Mojokerto',
    hari,
    bulan,
    tahun,
    isoDate: `${tahun}-${mm}-${dd}`,
  };
};

interface FormMuridModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (murid: DataMurid) => Promise<void>;
  nextKodeMurid?: string;
  currentUser?: User | null;
  muridCount?: number;
  initialData?: DataMurid | null;
}

export const FormMuridModal: React.FC<FormMuridModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  nextKodeMurid,
  currentUser,
  muridCount,
  initialData,
}) => {
  const isEditMode = Boolean(initialData);

  const [tanggalWaktu, setTanggalWaktu] = useState('');
  const [noKodeMurid, setNoKodeMurid] = useState('');
  const [nama, setNama] = useState('');
  const [posisiBermain, setPosisiBermain] = useState('Open Spike');
  const [tempatTanggalLahir, setTempatTanggalLahir] = useState('');
  const [tinggiBeratBadan, setTinggiBeratBadan] = useState('');
  const [alamat, setAlamat] = useState('');
  const [noWhatsapp, setNoWhatsapp] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState<JenisKelamin>('Laki - Laki');
  const [fotoUrl, setFotoUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Date Picker Modal ("Jendela Pilih Tanggal Lahir") State
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [pickerKota, setPickerKota] = useState('Mojokerto');
  const [pickerHari, setPickerHari] = useState(14);
  const [pickerBulan, setPickerBulan] = useState(4); // 0-indexed (Mei = 4)
  const [pickerTahun, setPickerTahun] = useState(2008);
  const [pickerIso, setPickerIso] = useState('2008-05-14');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTanggalWaktu(initialData.tanggalWaktu || new Date().toISOString().slice(0, 19).replace('T', ' '));
        setNoKodeMurid(initialData.noKodeMurid || generateRandomKodeMurid());
        setNama(initialData.nama || '');
        setPosisiBermain(initialData.posisiBermain || 'Open Spike');
        setTempatTanggalLahir(
          initialData.tempatTanggalLahir ||
            (initialData.tempatLahir ? `${initialData.tempatLahir}, ${initialData.tanggalLahir || ''}` : '')
        );
        setTinggiBeratBadan(
          initialData.tinggiBeratBadan ||
            (initialData.tinggiBadan ? `${initialData.tinggiBadan} cm / ${initialData.beratBadan || ''} kg` : '')
        );
        setAlamat(initialData.alamat || '');
        setNoWhatsapp(initialData.noWhatsapp || initialData.noHp || '');
        setJenisKelamin(initialData.jenisKelamin || 'Laki - Laki');
        setFotoUrl(initialData.fotoUrl || '');
        setPreviewUrl(
          initialData.fotoUrl ||
            'https://images.unsplash.com/photo-1544717305-2782549b5136?w=300&auto=format&fit=crop&q=80'
        );
      } else {
        const now = new Date();
        setTanggalWaktu(now.toISOString().slice(0, 19).replace('T', ' '));
        // Kode murid diawali BSM-(Nomor acak) sesuai instruksi user
        setNoKodeMurid(nextKodeMurid && nextKodeMurid.startsWith('BSM-') ? nextKodeMurid : generateRandomKodeMurid());
        setNama(currentUser?.username || '');
        setPosisiBermain('Open Spike');
        setNoWhatsapp(currentUser?.whatsapp || '');
        setTempatTanggalLahir('');
        setTinggiBeratBadan('175 cm / 65 kg');
        setAlamat('');
        setJenisKelamin('Laki - Laki');
        setFotoUrl('');
        setPreviewUrl('https://images.unsplash.com/photo-1544717305-2782549b5136?w=300&auto=format&fit=crop&q=80');
      }
    }
  }, [isOpen, initialData, nextKodeMurid, muridCount, currentUser]);

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

  const handleRandomizeCode = () => {
    setNoKodeMurid(generateRandomKodeMurid());
  };

  // Date Picker Window Handlers
  const handleOpenDatePicker = () => {
    const parsed = parseCurrentTempatTanggal(tempatTanggalLahir);
    setPickerKota(parsed.kota);
    setPickerHari(parsed.hari);
    setPickerBulan(parsed.bulan);
    setPickerTahun(parsed.tahun);
    setPickerIso(parsed.isoDate);
    setIsDatePickerOpen(true);
  };

  const handleIsoDateChange = (isoVal: string) => {
    setPickerIso(isoVal);
    if (isoVal) {
      const parts = isoVal.split('-');
      if (parts.length === 3) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10);
        const d = parseInt(parts[2], 10);
        if (!isNaN(y)) setPickerTahun(y);
        if (!isNaN(m)) setPickerBulan(m - 1);
        if (!isNaN(d)) setPickerHari(d);
      }
    }
  };

  const handleDmyChange = (newDay: number, newMonth: number, newYear: number) => {
    setPickerHari(newDay);
    setPickerBulan(newMonth);
    setPickerTahun(newYear);
    const mm = String(newMonth + 1).padStart(2, '0');
    const dd = String(newDay).padStart(2, '0');
    setPickerIso(`${newYear}-${mm}-${dd}`);
  };

  const handleApplyDate = () => {
    const bulanName = BULAN_INDONESIA[pickerBulan] || 'Januari';
    const city = pickerKota.trim() || 'Mojokerto';
    const formatted = `${city}, ${pickerHari} ${bulanName} ${pickerTahun}`;
    setTempatTanggalLahir(formatted);
    setIsDatePickerOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !tempatTanggalLahir.trim() || !alamat.trim()) {
      alert('Harap lengkapi formulir data murid (Nama, Tempat Tanggal Lahir, dan Alamat wajib diisi)!');
      return;
    }

    setIsSubmitting(true);
    try {
      if (initialData) {
        // Mode Edit: perbarui murid yang ada
        const updatedMurid: DataMurid = {
          ...initialData,
          tanggalWaktu: tanggalWaktu || initialData.tanggalWaktu,
          noKodeMurid: noKodeMurid.trim() || initialData.noKodeMurid,
          nama: nama.trim(),
          posisiBermain: posisiBermain.trim() || 'Open Spike',
          tempatTanggalLahir: tempatTanggalLahir.trim(),
          tinggiBeratBadan: tinggiBeratBadan.trim() || '175 cm / 65 kg',
          alamat: alamat.trim(),
          noWhatsapp: noWhatsapp.trim(),
          noHp: noWhatsapp.trim(),
          jenisKelamin: jenisKelamin,
          fotoUrl:
            fotoUrl ||
            previewUrl ||
            initialData.fotoUrl ||
            'https://images.unsplash.com/photo-1544717305-2782549b5136?w=300&auto=format&fit=crop&q=80',
        };
        await onSubmit(updatedMurid);
      } else {
        // Mode Tambah Baru (Dapat dilakukan oleh semua user)
        const newMurid: DataMurid = {
          id: `murid-${Date.now()}`,
          tanggalWaktu: tanggalWaktu || new Date().toISOString().slice(0, 19).replace('T', ' '),
          noKodeMurid: noKodeMurid.trim() || generateRandomKodeMurid(),
          nama: nama.trim(),
          posisiBermain: posisiBermain.trim() || 'Open Spike',
          tempatTanggalLahir: tempatTanggalLahir.trim(),
          tinggiBeratBadan: tinggiBeratBadan.trim() || '175 cm / 65 kg',
          alamat: alamat.trim(),
          noWhatsapp: noWhatsapp.trim(),
          noHp: noWhatsapp.trim(),
          jenisKelamin: jenisKelamin,
          fotoUrl:
            fotoUrl ||
            previewUrl ||
            'https://images.unsplash.com/photo-1544717305-2782549b5136?w=300&auto=format&fit=crop&q=80',
          statusApprove: 'Pending',
          statusApproval: 'Pending',
          catatanApprove: 'Pendaftaran baru menunggu approval Pengurus/Admin',
        };
        await onSubmit(newMurid);
      }
      onClose();
    } catch (err) {
      console.error('Gagal menyimpan data murid:', err);
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
                <UserPlus className="w-5 h-5 text-blue-300" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-base">
                {isEditMode ? 'Edit Data Murid & Atlet Binaan' : 'Input Pendaftaran Data Murid'}
              </h3>
              <p className="text-xs text-blue-200">
                {isEditMode
                  ? `Mengubah rincian atlet (Kode: ${noKodeMurid})`
                  : 'Terbuka untuk semua user > Sinkronisasi Google Sheets'}
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
          {/* Row 1: Tanggal & Waktu + No Kode Murid BSM-(Nomor Acak) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Tanggal & Waktu
              </label>
              <input
                type="text"
                readOnly
                value={tanggalWaktu || ''}
                className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-xl text-xs font-mono text-slate-600"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  No Kode Murid
                </label>
                {!isEditMode && (
                  <button
                    type="button"
                    onClick={handleRandomizeCode}
                    className="text-[10px] text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1 cursor-pointer bg-blue-50 px-2 py-0.5 rounded border border-blue-200"
                    title="Buat kode nomor acak baru"
                  >
                    <RefreshCw className="w-3 h-3" /> Acak Ulang
                  </button>
                )}
              </div>
              <div className="relative flex items-center">
                <input
                  type="text"
                  required
                  value={noKodeMurid || ''}
                  onChange={(e) => setNoKodeMurid(e.target.value)}
                  placeholder="BSM-1234"
                  className="w-full px-3 py-2 bg-blue-50 border border-blue-200 rounded-xl text-xs font-mono font-bold text-blue-950 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Awalan &quot;BSM-(Nomor acak)&quot; misal: BSM-7492
              </p>
            </div>
          </div>

          {/* Row 2: Nama & Posisi Pemain */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nama Murid / Atlet <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Dimas Setiawan"
                value={nama || ''}
                onChange={(e) => setNama(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Posisi Pemain <span className="text-rose-500">*</span>
              </label>
              <select
                value={posisiBermain}
                onChange={(e) => setPosisiBermain(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {POSISI_VOLI_OPTIONS.map((pos) => (
                  <option key={pos} value={pos}>
                    {pos}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Tempat Tanggal Lahir & Jenis Kelamin */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Tempat Tanggal Lahir <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleOpenDatePicker}
                  className="text-[11px] text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1.5 cursor-pointer bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-lg border border-blue-200 transition shadow-2xs"
                  title="Tampilkan Jendela Pilih Tanggal Lahir"
                >
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>Pilih Tanggal</span>
                </button>
              </div>
              <div className="relative flex items-center">
                <input
                  type="text"
                  required
                  placeholder="Mojokerto, 14 Mei 2008"
                  value={tempatTanggalLahir || ''}
                  onChange={(e) => setTempatTanggalLahir(e.target.value)}
                  className="w-full pl-3 pr-10 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleOpenDatePicker}
                  className="absolute right-1.5 p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                  title="Buka Jendela Pilih Tanggal"
                >
                  <Calendar className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5 flex items-center justify-between">
                <span>Klik tombol &quot;Pilih Tanggal&quot; untuk membuka kalender</span>
                {tempatTanggalLahir && (
                  <span className="text-emerald-600 font-medium">✓ Format siap</span>
                )}
              </p>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Jenis Kelamin <span className="text-rose-500">*</span>
              </label>
              <select
                value={jenisKelamin || 'Laki - Laki'}
                onChange={(e) => setJenisKelamin(e.target.value as JenisKelamin)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Laki - Laki">Laki - Laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
          </div>

          {/* Row 4: Tinggi & Berat Badan + No WhatsApp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Tinggi & Berat Badan
              </label>
              <input
                type="text"
                placeholder="Contoh: 184 cm / 72 kg"
                value={tinggiBeratBadan || ''}
                onChange={(e) => setTinggiBeratBadan(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                No WhatsApp
              </label>
              <input
                type="tel"
                placeholder="08xxxxxxxxxx"
                value={noWhatsapp || ''}
                onChange={(e) => setNoWhatsapp(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Row 5: Alamat */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Alamat Domisili <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={2}
              placeholder="Contoh: Dsn. Japanan Kidul RT 03 RW 01, Ds. Japanan, Kec. Kemlagi, Kab. Mojokerto"
              value={alamat || ''}
              onChange={(e) => setAlamat(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Row 6: Input Foto / Gambar Siswa */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Input Foto / Gambar Siswa
            </label>
            <div className="flex items-center gap-3">
              <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl cursor-pointer bg-slate-50 hover:bg-blue-50/50 transition">
                <Upload className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-slate-600 font-medium">Unggah Pas Foto Siswa</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>

              {previewUrl && (
                <div className="w-14 h-16 rounded-lg overflow-hidden border border-slate-300 shrink-0 bg-slate-100">
                  <img src={previewUrl} alt="Foto Siswa" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              )}
            </div>
          </div>

          {/* Notification Note */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px] flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              {isEditMode ? (
                <span>
                  Perubahan data murid akan langsung diperbarui di database lokal dan disinkronkan ke Google Sheets.
                </span>
              ) : (
                <span>
                  Akses input terbuka untuk <strong>semua user</strong>. Data murid baru akan tercatat dan menunggu verifikasi status atlet.
                </span>
              )}
            </span>
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
                ? 'Menyimpan Data...'
                : isEditMode
                ? 'Simpan Perubahan Data Murid'
                : 'Kirim Pendaftaran Murid'}
            </button>
          </div>
        </form>
      </div>

      {/* Jendela Pilih Tanggal Lahir Modal */}
      {isDatePickerOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header Jendela */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
                  <CalendarDays className="w-4 h-4 text-sky-300" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Jendela Pilih Tanggal Lahir</h4>
                  <p className="text-[10px] text-blue-200">Format data tanggal lahir resmi atlet voli BS ONE VC</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDatePickerOpen(false)}
                className="p-1 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* 1. Tempat Lahir / Kota */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>Tempat Lahir (Kota / Kabupaten)</span>
                </label>
                <input
                  type="text"
                  value={pickerKota}
                  onChange={(e) => setPickerKota(e.target.value)}
                  placeholder="Contoh: Mojokerto"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {/* Kota Cepat */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {KOTA_POPULER.map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setPickerKota(k)}
                      className={`text-[10px] px-2 py-0.5 rounded-md font-medium transition cursor-pointer ${
                        pickerKota.toLowerCase() === k.toLowerCase()
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Kalender Pemilih Tanggal */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>Pilih Tanggal Melalui Kalender</span>
                </label>
                <input
                  type="date"
                  value={pickerIso}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={(e) => handleIsoDateChange(e.target.value)}
                  className="w-full px-3 py-2 bg-blue-50 border border-blue-200 rounded-xl text-xs font-bold text-blue-900 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                />
              </div>

              {/* 3. Atau Pilih Cepat via Dropdown Hari / Bulan / Tahun */}
              <div className="pt-1 border-t border-slate-100">
                <span className="block text-[11px] font-semibold text-slate-500 mb-1.5">
                  Atau atur manual per kolom (Hari / Bulan / Tahun):
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {/* Hari */}
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5 font-medium">Tanggal</label>
                    <select
                      value={pickerHari}
                      onChange={(e) =>
                        handleDmyChange(parseInt(e.target.value, 10), pickerBulan, pickerTahun)
                      }
                      className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:ring-2 focus:ring-blue-500"
                    >
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Bulan */}
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5 font-medium">Bulan</label>
                    <select
                      value={pickerBulan}
                      onChange={(e) =>
                        handleDmyChange(pickerHari, parseInt(e.target.value, 10), pickerTahun)
                      }
                      className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:ring-2 focus:ring-blue-500"
                    >
                      {BULAN_INDONESIA.map((bName, idx) => (
                        <option key={bName} value={idx}>
                          {bName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tahun */}
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5 font-medium">Tahun</label>
                    <select
                      value={pickerTahun}
                      onChange={(e) =>
                        handleDmyChange(pickerHari, pickerBulan, parseInt(e.target.value, 10))
                      }
                      className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:ring-2 focus:ring-blue-500"
                    >
                      {Array.from(
                        { length: 40 },
                        (_, i) => new Date().getFullYear() - 3 - i
                      ).map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Box Preview Hasil */}
              <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-blue-900 font-bold text-xs">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Hasil Format:</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                    Usia: {new Date().getFullYear() - pickerTahun} Tahun
                  </span>
                </div>
                <p className="mt-1 text-xs font-mono font-bold text-blue-950 bg-white px-2.5 py-1.5 rounded-lg border border-blue-200 shadow-2xs">
                  {pickerKota.trim() || 'Mojokerto'}, {pickerHari}{' '}
                  {BULAN_INDONESIA[pickerBulan]} {pickerTahun}
                </p>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsDatePickerOpen(false)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleApplyDate}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Terapkan Tanggal</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
