import React, { useState, useEffect } from 'react';
import {
  Keuangan,
  User,
} from '../types';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Plus,
  Send,
  X,
  Printer,
  Calendar,
  DollarSign,
  FileSpreadsheet,
} from 'lucide-react';

interface KeuanganViewProps {
  keuanganList: Keuangan[];
  currentUser: User | null;
  onAddKeuangan: (entry: Keuangan) => Promise<void>;
  onOpenExport: (data: Keuangan[]) => void;
}

export const KeuanganView: React.FC<KeuanganViewProps> = ({
  keuanganList,
  currentUser,
  onAddKeuangan,
  onOpenExport,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tanggalWaktu, setTanggalWaktu] = useState('');
  const [uraianCatatan, setUraianCatatan] = useState('');
  const [pemasukanInput, setPemasukanInput] = useState<string>('');
  const [pengeluaranInput, setPengeluaranInput] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canEdit = currentUser?.role === 'Admin' || currentUser?.role === 'Pengurus';

  // Calculate overall totals
  const totalPemasukan = keuanganList.reduce((acc, curr) => acc + (curr.pemasukan || 0), 0);
  const totalPengeluaran = keuanganList.reduce((acc, curr) => acc + (curr.pengeluaran || 0), 0);
  const saldoAkhir =
    keuanganList.length > 0
      ? keuanganList[keuanganList.length - 1].totalSaldo
      : totalPemasukan - totalPengeluaran;

  const currentLatestSaldo = saldoAkhir;

  // Real-time calculation preview in modal
  const numPemasukan = Number(pemasukanInput) || 0;
  const numPengeluaran = Number(pengeluaranInput) || 0;
  const computedTotal = currentLatestSaldo + numPemasukan - numPengeluaran;

  const formatRupiah = (val: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);

  const handleOpenModal = () => {
    const now = new Date();
    setTanggalWaktu(now.toISOString().slice(0, 19).replace('T', ' '));
    setUraianCatatan('');
    setPemasukanInput('');
    setPengeluaranInput('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uraianCatatan.trim() && numPemasukan === 0 && numPengeluaran === 0) {
      alert('Harap masukkan uraian atau nominal transaksi keuangan!');
      return;
    }

    setIsSubmitting(true);
    const tipe =
      numPemasukan > 0 ? 'Pemasukan' : numPengeluaran > 0 ? 'Pengeluaran' : 'Penyesuaian';

    const newEntry: Keuangan = {
      id: `keu-${Date.now()}`,
      tanggalWaktu: tanggalWaktu || new Date().toISOString().slice(0, 19).replace('T', ' '),
      uraianCatatan: uraianCatatan.trim() || 'Catatan transaksi operasional',
      pemasukan: numPemasukan,
      pengeluaran: numPengeluaran,
      totalSaldo: computedTotal,
      tipe: tipe,
      kategori: 'Operasional Klub',
    };

    await onAddKeuangan(newEntry);
    setIsSubmitting(false);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-700" />
            Buku Kas &amp; Manajemen Keuangan Club
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pencatatan arus kas, iuran atlet, perlengkapan bola voli, dan saldo kas klub
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenExport(keuanganList)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-sm transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Cetak Laporan Kas (JPG / PDF)
          </button>

          {canEdit ? (
            <button
              onClick={handleOpenModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Input Transaksi Keuangan
            </button>
          ) : (
            <div className="text-xs text-slate-400 italic bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              🔒 Input Khusus Admin &amp; Pengurus
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards (Saldo Akhir, Total Pemasukan, Total Pengeluaran) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-900 to-teal-950 p-5 rounded-2xl text-white shadow-md border border-emerald-800">
          <div className="flex items-center justify-between text-emerald-300 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Total Saldo Kas Saat Ini
            </span>
            <Wallet className="w-5 h-5 text-emerald-300" />
          </div>
          <div className="text-2xl sm:text-3xl font-black">{formatRupiah(saldoAkhir)}</div>
          <p className="text-[11px] text-emerald-200/80 mt-1">
            Akumulasi Kas Club Bintang Samudra
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Total Pemasukan
            </span>
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900">
            {formatRupiah(totalPemasukan)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Iuran pembinaan atlet &amp; dana donatur
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-rose-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Total Pengeluaran
            </span>
            <TrendingDown className="w-5 h-5" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900">
            {formatRupiah(totalPengeluaran)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Perlengkapan bola, medis, &amp; konsumsi pertandingan
          </p>
        </div>
      </div>

      {/* Tabel Rapi Transaksi Keuangan */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            Riwayat Pembukuan Kas (Data_Keuangan)
          </h3>
          <span className="text-xs font-medium text-slate-500">
            {keuanganList.length} Transaksi Tercatat
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[11px]">
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4 w-36">Tanggal &amp; Waktu</th>
                <th className="py-3 px-4 min-w-[200px]">Uraian Catatan Keuangan</th>
                <th className="py-3 px-4 text-right text-emerald-800">Pemasukan (Rp)</th>
                <th className="py-3 px-4 text-right text-rose-800">Pengeluaran (Rp)</th>
                <th className="py-3 px-4 text-right text-blue-900 font-black">
                  Total Saldo (Rp)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {keuanganList.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 text-center font-mono text-slate-500">
                    {idx + 1}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600 text-[11px]">
                    {item.tanggalWaktu}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">
                    {item.uraianCatatan}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                    {item.pemasukan > 0 ? formatRupiah(item.pemasukan) : '-'}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-rose-700">
                    {item.pengeluaran > 0 ? formatRupiah(item.pengeluaran) : '-'}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-black text-blue-950 bg-slate-50/50">
                    {formatRupiah(item.totalSaldo)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL INPUT KEUANGAN */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-emerald-900 to-teal-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Wallet className="w-5 h-5 text-emerald-200" />
                <div>
                  <h3 className="font-bold text-base">Input Transaksi Keuangan Club</h3>
                  <p className="text-xs text-emerald-100">
                    Google Sheets: <span className="font-mono">Keuangan</span>
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
              {/* Tanggal & Waktu (Otomatis terisi waktu saat ini) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Tanggal &amp; Waktu (Otomatis Terisi)
                </label>
                <input
                  type="text"
                  readOnly
                  value={tanggalWaktu || ''}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-xl text-xs font-mono text-slate-600"
                />
              </div>

              {/* URAIAN CATATAN KEUANGAN (Opsional Text Panjang) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Uraian Catatan Keuangan (Opsional Text Panjang)
                </label>
                <textarea
                  rows={3}
                  placeholder="Contoh: Pembelian net standar PBVSI dan 2 bola Mikasa V200W, atau iuran atlet bulan ini..."
                  value={uraianCatatan || ''}
                  onChange={(e) => setUraianCatatan(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* PEMASUKAN & PENGELUARAN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
                    Pemasukan (Angka / Rp)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-bold text-emerald-700">
                      Rp
                    </span>
                    <input
                      type="number"
                      placeholder="0"
                      min="0"
                      value={pemasukanInput || ''}
                      onChange={(e) => setPemasukanInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-emerald-50/50 border border-emerald-300 rounded-xl text-xs font-mono font-bold text-emerald-950 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  {numPemasukan > 0 && (
                    <span className="text-[10px] text-emerald-700 font-medium mt-0.5 block">
                      {formatRupiah(numPemasukan)}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-rose-800 uppercase tracking-wider mb-1">
                    Pengeluaran (Angka / Rp)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-bold text-rose-700">
                      Rp
                    </span>
                    <input
                      type="number"
                      placeholder="0"
                      min="0"
                      value={pengeluaranInput || ''}
                      onChange={(e) => setPengeluaranInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-rose-50/50 border border-rose-300 rounded-xl text-xs font-mono font-bold text-rose-950 focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  {numPengeluaran > 0 && (
                    <span className="text-[10px] text-rose-700 font-medium mt-0.5 block">
                      {formatRupiah(numPengeluaran)}
                    </span>
                  )}
                </div>
              </div>

              {/* TOTAL (Otomatis Terisi & Terhitung) */}
              <div className="p-4 bg-slate-100 rounded-xl border border-slate-300 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 font-medium">Saldo Kas Sebelumnya:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {formatRupiah(currentLatestSaldo)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-200">
                  <span className="font-bold text-slate-900 uppercase">
                    Total Saldo Baru (Otomatis Terisi):
                  </span>
                  <span className="font-mono font-black text-sm text-blue-900">
                    {formatRupiah(computedTotal)}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 italic mt-1">
                  *Bila diinput pemasukan total akan bertambah, bila pengeluaran total akan
                  berkurang.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Menyimpan...' : 'Kirim ke Keuangan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
