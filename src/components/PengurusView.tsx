import React, { useState } from 'react';
import { DataPengurus, User, JabatanPengurus } from '../types';
import {
  UserCheck,
  Plus,
  Search,
  Phone,
  MapPin,
  Printer,
  Trash2,
  Eye,
  Shield,
  Edit,
} from 'lucide-react';

interface PengurusViewProps {
  pengurusList: DataPengurus[];
  currentUser: User | null;
  onOpenAddPengurus: () => void;
  onEditPengurus?: (pengurus: DataPengurus) => void;
  onDeletePengurus: (id: string) => Promise<void>;
  onOpenExport: (data: DataPengurus[]) => void;
}

export const PengurusView: React.FC<PengurusViewProps> = ({
  pengurusList,
  currentUser,
  onOpenAddPengurus,
  onEditPengurus,
  onDeletePengurus,
  onOpenExport,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJabatan, setSelectedJabatan] = useState<string>('all');

  const canEdit = currentUser?.role === 'Admin' || currentUser?.role === 'Pengurus';

  const filteredPengurus = pengurusList.filter((p) => {
    const matchesSearch =
      p.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nipc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.jabatanPengurus.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.alamat.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedJabatan !== 'all') {
      return matchesSearch && p.jabatanPengurus === selectedJabatan;
    }
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-700" />
            Data Pengurus &amp; Pelatih Bintang Samudra
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar jajaran manajemen, pelatih resmi berlisensi, dan seksi bidang operasional
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onOpenExport(filteredPengurus)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-sm transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Cetak Pengurus (JPG / PDF)
          </button>

          {canEdit ? (
            <button
              onClick={onOpenAddPengurus}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Input Data Pengurus
            </button>
          ) : (
            <div className="text-xs text-slate-400 italic bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              🔒 Input Khusus Admin &amp; Pengurus
            </div>
          )}
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari berdasarkan Nama, NIPC (PBS-XXXX), Jabatan..."
            value={searchTerm || ''}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-600 uppercase">Jabatan:</label>
          <select
            value={selectedJabatan || 'all'}
            onChange={(e) => setSelectedJabatan(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Semua Jabatan ({pengurusList.length})</option>
            <option value="MANAGER CLUB">Manager Club</option>
            <option value="HEAD COACH">Head Coach</option>
            <option value="COACH">Coach</option>
            <option value="BENDAHARA">Bendahara</option>
            <option value="SEKRETARIS">Sekretaris</option>
          </select>
        </div>
      </div>

      {/* Pengurus Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPengurus.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between group"
          >
            <div className="p-5 flex items-start gap-4">
              <div className="w-16 h-20 rounded-xl overflow-hidden border-2 border-blue-600 shrink-0 bg-slate-100 shadow-sm">
                <img
                  src={p.fotoUrl}
                  alt={p.nama}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex-1 min-w-0">
                <span className="inline-block px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[10px] font-black uppercase tracking-wider mb-1">
                  {p.jabatanPengurus}
                </span>
                <h3 className="font-bold text-sm text-slate-900 leading-snug truncate">
                  {p.nama}
                </h3>
                <span className="text-[11px] font-mono font-bold text-slate-500 block mt-0.5">
                  NIPC: {p.nipc}
                </span>

                <div className="mt-2 space-y-1 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5 truncate">
                    <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{p.noWa}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span className="truncate">{p.alamat}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-mono">{p.tanggalWaktu}</span>
              {canEdit && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onEditPengurus && onEditPengurus(p)}
                    className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition cursor-pointer"
                    title="Edit Pengurus"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeletePengurus(p.id)}
                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition cursor-pointer"
                    title="Hapus Pengurus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
