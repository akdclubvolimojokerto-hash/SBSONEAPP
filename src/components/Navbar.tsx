import React, { useState, useEffect } from 'react';
import {
  ActiveTab,
  User,
} from '../types';
import {
  BintangSamudraLogo,
} from './Logos';
import { LogoSettingsModal } from './LogoSettingsModal';
import {
  Home,
  Users,
  UserCheck,
  Calendar,
  ClipboardCheck,
  Network,
  Brush,
  Wallet,
  FileSpreadsheet,
  Database,
  LogIn,
  LogOut,
  Shield,
  Clock,
  Menu,
  X,
  UserPlus,
  Image as ImageIcon,
} from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab?: (tab: ActiveTab) => void;
  onSelectTab?: (tab: ActiveTab) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onAddMurid?: () => void;
  onAddKegiatan?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onSelectTab,
  currentUser,
  onOpenAuth,
  onLogout,
  onAddMurid,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const isAdmin = currentUser?.role === 'Admin';

  const handleTabChange = (tab: ActiveTab) => {
    if (typeof setActiveTab === 'function') {
      setActiveTab(tab);
    }
    if (typeof onSelectTab === 'function') {
      onSelectTab(tab);
    }
  };

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('id-ID', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Kegiatan & Utama', icon: Home },
    { id: 'murid', label: 'Data Murid', icon: Users },
    { id: 'pengurus', label: 'Pengurus Club', icon: UserCheck },
    { id: 'jadwal', label: 'Jadwal Pelatihan', icon: Calendar },
    { id: 'absen', label: 'Absensi Murid', icon: ClipboardCheck },
    { id: 'struktur', label: 'Struktur Organisasi', icon: Network },
    { id: 'piket', label: 'Jadwal Piket', icon: Brush },
    { id: 'keuangan', label: 'Keuangan Club', icon: Wallet },
    { id: 'laporan', label: 'Riwayat & Cetak Laporan', icon: FileSpreadsheet },
  ];

  const isTabActive = (itemId: ActiveTab) => {
    if (itemId === 'jadwal' || itemId === 'pelatihan') {
      return activeTab === 'jadwal' || activeTab === 'pelatihan';
    }
    return activeTab === itemId;
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-blue-900/60 shadow-lg text-white">
      {/* Top Meta Bar */}
      <div className="bg-slate-950/80 px-4 py-1.5 border-b border-white/5 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-slate-300">
          <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span className="font-mono text-[11px] tracking-wide text-slate-200">
            {currentTime || 'Memuat waktu...'}
          </span>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:inline text-[11px] text-slate-400">
            Kemlagi, Mojokerto • PBVSI Terdaftar
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Tombol Pendaftaran Murid Baru - Terbuka untuk SEMUA USER */}
          {onAddMurid && (
            <button
              onClick={onAddMurid}
              className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-full font-bold text-[11px] shadow-sm transition transform active:scale-95 cursor-pointer border border-blue-400/40"
              title="Pendaftaran Murid / Atlet Baru (Akses Semua User)"
            >
              <UserPlus className="w-3.5 h-3.5 text-blue-200" />
              <span>Daftar Murid</span>
            </button>
          )}

          {/* User Auth Info */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-900/60 border border-blue-700/50 rounded-full text-[11px]">
                <Shield className="w-3 h-3 text-amber-400" />
                <span className="font-bold text-white">{currentUser.username}</span>
                <span className="text-blue-200">({currentUser.role})</span>
              </span>
              <button
                onClick={onLogout}
                className="flex items-center gap-1 text-slate-400 hover:text-rose-400 transition cursor-pointer text-[11px]"
                title="Keluar akun"
              >
                <LogOut className="w-3 h-3" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1 px-3 py-0.5 bg-blue-700 hover:bg-blue-600 text-white rounded-full font-bold text-[11px] shadow transition cursor-pointer"
            >
              <LogIn className="w-3 h-3" />
              <span>Login / Masuk</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Brand & Logo */}
        <div className="flex items-center gap-2 select-none">
          <div
            onClick={() => handleTabChange('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="flex items-center">
              <BintangSamudraLogo className="h-12 sm:h-14 w-auto max-w-[160px] transition-transform group-hover:scale-105 shrink-0" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg sm:text-xl tracking-wider uppercase bg-gradient-to-r from-white via-blue-100 to-sky-300 bg-clip-text text-transparent">
                  SYSTEM BS ONE
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-800 text-sky-200 font-bold tracking-widest uppercase">
                  VC
                </span>
              </div>
              <p className="text-[10px] text-blue-300 font-medium tracking-wide">
                Volleyball Club Bintang Samudra
              </p>
            </div>
          </div>
          {isAdmin && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsLogoModalOpen(true);
              }}
              title="Ubah Link / Gambar Logo Klub (Khusus Admin)"
              className="p-1.5 text-blue-200 hover:text-white bg-blue-800/40 hover:bg-blue-700/60 rounded-lg transition-all ml-1 cursor-pointer border border-blue-700/50"
            >
              <ImageIcon className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Desktop Menu Tabs */}
        <nav className="hidden xl:flex items-center gap-1 overflow-x-auto py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isTabActive(item.id);
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  active
                    ? 'bg-blue-700 text-white shadow-md shadow-blue-950'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-blue-300'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Mobile menu toggle button */}
        <div className="flex items-center gap-2 xl:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-slate-950 border-t border-slate-800 px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isTabActive(item.id);
            return (
              <button
                key={item.id}
                onClick={() => {
                  handleTabChange(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition text-left cursor-pointer ${
                  active
                    ? 'bg-blue-700 text-white font-bold'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 text-blue-400" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}

      <LogoSettingsModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
        currentUser={currentUser}
        isAdmin={isAdmin}
      />
    </header>
  );
};
