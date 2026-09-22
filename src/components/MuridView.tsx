import React, { useState } from 'react';
import { DataMurid, User } from '../types';
import {
  Users,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Trash2,
  Edit,
  Eye,
  Printer,
  ShieldCheck,
  UserCheck,
  Phone,
  MapPin,
} from 'lucide-react';

interface MuridViewProps {
  muridList: DataMurid[];
  currentUser: User | null;
  onOpenAddMurid: () => void;
  onEditMurid?: (murid: DataMurid) => void;
  onApproveMurid: (muridId: string) => Promise<void>;
  onDeleteMurid: (muridId: string) => Promise<void>;
  onOpenExport: (data: DataMurid[]) => void;
}

export const MuridView: React.FC<MuridViewProps> = ({
  muridList,
  currentUser,
  onOpenAddMurid,
  onEditMurid,
  onApproveMurid,
  onDeleteMurid,
  onOpenExport,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedMurid, setSelectedMurid] = useState<DataMurid | null>(null);

  const canApproveOrDelete = currentUser?.role === 'Admin' || currentUser?.role === 'Pengurus';

  const filteredMurid = muridList.filter((m) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      (m.nama || '').toLowerCase().includes(search) ||
      (m.noKodeMurid || '').toLowerCase().includes(search) ||
      (m.alamat || '').toLowerCase().includes(search) ||
      (m.posisiBermain || '').toLowerCase().includes(search);

    const status = m.statusApproval || m.statusApprove || 'Pending';
    if (filterStatus === 'pending') {
      return matchesSearch && status === 'Pending';
    }
    if (filterStatus === 'approved') {
      return matchesSearch && (status === 'Approved' || status === 'Disetujui');
    }
    return matchesSearch;
  });

  const handleEditClick = (murid: DataMurid) => {
    if (typeof onEditMurid === 'function') {
      onEditMurid(murid);
    } else {
      setSelectedMurid(murid);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-700" />
            Data Murid &amp; Atlet Binaan Bintang Samudra
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar biodata atlet, nomor registrasi BSM, posisi pemain, dan verifikasi status resmi
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onOpenExport(filteredMurid)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-sm transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Cetak Biodata (JPG / PDF)
          </button>

          {/* AKSES TERBUKA UNTUK SEMUA USER: Input data pendaftaran murid baru */}
          <button
            onClick={onOpenAddMurid}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-md transition transform active:scale-95 cursor-pointer"
            title="Buka Formulir Pendaftaran Murid Baru (Akses Semua User)"
          >
            <Plus className="w-4 h-4" />
            Pendaftaran Murid Baru
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari berdasarkan Nama Atlet, Kode BSM, Posisi Pemain, Alamat..."
            value={searchTerm || ''}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-600 uppercase">Status:</label>
          <select
            value={filterStatus || 'all'}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Semua Atlet ({muridList.length})</option>
            <option value="approved">
              Sudah Approved ({muridList.filter((m) => m.statusApproval === 'Approved' || m.statusApprove === 'Disetujui').length})
            </option>
            <option value="pending">
              Menunggu Approval ({muridList.filter((m) => m.statusApproval === 'Pending' || m.statusApprove === 'Pending').length})
            </option>
          </select>
        </div>
      </div>

      {/* Murid Table / Cards */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[11px]">
                <th className="py-3 px-3 w-10 text-center">No</th>
                <th className="py-3 px-3 w-14 text-center">Foto</th>
                <th className="py-3 px-3 w-28">No Kode Murid</th>
                <th className="py-3 px-3 min-w-[160px]">Nama Lengkap</th>
                <th className="py-3 px-3 w-28">Posisi Pemain</th>
                <th className="py-3 px-3 w-20 text-center">L/P</th>
                <th className="py-3 px-3 w-28">No HP / WA</th>
                <th className="py-3 px-3 w-28 text-center">Status Validasi</th>
                <th className="py-3 px-3 w-36 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredMurid.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400 italic">
                    Tidak ditemukan data murid yang sesuai pencarian
                  </td>
                </tr>
              ) : (
                filteredMurid.map((m, idx) => {
                  const isApproved = m.statusApproval === 'Approved' || m.statusApprove === 'Disetujui';
                  const ttl =
                    m.tempatTanggalLahir ||
                    (m.tempatLahir ? `${m.tempatLahir}, ${m.tanggalLahir || ''}` : '-');
                  const phone = m.noWhatsapp || m.noHp || '-';

                  return (
                    <tr key={m.id || idx} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-3 text-center font-mono text-slate-500 font-bold">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div
                          className="w-10 h-10 rounded-full overflow-hidden border border-slate-300 bg-slate-100 cursor-pointer mx-auto hover:ring-2 hover:ring-blue-500 transition"
                          onClick={() => setSelectedMurid(m)}
                          title="Klik untuk melihat detail"
                        >
                          <img
                            src={m.fotoUrl}
                            alt={m.nama}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-blue-900">
                        {m.noKodeMurid}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{m.nama}</div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[200px]">
                          {ttl}
                        </div>
                      </td>
                      {/* KOLOM POSISI PEMAIN */}
                      <td className="py-3 px-3">
                        <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-900 border border-blue-200 font-bold text-[11px] inline-block shadow-2xs">
                          {m.posisiBermain || 'Open Spike'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-medium text-slate-700">
                        {m.jenisKelamin === 'Laki - Laki' ? 'L' : 'P'}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600">
                        {phone}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {isApproved ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300 animate-pulse">
                            <Clock className="w-3 h-3 text-amber-600" />
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Tombol Lihat Detail */}
                          <button
                            onClick={() => setSelectedMurid(m)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition cursor-pointer"
                            title="Lihat Detail Biodata"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* AKSI EDIT (DAPAT DIKLIK & BERFUNGSI) */}
                          <button
                            onClick={() => handleEditClick(m)}
                            className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition cursor-pointer border border-blue-200"
                            title="Edit Data Murid"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {/* Tombol APPROVE */}
                          {canApproveOrDelete && !isApproved && (
                            <button
                              onClick={() => onApproveMurid(m.id)}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer shadow-sm"
                              title="Approve Murid Baru"
                            >
                              <UserCheck className="w-3 h-3" />
                              Approve
                            </button>
                          )}

                          {/* Tombol Hapus */}
                          {canApproveOrDelete && (
                            <button
                              onClick={() => onDeleteMurid(m.id)}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition cursor-pointer"
                              title="Hapus Murid"
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

      {/* Detail Modal */}
      {selectedMurid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Biodata Lengkap Atlet Murid</h3>
                <p className="text-xs text-blue-200">
                  Kode Registrasi: <strong className="font-mono text-white">{selectedMurid.noKodeMurid}</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedMurid(null)}
                className="p-1 text-white/70 hover:text-white rounded-lg hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-24 rounded-2xl overflow-hidden border-2 border-blue-600 shrink-0 bg-slate-100 shadow-md">
                  <img
                    src={selectedMurid.fotoUrl}
                    alt={selectedMurid.nama}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">{selectedMurid.nama}</h4>
                  <p className="text-xs text-slate-500">
                    {selectedMurid.tempatTanggalLahir ||
                      (selectedMurid.tempatLahir ? `${selectedMurid.tempatLahir}, ${selectedMurid.tanggalLahir || ''}` : '-')}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-2.5 py-0.5 bg-blue-100 text-blue-900 border border-blue-300 rounded-lg font-bold text-xs">
                      Posisi: {selectedMurid.posisiBermain || 'Open Spike'}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded-lg font-semibold text-xs border border-slate-200">
                      {selectedMurid.jenisKelamin}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-slate-500 block">Nomor WhatsApp:</span>
                  <strong className="text-slate-900 font-mono">
                    {selectedMurid.noWhatsapp || selectedMurid.noHp || '-'}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Posisi Pemain:</span>
                  <strong className="text-blue-900 font-bold">
                    {selectedMurid.posisiBermain || 'Open Spike'}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Tinggi / Berat Badan:</span>
                  <strong className="text-slate-900">
                    {selectedMurid.tinggiBeratBadan ||
                      (selectedMurid.tinggiBadan ? `${selectedMurid.tinggiBadan} cm / ${selectedMurid.beratBadan} kg` : '-')}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Status Atlet:</span>
                  <strong className="text-slate-900">
                    {selectedMurid.statusApproval || selectedMurid.statusApprove || 'Pending'}
                  </strong>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500 block">Alamat Domisili:</span>
                  <strong className="text-slate-900">{selectedMurid.alamat}</strong>
                </div>
                {selectedMurid.catatanApprove && (
                  <div className="col-span-2 bg-amber-50 p-2 rounded-lg border border-amber-200">
                    <span className="text-amber-800 block text-[10px] font-bold">Catatan Verifikasi:</span>
                    <p className="text-amber-900 text-xs mt-0.5">{selectedMurid.catatanApprove}</p>
                  </div>
                )}
              </div>

              {selectedMurid.tandaTanganUrl && (
                <div className="pt-2">
                  <span className="text-xs text-slate-500 block mb-1">Tanda Tangan Atlet:</span>
                  <div className="border border-slate-200 rounded-xl p-2 bg-white inline-block">
                    <img
                      src={selectedMurid.tandaTanganUrl}
                      alt="Tanda Tangan"
                      className="h-16 object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => {
                    const target = selectedMurid;
                    setSelectedMurid(null);
                    handleEditClick(target);
                  }}
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit Data Murid
                </button>

                <button
                  onClick={() => setSelectedMurid(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition cursor-pointer"
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
