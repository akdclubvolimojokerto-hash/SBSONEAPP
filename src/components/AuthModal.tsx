import React, { useState } from 'react';
import {
  User as UserIcon,
  Lock,
  Phone,
  Shield,
  LogIn,
  UserPlus,
  X,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { User, UserRole } from '../types';
import { BintangSamudraLogo, PbvsiLogo } from './Logos';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (user: User) => void;
  onLogin?: (user: User) => void;
  users?: User[];
  existingUsers?: User[];
  onRegisterUser?: (newUser: User) => Promise<boolean | void>;
  onRegister?: (newUser: User) => Promise<boolean | void>;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onLogin,
  users: propUsers,
  existingUsers,
  onRegisterUser,
  onRegister,
}) => {
  const users = existingUsers || propUsers || [];
  const handleLoginCallback = (user: User) => {
    if (typeof onLoginSuccess === 'function') {
      onLoginSuccess(user);
    } else if (typeof onLogin === 'function') {
      onLogin(user);
    }
  };
  const handleRegisterCallback = async (newUser: User): Promise<boolean> => {
    if (typeof onRegisterUser === 'function') {
      const res = await onRegisterUser(newUser);
      return res !== false;
    }
    if (typeof onRegister === 'function') {
      const res = await onRegister(newUser);
      return res !== false;
    }
    return true;
  };
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [username, setUsername] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('Murid');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanUser = username.trim();
    const cleanPass = password.trim();

    // Special validation for Admin as strictly requested by user:
    // USERNAME: adminBs, Password: Admin2026
    if (cleanUser === 'adminBs' && cleanPass === 'Admin2026') {
      const adminUser: User = {
        id: 'user-admin',
        username: 'adminBs',
        whatsapp: '0859-4400-4657',
        role: 'Admin',
        createdAt: new Date().toISOString(),
      };
      handleLoginCallback(adminUser);
      onClose();
      return;
    }

    // Normal validation from Users data
    const matched = users.find(
      (u) =>
        u.username.toLowerCase() === cleanUser.toLowerCase() &&
        u.password === cleanPass
    );

    if (matched) {
      handleLoginCallback(matched);
      onClose();
    } else {
      setError(
        'Username atau Password salah. Untuk akun admin resmi gunakan: adminBs / Admin2026'
      );
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!username.trim() || !whatsapp.trim() || !password.trim()) {
      setError('Harap isi semua bidang: Username, Nomor WhatsApp, dan Password!');
      return;
    }

    // Check if username already exists
    const exists = users.some(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase()
    );
    if (exists) {
      setError('Username sudah digunakan! Silakan pilih username lain.');
      return;
    }

    setLoading(true);
    const newUser: User = {
      id: `user-${Date.now()}`,
      username: username.trim(),
      whatsapp: whatsapp.trim(),
      password: password.trim(),
      role: role,
      createdAt: new Date().toISOString(),
    };

    const ok = await handleRegisterCallback(newUser);
    setLoading(false);

    if (ok) {
      setSuccess('Pendaftaran berhasil! Akun telah tersimpan di database Users.');
      setTimeout(() => {
        handleLoginCallback(newUser);
        onClose();
      }, 1200);
    } else {
      setError('Terjadi kesalahan saat mendaftar. Silakan coba lagi.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-slate-100 overflow-hidden">
        {/* Header Hero */}
        <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex justify-center items-center gap-3 mb-3">
            <PbvsiLogo className="w-12 h-12" />
            <div className="w-px h-8 bg-white/30"></div>
            <BintangSamudraLogo className="w-20 h-10 object-contain" />
          </div>

          <h2 className="text-xl font-black tracking-wider uppercase">
            SYSTEM BS ONE
          </h2>
          <p className="text-xs text-blue-200 mt-0.5">
            Volleyball Club Bintang Samudra
          </p>

          {/* Mode Tabs */}
          <div className="flex mt-5 bg-blue-950/50 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => {
                setMode('login');
                setError(null);
                setSuccess(null);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'login'
                  ? 'bg-white text-blue-950 shadow-md'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              Masuk (Login)
            </button>
            <button
              onClick={() => {
                setMode('signup');
                setError(null);
                setSuccess(null);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'signup'
                  ? 'bg-white text-blue-950 shadow-md'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              Daftar (Sign Up)
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Contoh: adminBs atau username Anda"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Quick Admin Credential Helper Banner */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-900 space-y-1">
                <div className="flex items-center gap-1 font-bold text-blue-950">
                  <Sparkles className="w-3.5 h-3.5 text-blue-700" />
                  <span>Kredensial Default Sistem:</span>
                </div>
                <div className="flex justify-between items-center pt-0.5">
                  <span>
                    Admin: <strong className="font-mono">adminBs</strong> / <strong className="font-mono">Admin2026</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setUsername('adminBs');
                      setPassword('Admin2026');
                    }}
                    className="text-xs text-blue-700 font-bold underline cursor-pointer hover:text-blue-900"
                  >
                    Isi Otomatis
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Masuk Sekarang
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Pilih nama pengguna unik"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nomor WhatsApp
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Buat kata sandi aman"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Daftar Sebagai (Role)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Shield className="w-4 h-4" />
                  </div>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
                  >
                    <option value="Murid">Murid / Atlet Binaan</option>
                    <option value="Pengurus">Pengurus Club (Perlu Verifikasi Admin)</option>
                    <option value="User">Umum / Wali Murid</option>
                  </select>
                </div>
              </div>

              <p className="text-[10px] text-slate-500">
                Data pendaftaran otomatis disimpan ke lembar kerja Google Sheets <strong>Users</strong>.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <UserPlus className="w-4 h-4" />
                {loading ? 'Menyimpan...' : 'Daftar Akun Baru'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
