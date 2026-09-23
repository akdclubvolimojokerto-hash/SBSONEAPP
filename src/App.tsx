import React, { useState, useEffect } from 'react';
import {
  User,
  DataMurid,
  DataPengurus,
  DataKegiatan,
  JadwalPelatihan,
  DataAbsen,
  DataStruktur,
  JadwalPiket,
  Keuangan,
  ReportType,
  ActiveTab,
} from './types';
import {
  INITIAL_USERS,
  INITIAL_MURID,
  INITIAL_PENGURUS,
  INITIAL_KEGIATAN,
  INITIAL_JADWAL,
  INITIAL_ABSEN,
  INITIAL_STRUKTUR,
  INITIAL_PIKET,
  INITIAL_KEUANGAN,
  CLUB_INFO,
} from './constants/initialData';
import { sheetsService } from './services/sheetsService';

// UI Components
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { MuridView } from './components/MuridView';
import { PengurusView } from './components/PengurusView';
import { JadwalPelatihanView } from './components/JadwalPelatihanView';
import { AbsensiView } from './components/AbsensiView';
import { StrukturPengurusView } from './components/StrukturPengurusView';
import { JadwalPiketView } from './components/JadwalPiketView';
import { KeuanganView } from './components/KeuanganView';
import { RiwayatLaporanView } from './components/RiwayatLaporanView';

