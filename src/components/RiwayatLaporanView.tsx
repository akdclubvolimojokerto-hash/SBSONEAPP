import React, { useState } from 'react';
import {
  DataMurid,
  DataPengurus,
  DataKegiatan,
  JadwalPelatihan,
  DataAbsen,
  JadwalPiket,
  Keuangan,
  User,
  ReportType,
} from '../types';
import {
  FileText,
  Filter,
  Search,
  Calendar,
  Eye,
  Edit3,
  Trash2,
  CheckCircle2,
  Printer,
  Download,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface RiwayatLaporanViewProps {
  muridList: DataMurid[];
  pengurusList: DataPengurus[];
  kegiatanList: DataKegiatan[];
  jadwalList: JadwalPelatihan[];
  absenList: DataAbsen[];
  piketList: JadwalPiket[];
  keuanganList: Keuangan[];
  currentUser: User | null;
  onApproveMurid: (id: string) => Promise<void>;
  onDeleteRecord: (category: ReportType, id: string) => Promise<void>;
  onEditRecord?: (category: ReportType, item: any) => void;
  onOpenExportModal: (reportType: ReportType, filteredData: any[]) => void;
}

export const RiwayatLaporanView: React.FC<RiwayatLaporanViewProps> = ({
  muridList,
  pengurusList,
  kegiatanList,
  jadwalList,
  absenList,
  piketList,
  keuanganList,
  currentUser,
  onApproveMurid,
  onDeleteRecord,
  onEditRecord,
  onOpenExportModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ReportType>('murid');
  const [searchId, setSearchId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [viewDetailModalItem, setViewDetailModalItem] = useState<any | null>(null);

  const canEdit = currentUser?.role === 'Admin' || currentUser?.role === 'Pengurus';

  // Helper date filtering
  const filterByDateAndId = (items: any[], dateField: string, idField: string) => {
    return items.filter((item) => {
      // ID filter
      if (searchId.trim()) {
        const itemIdentifier = (item[idField] || item.id || '').toLowerCase();
        const itemNama = (item.nama || item.judulKegiatan || '').toLowerCase();
        const matches =
          itemIdentifier.includes(searchId.toLowerCase()) ||
          itemNama.includes(searchId.toLowerCase());
        if (!matches) return false;
      }

      // Date filter
      const itemDate = item[dateField] ? String(item[dateField]).slice(0, 10) : '';
      if (startDate && itemDate && itemDate < startDate) return false;
      if (endDate && itemDate && itemDate > endDate) return false;

      return true;
    });
  };

  // Get filtered items based on category
  const getFilteredData = () => {
    switch (selectedCategory) {
      case 'murid':
        return filterByDateAndId(muridList, 'tanggalWaktu', 'noKodeMurid');
      case 'pengurus':
        return filterByDateAndId(pengurusList, 'tanggalWaktu', 'nipc');
      case 'kegiatan':
        return filterByDateAndId(kegiatanList, 'tanggalWaktu', 'id');
      case 'jadwal':
        return filterByDateAndId(jadwalList, 'tanggalWaktu', 'nipc');
      case 'absen':
        return filterByDateAndId(absenList, 'tanggalWaktu', 'noKodeMurid');
      case 'piket':
        return filterByDateAndId(piketList, 'tanggalWaktu', 'noKodeMurid');
      case 'keuangan':
        return filterByDateAndId(keuanganList, 'tanggalWaktu', 'id');
      default:
        return [];
    }
  };

  const filteredItems = getFilteredData();

  const handleExportClick = () => {
    onOpenExportModal(selectedCategory, filteredItems);
  };

  const getCategoryTitle = (cat: ReportType) => {
    switch (cat) {
      case 'murid':
        return 'Laporan Data Murid & Atlet Binaan';
      case 'pengurus':
        return 'Laporan Data Pengurus & Pelatih';
      case 'kegiatan':
        return 'Laporan Kegiatan & Dokumentasi Club';
      case 'jadwal':
        return 'Laporan Jadwal Pelatihan Resmi';
      case 'absen':
        return 'Laporan Rekapitulasi Presensi Kehadiran';
      case 'piket':
        return 'Laporan Jadwal Piket Kebersihan';
      case 'keuangan':
        return 'Laporan Kas & Keuangan Club';
      default:
        return 'Laporan Resmi';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-700" />
            Riwayat &amp; Format Laporan Resmi PBVSI
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manajemen arsip data, persetujuan murid, filter rentang tanggal, dan cetak PDF/JPG KOP resmi
          </p>
        </div>

        <button
          onClick={handleExportClick}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          Export / Cetak Dokumen Resmi (A4)
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
        {[
          { key: 'murid', label: 'Data Murid', count: muridList.length },
          { key: 'pengurus', label: 'Data Pengurus', count: pengurusList.length },
          { key: 'kegiatan', label: 'Data Kegiatan', count: kegiatanList.length },
          { key: 'jadwal', label: 'Jadwal Pelatihan', count: jadwalList.length },
          { key: 'absen', label: 'Data Absen', count: absenList.length },
          { key: 'piket', label: 'Jadwal Piket', count: piketList.length },
          { key: 'keuangan', label: 'Keuangan Club', count: keuanganList.length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedCategory(tab.key as ReportType)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              selectedCategory === tab.key
                ? 'bg-blue-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                selectedCategory === tab.key
                  ? 'bg-blue-800 text-white'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filter Toolbar: Filter Berdasarkan ID & Rentang Tanggal (X s/d Y) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-blue-700" />
          Filter Data Laporan
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Filter Berdasarkan ID */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Filter Berdasarkan ID / No Kode / Nama:
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari ID, BSO, NIPC, Nama..."
                value={searchId || ''}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Filter Rentang Tanggal Mulai (X) */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Dari Tanggal (X):
            </label>
            <input
              type="date"
              value={startDate || ''}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter Rentang Tanggal Selesai (Y) */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Sampai Tanggal (Y):
            </label>
            <input
              type="date"
              value={endDate || ''}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {(searchId || startDate || endDate) && (
          <div className="flex justify-end pt-1">
            <button
              onClick={() => {
                setSearchId('');
                setStartDate('');
                setEndDate('');
              }}
              className="text-xs text-rose-600 hover:underline font-semibold cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>

      {/* Main Table View */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-800">
            {getCategoryTitle(selectedCategory)} ({filteredItems.length} Data)
          </h3>
          <span className="text-xs text-slate-500">
            {canEdit
              ? 'Hak Akses: ADMIN / PENGURUS (Dapat Melihat, Edit, Hapus & Approve)'
              : 'Hak Akses: HANYA LIHAT DATA'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[11px]">
                <th className="py-3 px-3 w-10 text-center">No</th>
                <th className="py-3 px-3 w-28">ID / Kode</th>
                <th className="py-3 px-3 w-32">Tanggal &amp; Waktu</th>
                <th className="py-3 px-3 min-w-[160px]">Nama / Judul</th>
                <th className="py-3 px-3 min-w-[200px]">Keterangan / Rincian</th>
                <th className="py-3 px-3 w-24 text-center">Status / Tipe</th>
                <th className="py-3 px-3 w-36 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 italic">
                    Tidak ada data pada kategori ini yang memenuhi kriteria filter
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => {
                  const idText =
                    item.noKodeMurid || item.nipc || item.id || `BSO-${idx + 1}`;
                  const titleText =
                    item.nama || item.judulKegiatan || item.uraianCatatan || '-';
                  const detailText =
                    item.alamat ||
                    item.uraianKegiatan ||
                    item.bidangKepengurusan ||
                    item.keterangan ||
                    item.piket ||
                    `Total: Rp ${(item.totalSaldo || 0).toLocaleString()}`;
                  const isMurid = selectedCategory === 'murid';

                  return (
                    <tr key={item.id || idx} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-3 text-center font-mono text-slate-500">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-blue-900">
                        {idText}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">
                        {item.tanggalWaktu || '-'}
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-800">
                        {titleText}
                      </td>
                      <td className="py-3 px-3 text-slate-600 truncate max-w-xs">
                        {detailText}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {isMurid ? (
                          item.statusApproval === 'Approved' ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                              Approved
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                              Pending
                            </span>
                          )
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[10px]">
                            {item.tipe || item.jabatanPengurus || item.hari || 'Valid'}
                          </span>
                        )}
                      </td>

                      {/* Tombol Aksi: Lihat, Edit, Hapus, APPROVE */}
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Sediakan tombol 'Lihat' */}
                          <button
                            onClick={() => setViewDetailModalItem(item)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition cursor-pointer"
                            title="Lihat Detail Data"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Sediakan tombol 'APPROVE' untuk data murid yang baru daftar (Hanya Terbuka untuk ADMIN dan PENGURUS CLUB) */}
                          {canEdit && isMurid && item.statusApproval !== 'Approved' && (
                            <button
                              onClick={() => onApproveMurid(item.id)}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer shadow-sm"
                              title="Approve Murid Baru"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              APPROVE
                            </button>
                          )}

                          {/* Sediakan tombol 'Edit' (Hanya Terbuka untuk ADMIN dan PENGURUS CLUB) */}
                          {canEdit && (
                            <button
                              onClick={() => {
                                if (typeof onEditRecord === 'function') {
                                  onEditRecord(selectedCategory, item);
                                } else {
                                  setViewDetailModalItem(item);
                                }
                              }}
                              className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition cursor-pointer border border-blue-200"
                              title="Edit Data"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Sediakan tombol 'Hapus' (Hanya Terbuka untuk ADMIN dan PENGURUS CLUB) */}
                          {canEdit && (
                            <button
                              onClick={() => {
                                if (window.confirm('Yakin ingin menghapus data ini?')) {
                                  onDeleteRecord(selectedCategory, item.id);
                                }
                              }}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition cursor-pointer"
                              title="Hapus Data"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL VIEW MODAL */}
      {viewDetailModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div className="p-5 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">Detail Informasi Arsip</h3>
              <button
                onClick={() => setViewDetailModalItem(null)}
                className="p-1 text-white/70 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-3">
              {viewDetailModalItem.fotoUrl && (
                <div className="w-24 h-28 rounded-xl overflow-hidden border border-slate-300 mx-auto bg-slate-100">
                  <img
                    src={viewDetailModalItem.fotoUrl}
                    alt="Foto"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                {Object.entries(viewDetailModalItem).map(([key, val]) => {
                  if (key === 'fotoUrl' || key === 'tandaTanganUrl') return null;
                  return (
                    <div key={key} className="flex justify-between border-b border-slate-200/60 pb-1">
                      <span className="font-semibold text-slate-500 uppercase text-[10px]">
                        {key}:
                      </span>
                      <span className="font-bold text-slate-900 text-right max-w-[250px] truncate">
                        {String(val)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setViewDetailModalItem(null)}
                  className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
