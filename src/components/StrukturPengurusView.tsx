import React, { useState } from 'react';
import {
  DataStruktur,
  DataPengurus,
  DataMurid,
  User,
} from '../types';
import {
  Network,
  Users,
  UserCheck,
  Edit,
  Send,
  X,
  Printer,
  Shield,
  Medal,
  Dumbbell,
  Sparkles,
} from 'lucide-react';

interface StrukturPengurusViewProps {
  struktur: DataStruktur;
  pengurusList: DataPengurus[];
  muridList: DataMurid[];
  currentUser: User | null;
  onUpdateStruktur: (newStruktur: DataStruktur) => Promise<void>;
  onOpenExport: () => void;
}

export const StrukturPengurusView: React.FC<StrukturPengurusViewProps> = ({
  struktur,
  pengurusList,
  muridList,
  currentUser,
  onUpdateStruktur,
  onOpenExport,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<DataStruktur>(struktur);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canEdit = currentUser?.role === 'Admin' || currentUser?.role === 'Pengurus';

  // Helper to find photo by name in pengurusList
  const getPhotoByName = (name: string) => {
    const found = pengurusList.find((p) => p.nama.toLowerCase().includes(name.toLowerCase().trim()));
    return found?.fotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80';
  };

  const getNipcByName = (name: string) => {
    const found = pengurusList.find((p) => p.nama.toLowerCase().includes(name.toLowerCase().trim()));
    return found?.nipc || 'PBS-0000';
  };

  const handleOpenModal = () => {
    setFormData({
      ...struktur,
      namaSeluruhMurid: muridList.map((m) => `${m.nama} (${m.noKodeMurid})`),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onUpdateStruktur({
      ...formData,
      tanggalWaktu: new Date().toISOString().slice(0, 19).replace('T', ' '),
      namaSeluruhMurid: muridList.map((m) => `${m.nama} (${m.noKodeMurid})`),
    });
    setIsSubmitting(false);
    setIsModalOpen(false);
  };

  // Node Component for Visual Org Chart
  const OrgCard = ({
    role,
    name,
    badgeColor = 'bg-blue-900',
  }: {
    role: string;
    name: string;
    badgeColor?: string;
  }) => {
    const photo = getPhotoByName(name);
    const nipc = getNipcByName(name);
    return (
      <div className="bg-white rounded-2xl border-2 border-slate-200 p-3 shadow-md hover:shadow-lg transition-all hover:border-blue-500 flex flex-col items-center text-center w-48 relative group">
        <span
          className={`absolute -top-3 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider text-white ${badgeColor} shadow-sm`}
        >
          {role}
        </span>
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-600 shadow-sm mt-2 mb-1.5 bg-slate-100">
          <img
            src={photo}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
            referrerPolicy="no-referrer"
          />
        </div>
        <h4 className="font-bold text-xs text-slate-900 leading-snug line-clamp-2">
          {name || '-'}
        </h4>
        <span className="text-[10px] font-mono text-slate-500 mt-0.5">{nipc}</span>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Network className="w-5 h-5 text-blue-700" />
            Bagan Struktur Organisasi Pengurus Bintang Samudra
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Hierarki kepengurusan klub, pelatih berlisensi, staf operasional, dan murid binaan
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenExport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-sm transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Cetak Bagan (JPG / PDF)
          </button>

          {canEdit ? (
            <button
              onClick={handleOpenModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
            >
              <Edit className="w-4 h-4" />
              Kelola Struktur Pengurus
            </button>
          ) : (
            <div className="text-xs text-slate-400 italic bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              🔒 Form Khusus Admin &amp; Pengurus
            </div>
          )}
        </div>
      </div>

      {/* VISUAL ORGANIZATIONAL CHART (BAGAN INTERAKTIF) */}
      <section className="bg-gradient-to-b from-slate-50 to-slate-100/60 p-6 md:p-8 rounded-3xl border border-slate-200 shadow-inner overflow-x-auto">
        <div className="min-w-[850px] flex flex-col items-center space-y-8">
          {/* Level 1: MANAGER CLUB */}
          <div className="flex flex-col items-center">
            <OrgCard
              role="MANAGER CLUB"
              name={struktur.managerClub}
              badgeColor="bg-amber-600"
            />
            <div className="w-0.5 h-8 bg-blue-400"></div>
          </div>

          {/* Level 2: ASSISTEN MANAGER CLUB */}
          <div className="flex flex-col items-center">
            <OrgCard
              role="ASSISTEN MANAGER"
              name={struktur.assistenManagerClub}
              badgeColor="bg-blue-800"
            />
            <div className="w-0.5 h-8 bg-blue-400"></div>
          </div>

          {/* Level 3: SEKRETARIS & BENDAHARA */}
          <div className="flex flex-col items-center w-full">
            <div className="grid grid-cols-2 gap-16 relative">
              {/* Connector line between Sekretaris and Bendahara */}
              <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-blue-400 -mt-4"></div>
              <OrgCard
                role="SEKRETARIS"
                name={struktur.sekretaris}
                badgeColor="bg-indigo-700"
              />
              <OrgCard
                role="BENDAHARA"
                name={struktur.bendahara}
                badgeColor="bg-emerald-700"
              />
            </div>
            <div className="w-0.5 h-8 bg-blue-400 mt-2"></div>
          </div>

          {/* Level 4: KEPELATIHAN (HEAD COACH & COACH) */}
          <div className="flex flex-col items-center w-full">
            <div className="text-center mb-2">
              <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 bg-blue-900 text-sky-200 rounded-full">
                DIVISI KEPELATIHAN &amp; TEKNIK ATLET
              </span>
            </div>
            <div className="grid grid-cols-2 gap-12">
              <OrgCard
                role="HEAD COACH"
                name={struktur.headCoach}
                badgeColor="bg-rose-700"
              />
              <OrgCard role="COACH" name={struktur.coach} badgeColor="bg-orange-600" />
            </div>
            <div className="w-0.5 h-8 bg-blue-400 mt-2"></div>
          </div>

          {/* Level 5: SEKSI-SEKSI OPERASIONAL */}
          <div className="w-full">
            <div className="text-center mb-3">
              <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 bg-slate-800 text-slate-200 rounded-full">
                SEKSI BIDANG OPERASIONAL KLUB
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <OrgCard
                role="SIE HUMAS"
                name={struktur.sieHumas}
                badgeColor="bg-cyan-700"
              />
              <OrgCard
                role="SIE PERWASITAN"
                name={struktur.siePerwasitanPertandingan}
                badgeColor="bg-violet-700"
              />
              <OrgCard
                role="SIE PROTOKOLER"
                name={struktur.sieProtokoler}
                badgeColor="bg-fuchsia-700"
              />
              <OrgCard
                role="SIE DOKUMENTASI"
                name={struktur.sieDokumentasiPromosi}
                badgeColor="bg-pink-700"
              />
              <OrgCard
                role="SIE KEAMANAN"
                name={struktur.sieKeamanan}
                badgeColor="bg-zinc-700"
              />
              <OrgCard
                role="SIE KEBUGARAN"
                name={struktur.sieKebugaran}
                badgeColor="bg-teal-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION NAMA SELURUH MURID BINAAN (Otomatis mengambil data dari Data_Murid) */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-700" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Daftar Seluruh Murid / Atlet Binaan Bintang Samudra
              </h3>
              <p className="text-xs text-slate-500">
                (Otomatis mengambil data real-time dari urutan Data_Murid)
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-800 rounded-full border border-blue-200">
            Total Terdaftar: {muridList.length} Atlet
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {muridList.map((m, idx) => (
            <div
              key={m.id}
              className="bg-slate-50 hover:bg-blue-50/60 p-3 rounded-xl border border-slate-200 flex items-center gap-2.5 transition group"
            >
              <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-300 shrink-0 bg-white">
                <img
                  src={m.fotoUrl}
                  alt={m.nama}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h5 className="font-bold text-xs text-slate-800 truncate group-hover:text-blue-900">
                  {m.nama}
                </h5>
                <span className="text-[10px] font-mono text-slate-500 block">
                  {m.noKodeMurid} • {m.jenisKelamin === 'Laki - Laki' ? 'Putra' : 'Putri'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL INPUT / EDIT STRUKTUR PENGURUS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Network className="w-5 h-5 text-blue-300" />
                <div>
                  <h3 className="font-bold text-base">Input &amp; Perbarui Data Struktur</h3>
                  <p className="text-xs text-blue-200">
                    Google Sheets: <span className="font-mono">Data_Struktur</span>
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

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    MANAGER CLUB
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.managerClub || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, managerClub: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    ASSISTEN MANAGER CLUB
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.assistenManagerClub || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, assistenManagerClub: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    SEKRETARIS
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sekretaris || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, sekretaris: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    BENDAHARA
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.bendahara || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, bendahara: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    HEAD COACH
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.headCoach || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, headCoach: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    COACH
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.coach || ''}
                    onChange={(e) => setFormData({ ...formData, coach: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    SIE HUMAS
                  </label>
                  <input
                    type="text"
                    value={formData.sieHumas || ''}
                    onChange={(e) => setFormData({ ...formData, sieHumas: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    SIE PERWASITAN &amp; PERTANDINGAN
                  </label>
                  <input
                    type="text"
                    value={formData.siePerwasitanPertandingan || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        siePerwasitanPertandingan: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    SIE PROTOKOLER
                  </label>
                  <input
                    type="text"
                    value={formData.sieProtokoler || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, sieProtokoler: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    SIE DOKUMENTASI &amp; PROMOSI
                  </label>
                  <input
                    type="text"
                    value={formData.sieDokumentasiPromosi || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sieDokumentasiPromosi: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    SIE KEAMANAN
                  </label>
                  <input
                    type="text"
                    value={formData.sieKeamanan || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, sieKeamanan: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    SIE KEBUGARAN
                  </label>
                  <input
                    type="text"
                    value={formData.sieKebugaran || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, sieKebugaran: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Menyimpan...' : 'Kirim ke Data_Struktur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