// Modals
import { FormKegiatanModal } from './components/FormKegiatanModal';
import { FormMuridModal } from './components/FormMuridModal';
import { FormPengurusModal } from './components/FormPengurusModal';
import { AuthModal } from './components/AuthModal';
import { ExportModal } from './components/ExportModal';
import { OfficialLetterhead } from './components/OfficialLetterhead';
import { OfficialReportContent } from './components/OfficialReportContent';
import { PbvsiLogo, BintangSamudraLogo } from './components/Logos';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Auth State
  // Default to Admin logged-in for immediate review, but full login/logout supported!
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('bs_one_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_USERS[0];
      }
    }
    return INITIAL_USERS[0]; // Admin by default
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('bs_one_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  // Domain Entities State (with LocalStorage caching + Google Sheets sync)
  const [muridList, setMuridList] = useState<DataMurid[]>(() => {
    const saved = localStorage.getItem('bs_one_murid');
    return saved ? JSON.parse(saved) : INITIAL_MURID;
  });

  const [pengurusList, setPengurusList] = useState<DataPengurus[]>(() => {
    const saved = localStorage.getItem('bs_one_pengurus');
    return saved ? JSON.parse(saved) : INITIAL_PENGURUS;
  });

  const [kegiatanList, setKegiatanList] = useState<DataKegiatan[]>(() => {
    const saved = localStorage.getItem('bs_one_kegiatan');
    return saved ? JSON.parse(saved) : INITIAL_KEGIATAN;
  });

  const [jadwalList, setJadwalList] = useState<JadwalPelatihan[]>(() => {
    const saved = localStorage.getItem('bs_one_jadwal');
    return saved ? JSON.parse(saved) : INITIAL_JADWAL;
  });

  const [absenList, setAbsenList] = useState<DataAbsen[]>(() => {
    const saved = localStorage.getItem('bs_one_absen');
    return saved ? JSON.parse(saved) : INITIAL_ABSEN;
  });

  const [struktur, setStruktur] = useState<DataStruktur>(() => {
    const saved = localStorage.getItem('bs_one_struktur');
    return saved ? JSON.parse(saved) : INITIAL_STRUKTUR;
  });

  const [piketList, setPiketList] = useState<JadwalPiket[]>(() => {
    const saved = localStorage.getItem('bs_one_piket');
    return saved ? JSON.parse(saved) : INITIAL_PIKET;
  });

  const [keuanganList, setKeuanganList] = useState<Keuangan[]>(() => {
    const saved = localStorage.getItem('bs_one_keuangan');
    return saved ? JSON.parse(saved) : INITIAL_KEUANGAN;
  });

  // Modals Visibility
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isFormKegiatanOpen, setIsFormKegiatanOpen] = useState(false);
  const [isFormMuridOpen, setIsFormMuridOpen] = useState(false);
  const [isFormPengurusOpen, setIsFormPengurusOpen] = useState(false);
  const [editingMurid, setEditingMurid] = useState<DataMurid | null>(null);
  const [editingPengurus, setEditingPengurus] = useState<DataPengurus | null>(null);
  const [editingKegiatan, setEditingKegiatan] = useState<DataKegiatan | null>(null);

  // Export Modal State
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportReportType, setExportReportType] = useState<ReportType>('murid');
  const [exportData, setExportData] = useState<any[]>([]);

  // Toast Notification
  const [toastMsg, setToastMsg] = useState<{ title: string; desc: string } | null>(null);

  const showToast = (title: string, desc: string) => {
    setToastMsg({ title, desc });
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('bs_one_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('bs_one_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('bs_one_murid', JSON.stringify(muridList));
  }, [muridList]);

  useEffect(() => {
    localStorage.setItem('bs_one_pengurus', JSON.stringify(pengurusList));
  }, [pengurusList]);

  useEffect(() => {
    localStorage.setItem('bs_one_kegiatan', JSON.stringify(kegiatanList));
  }, [kegiatanList]);

  useEffect(() => {
    localStorage.setItem('bs_one_jadwal', JSON.stringify(jadwalList));
  }, [jadwalList]);

  useEffect(() => {
    localStorage.setItem('bs_one_absen', JSON.stringify(absenList));
  }, [absenList]);

  useEffect(() => {
    localStorage.setItem('bs_one_struktur', JSON.stringify(struktur));
  }, [struktur]);

  useEffect(() => {
    localStorage.setItem('bs_one_piket', JSON.stringify(piketList));
  }, [piketList]);

  useEffect(() => {
    localStorage.setItem('bs_one_keuangan', JSON.stringify(keuanganList));
  }, [keuanganList]);

  // Auth Handlers
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    showToast('Login Berhasil', `Selamat datang kembali, ${user.username} (${user.role})`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast('Logout Berhasil', 'Anda kini dalam mode tamu publik');
  };

  const handleRegister = async (user: User) => {
    setUsers((prev) => [...prev, user]);
    setCurrentUser(user);
    showToast('Registrasi Berhasil', `Akun ${user.username} berhasil didaftarkan di role ${user.role}`);
    // Sync with Google Sheets Users
    await sheetsService.insert('Users', user);
  };

  // CRUD Handlers for each Sheet
  // 1. Kegiatan
  const handleSaveKegiatan = async (kegiatan: DataKegiatan) => {
    const existingIndex = kegiatanList.findIndex((k) => k.id === kegiatan.id);
    if (existingIndex >= 0) {
      setKegiatanList((prev) => {
        const copy = [...prev];
        copy[existingIndex] = kegiatan;
        return copy;
      });
      showToast('Kegiatan Diperbarui', `"${kegiatan.judulKegiatan}" berhasil diperbarui`);
      await sheetsService.update('Data_Kegiatan', kegiatan.id, kegiatan);
    } else {
      setKegiatanList((prev) => [kegiatan, ...prev]);
      showToast('Kegiatan Ditambahkan', `"${kegiatan.judulKegiatan}" tersimpan`);
      await sheetsService.insert('Data_Kegiatan', kegiatan);
    }
    setEditingKegiatan(null);
  };

  const handleEditKegiatan = (kegiatan: DataKegiatan) => {
    if (currentUser?.role !== 'Admin') {
      showToast('Akses Ditolak', 'Hanya Admin yang dapat mengedit data kegiatan');
      return;
    }
    setEditingKegiatan(kegiatan);
    setIsFormKegiatanOpen(true);
  };

  // 2. Murid
  const handleSaveMurid = async (murid: DataMurid) => {
    const existingIndex = muridList.findIndex((m) => m.id === murid.id);
    if (existingIndex >= 0) {
      setMuridList((prev) => {
        const copy = [...prev];
        copy[existingIndex] = murid;
        return copy;
      });
      showToast('Perubahan Disimpan', `Data murid ${murid.nama} (${murid.noKodeMurid}) berhasil diperbarui`);
      await sheetsService.update('Data_Murid', murid.id, murid);
    } else {
      setMuridList((prev) => [murid, ...prev]);
      showToast('Pendaftaran Berhasil', `Atlet ${murid.nama} (Kode: ${murid.noKodeMurid}) berhasil terdaftar`);
      await sheetsService.insert('Data_Murid', murid);
    }
    setEditingMurid(null);
  };

  const handleEditMurid = (murid: DataMurid) => {
    setEditingMurid(murid);
    setIsFormMuridOpen(true);
  };

  const handleApproveMurid = async (muridId: string) => {
    setMuridList((prev) =>
      prev.map((m) => (m.id === muridId ? { ...m, statusApproval: 'Approved', statusApprove: 'Disetujui' } : m))
    );
    const updated = muridList.find((m) => m.id === muridId);
    if (updated) {
      await sheetsService.update('Data_Murid', muridId, { ...updated, statusApproval: 'Approved', statusApprove: 'Disetujui' });
    }
    showToast('Murid Telah Diapprove', 'Status atlet binaan resmi disetujui PBVSI Bintang Samudra');
  };

  const handleDeleteMurid = async (muridId: string) => {
    setMuridList((prev) => prev.filter((m) => m.id !== muridId));
    await sheetsService.delete('Data_Murid', muridId);
    showToast('Data Dihapus', 'Data murid telah dihapus dari sistem');
  };

  // 3. Pengurus
  const handleSavePengurus = async (pengurus: DataPengurus) => {
    const existingIndex = pengurusList.findIndex((p) => p.id === pengurus.id);
    if (existingIndex >= 0) {
      setPengurusList((prev) => {
        const copy = [...prev];
        copy[existingIndex] = pengurus;
        return copy;
      });
      showToast('Perubahan Disimpan', `Data pengurus ${pengurus.nama} (${pengurus.jabatanPengurus}) diperbarui`);
      await sheetsService.update('Data_Pengurus', pengurus.id, pengurus);
    } else {
      setPengurusList((prev) => [pengurus, ...prev]);
      showToast('Pengurus Ditambahkan', `${pengurus.nama} (${pengurus.jabatanPengurus}) tersimpan`);
      await sheetsService.insert('Data_Pengurus', pengurus);
    }
    setEditingPengurus(null);
  };

  const handleEditPengurus = (pengurus: DataPengurus) => {
    setEditingPengurus(pengurus);
    setIsFormPengurusOpen(true);
  };

  const handleDeletePengurus = async (id: string) => {
    setPengurusList((prev) => prev.filter((p) => p.id !== id));
    await sheetsService.delete('Data_Pengurus', id);
    showToast('Data Dihapus', 'Pengurus telah dihapus');
  };

  // Generic edit for Riwayat Laporan
  const handleEditRecord = (category: ReportType, item: any) => {
    if (category === 'murid') {
      handleEditMurid(item);
    } else if (category === 'pengurus') {
      handleEditPengurus(item);
    } else if (category === 'kegiatan') {
      if (currentUser?.role === 'Admin') {
        handleEditKegiatan(item);
      } else {
        showToast('Akses Ditolak', 'Hanya Admin yang dapat mengedit data kegiatan');
      }
    } else {
      showToast('Edit Data', `Mengedit data ${category} ID: ${item.id || item.noKodeMurid}`);
    }
  };

  // 4. Jadwal Pelatihan
  const handleAddJadwal = async (jadwal: JadwalPelatihan) => {
    setJadwalList((prev) => [jadwal, ...prev]);
    showToast('Jadwal Ditambahkan', `Sesi hari ${jadwal.hari} (${jadwal.nama}) tersimpan`);
    await sheetsService.insert('Jadwal_Pelatihan', jadwal);
  };

  // 5. Absen
  const handleAddAbsen = async (absen: DataAbsen) => {
    // Check if record for same student and same day already exists; if so update, else add
    setAbsenList((prev) => {
      const idx = prev.findIndex(
        (a) =>
          a.noKodeMurid === absen.noKodeMurid &&
          a.bulanTahun === absen.bulanTahun &&
          a.tanggalHari === absen.tanggalHari
      );
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = absen;
        return copy;
      }
      return [...prev, absen];
    });
    showToast('Absensi Tersimpan', `${absen.nama} status: ${absen.status}`);
    await sheetsService.insert('Data_Absen', absen);
  };

  // 6. Struktur
  const handleUpdateStruktur = async (newStruktur: DataStruktur) => {
    setStruktur(newStruktur);
    showToast('Struktur Diperbarui', 'Hierarki organisasi telah diupdate');
    await sheetsService.insert('Data_Struktur', newStruktur);
  };

  // 7. Piket
  const handleAddPiket = async (piket: JadwalPiket) => {
    setPiketList((prev) => [piket, ...prev]);
    showToast('Piket Ditambahkan', `Jadwal hari ${piket.hari} untuk ${piket.nama} tersimpan`);
    await sheetsService.insert('Jadwal_Piket', piket);
  };

  // 8. Keuangan
  const handleAddKeuangan = async (entry: Keuangan) => {
    setKeuanganList((prev) => [...prev, entry]);
    showToast('Transaksi Keuangan Tercatat', `${entry.uraianCatatan} tersimpan`);
    await sheetsService.insert('Keuangan', entry);
  };

  const handleDeleteKegiatan = async (id: string) => {
    const item = kegiatanList.find((k) => k.id === id);
    setKegiatanList((prev) => prev.filter((k) => k.id !== id));
    await sheetsService.delete('Data_Kegiatan', id);
    showToast('Kegiatan Dihapus', item ? `"${item.judulKegiatan}" telah dihapus` : 'Data kegiatan berhasil dihapus');
  };

  // Generic delete for Riwayat Laporan
  const handleDeleteRecord = async (category: ReportType, id: string) => {
    switch (category) {
      case 'murid':
        await handleDeleteMurid(id);
        break;
      case 'pengurus':
        await handleDeletePengurus(id);
        break;
      case 'kegiatan':
        await handleDeleteKegiatan(id);
        break;
      case 'jadwal':
        setJadwalList((prev) => prev.filter((j) => j.id !== id));
        await sheetsService.delete('Jadwal_Pelatihan', id);
        showToast('Jadwal Dihapus', 'Jadwal pelatihan telah dihapus');
        break;
      case 'absen':
        setAbsenList((prev) => prev.filter((a) => a.id !== id));
        await sheetsService.delete('Data_Absen', id);
        showToast('Presensi Dihapus', 'Data presensi berhasil dihapus');
        break;
      case 'piket':
        setPiketList((prev) => prev.filter((p) => p.id !== id));
        await sheetsService.delete('Jadwal_Piket', id);
        showToast('Piket Dihapus', 'Jadwal piket berhasil dihapus');
        break;
      case 'keuangan':
        setKeuanganList((prev) => prev.filter((k) => k.id !== id));
        await sheetsService.delete('Keuangan', id);
        showToast('Data Keuangan Dihapus', 'Catatan keuangan berhasil dihapus');
        break;
    }
  };

  // Open Export Modal with pre-filtered data
  const handleOpenExport = (type: ReportType, customData?: any[]) => {
    setExportReportType(type);
    if (customData) {
      setExportData(customData);
    } else {
      switch (type) {
        case 'murid':
          setExportData(muridList);
          break;
        case 'pengurus':
          setExportData(pengurusList);
          break;
        case 'kegiatan':
          setExportData(kegiatanList);
          break;
        case 'jadwal':
          setExportData(jadwalList);
          break;
        case 'absen':
          setExportData(absenList);
          break;
        case 'piket':
          setExportData(piketList);
          break;
        case 'keuangan':
          setExportData(keuanganList);
          break;
      }
    }
    setIsExportModalOpen(true);
  };

  // Export Modal Titles
  const getExportTitle = () => {
    switch (exportReportType) {
      case 'murid':
        return 'LAPORAN REKAPITULASI ATLET / DATA MURID';
      case 'pengurus':
        return 'LAPORAN DATA PENGURUS & PELATIH RESMI';
      case 'kegiatan':
        return 'LAPORAN RANGKAIAN KEGIATAN & DOKUMENTASI KLUB';
      case 'jadwal':
        return 'SURAT KEPUTUSAN JADWAL RESMI PELATIHAN BOLA VOLI';
      case 'absen':
        return 'REKAPITULASI PRESENSI KEHADIRAN ATLET BINAAN';
      case 'piket':
        return 'JADWAL PIKET KEBERSIHAN & PERAWATAN LAPANGAN';
      case 'keuangan':
        return 'LAPORAN ARUS KAS & PEMBUKUAN KEUANGAN KLUB';
      default:
        return 'LAPORAN RESMI BINTANG SAMUDRA';
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      {/* Top Main Navigation */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSelectTab={setActiveTab}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onAddMurid={() => {
          setEditingMurid(null);
          setIsFormMuridOpen(true);
        }}
        onAddKegiatan={() => {
          setEditingKegiatan(null);
          setIsFormKegiatanOpen(true);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            kegiatanList={kegiatanList}
            muridList={muridList}
            pengurusList={pengurusList}
            keuanganList={keuanganList}
            currentUser={currentUser}
            onOpenAddKegiatan={() => {
              setEditingKegiatan(null);
              setIsFormKegiatanOpen(true);
            }}
            onEditKegiatan={handleEditKegiatan}
            onDeleteKegiatan={handleDeleteKegiatan}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'murid' && (
          <MuridView
            muridList={muridList}
            currentUser={currentUser}
            onOpenAddMurid={() => {
              setEditingMurid(null);
              setIsFormMuridOpen(true);
            }}
            onEditMurid={handleEditMurid}
            onApproveMurid={handleApproveMurid}
            onDeleteMurid={handleDeleteMurid}
            onOpenExport={(data) => handleOpenExport('murid', data)}
          />
        )}

        {activeTab === 'pengurus' && (
          <PengurusView
            pengurusList={pengurusList}
            currentUser={currentUser}
            onOpenAddPengurus={() => {
              setEditingPengurus(null);
              setIsFormPengurusOpen(true);
            }}
            onEditPengurus={handleEditPengurus}
            onDeletePengurus={handleDeletePengurus}
            onOpenExport={(data) => handleOpenExport('pengurus', data)}
          />
        )}

        {(activeTab === 'jadwal' || activeTab === 'pelatihan') && (
          <JadwalPelatihanView
            jadwalList={jadwalList}
            pengurusList={pengurusList}
            currentUser={currentUser}
            onAddJadwal={handleAddJadwal}
            onOpenExport={(data) => handleOpenExport('jadwal', data)}
          />
        )}

        {activeTab === 'absen' && (
          <AbsensiView
            absenList={absenList}
            muridList={muridList}
            currentUser={currentUser}
            onAddAbsen={handleAddAbsen}
            onOpenExport={(data) => handleOpenExport('absen', data)}
          />
        )}

        {activeTab === 'struktur' && (
          <StrukturPengurusView
            struktur={struktur}
            pengurusList={pengurusList}
            muridList={muridList}
            currentUser={currentUser}
            onUpdateStruktur={handleUpdateStruktur}
            onOpenExport={() => handleOpenExport('pengurus', pengurusList)}
          />
        )}

        {activeTab === 'piket' && (
          <JadwalPiketView
            piketList={piketList}
            muridList={muridList}
            currentUser={currentUser}
            onAddPiket={handleAddPiket}
            onOpenExport={(data) => handleOpenExport('piket', data)}
          />
        )}

        {activeTab === 'keuangan' && (
          <KeuanganView
            keuanganList={keuanganList}
            currentUser={currentUser}
            onAddKeuangan={handleAddKeuangan}
            onOpenExport={(data) => handleOpenExport('keuangan', data)}
          />
        )}

        {activeTab === 'laporan' && (
          <RiwayatLaporanView
            muridList={muridList}
            pengurusList={pengurusList}
            kegiatanList={kegiatanList}
            jadwalList={jadwalList}
            absenList={absenList}
            piketList={piketList}
            keuanganList={keuanganList}
            currentUser={currentUser}
            onApproveMurid={handleApproveMurid}
            onDeleteRecord={handleDeleteRecord}
            onEditRecord={handleEditRecord}
            onOpenExportModal={(type, data) => handleOpenExport(type, data)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BintangSamudraLogo className="h-8 w-auto max-w-[70px]" />
            <div>
              <div className="font-bold text-slate-800">
                SYSTEM BS ONE • Bintang Samudra Volleyball Club
              </div>
              <p className="text-[11px] text-slate-400">
                {CLUB_INFO.alamat} • WhatsApp: {CLUB_INFO.telp}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="bg-blue-50 text-blue-800 font-bold px-3 py-1 rounded-full border border-blue-200">
              Afiliasi Resmi PBVSI Mojokerto
            </span>
            <span>&copy; {new Date().getFullYear()} Hak Cipta Dilindungi</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Auth Modal (Login / Sign Up) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onLoginSuccess={handleLogin}
        onRegister={handleRegister}
        onRegisterUser={handleRegister}
        users={users}
        existingUsers={users}
      />

      {/* 2. Form Kegiatan Modal */}
      <FormKegiatanModal
        isOpen={isFormKegiatanOpen}
        onClose={() => {
          setIsFormKegiatanOpen(false);
          setEditingKegiatan(null);
        }}
        onSubmit={handleSaveKegiatan}
        initialData={editingKegiatan}
        currentUserName={currentUser?.username || 'Admin'}
      />

      {/* 4. Form Murid Modal (Dukungan Tambah & Edit Murid) */}
      <FormMuridModal
        isOpen={isFormMuridOpen}
        onClose={() => {
          setIsFormMuridOpen(false);
          setEditingMurid(null);
        }}
        onSubmit={handleSaveMurid}
        initialData={editingMurid}
        currentUser={currentUser}
        muridCount={muridList.length}
      />

      {/* 5. Form Pengurus Modal (Dukungan Tambah & Edit Pengurus) */}
      <FormPengurusModal
        isOpen={isFormPengurusOpen}
        onClose={() => {
          setIsFormPengurusOpen(false);
          setEditingPengurus(null);
        }}
        onSubmit={handleSavePengurus}
        initialData={editingPengurus}
      />

      {/* 6. Export Official Document Modal (JPG & PDF with KOP PBVSI & A4 Layout) */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title={getExportTitle()}
        defaultFilename={`BINTANG_SAMUDRA_${exportReportType.toUpperCase()}`}
        isAdmin={currentUser?.role === 'Admin'}
      >
        <OfficialLetterhead
          judulSurat={getExportTitle()}
          nomorSurat={`042/BS/${exportReportType.toUpperCase()}/IX/2026`}
          perihal={`Penyampaian ${getExportTitle()}`}
          isAdmin={currentUser?.role === 'Admin'}
          managerName={
            pengurusList.find((p) => p.jabatanPengurus === 'MANAGER CLUB')?.nama ||
            'H. Budi Santoso, S.Pd'
          }
          sekretarisName={
            exportReportType === 'keuangan'
              ? pengurusList.find((p) => p.jabatanPengurus === 'BENDAHARA')?.nama ||
                'Siti Rahmawati, S.E'
              : pengurusList.find((p) => p.jabatanPengurus === 'SEKRETARIS')?.nama ||
                'Dian Permata, S.Kom'
          }
        >
          <OfficialReportContent
            reportType={exportReportType}
            data={exportData}
            struktur={struktur}
          />
        </OfficialLetterhead>
      </ExportModal>

      {/* TOAST FLOATING NOTIFICATION */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-start gap-3 max-w-sm animate-bounce">
          <div className="p-1 bg-blue-600 rounded-lg shrink-0 mt-0.5">
            <BintangSamudraLogo className="w-4 h-4 text-white" />
          </div>
          <div>
            <h5 className="font-bold text-xs">{toastMsg.title}</h5>
            <p className="text-[11px] text-slate-300 leading-snug">{toastMsg.desc}</p>
          </div>
        </div>
      )}
    </div>
  );
}
