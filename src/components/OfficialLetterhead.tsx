import React, { useState } from 'react';
import { PbvsiLogo, BintangSamudraLogo } from './Logos';
import { CLUB_INFO } from '../constants/initialData';
import { LogoSettingsModal } from './LogoSettingsModal';
import { Edit3 } from 'lucide-react';

interface OfficialLetterheadProps {
  judulSurat?: string;
  nomorSurat?: string;
  perihal?: string;
  children: React.ReactNode;
  managerName?: string;
  sekretarisName?: string;
  tanggalDokumen?: string;
  logoUrl?: string;
  isAdmin?: boolean;
}

export const OfficialLetterhead: React.FC<OfficialLetterheadProps> = ({
  judulSurat = 'SURAT TUGAS & JADWAL RESMI KLUB',
  nomorSurat = '042/BS/ST/IX/2026',
  perihal = 'Pemberitahuan & Pelaksanaan Program Kerja',
  children,
  managerName = 'H. Budi Santoso, S.Pd',
  sekretarisName = 'Dian Permata, S.Kom',
  tanggalDokumen,
  logoUrl,
  isAdmin = false,
}) => {
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [modalTarget, setModalTarget] = useState<'club' | 'pbvsi'>('club');
  const currentDateFormatted =
    tanggalDokumen ||
    new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  return (
    <div
      id="printable-official-document"
      className="bg-white text-slate-900 mx-auto box-border font-serif relative"
      style={{
        width: '794px', // Standard 96DPI A4 width
        minHeight: '1123px', // Standard 96DPI A4 height
        padding: '24px 32px',
        backgroundColor: '#ffffff',
      }}
    >
      {/* KOP SURAT RESMI */}
      <div className="border-b-[3px] border-slate-900 pb-3 mb-1">
        <div className="flex items-center justify-between gap-4">
          {/* Logo PBVSI di Samping Kiri */}
          <div
            className={`w-28 h-28 flex items-center justify-center shrink-0 relative ${isAdmin ? 'group cursor-pointer' : ''}`}
            onClick={() => {
              if (isAdmin) {
                setModalTarget('pbvsi');
                setIsLogoModalOpen(true);
              }
            }}
            title={isAdmin ? 'Klik untuk mengubah link atau gambar logo PBVSI (Admin)' : 'Logo Resmi PBVSI'}
          >
            <PbvsiLogo className="w-24 h-24 object-contain" />
            {isAdmin && (
              <span
                data-html2canvas-ignore="true"
                className="absolute -top-1 -right-1 bg-emerald-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm print:hidden"
              >
                <Edit3 className="w-3 h-3" />
              </span>
            )}
          </div>

          {/* Teks Kop Surat di Tengah */}
          <div className="flex-1 text-center font-sans px-2">
            <h3 className="text-sm tracking-widest text-slate-700 font-bold uppercase mb-0.5">
              PERSATUAN BOLA VOLI SELURUH INDONESIA
            </h3>
            <h2 className="text-xl font-extrabold uppercase tracking-wide text-slate-900">
              CLUB BOLA VOLI
            </h2>
            <h1 className="text-3xl sm:text-4xl font-black tracking-wider text-blue-900 uppercase my-0.5 leading-tight">
              BINTANG SAMUDRA
            </h1>
            <p className="text-[11px] leading-snug text-slate-600 font-normal mt-1 max-w-xl mx-auto">
              Alamat Sekretariat : {CLUB_INFO.alamatSekretariat}
            </p>
            <p className="text-[11px] font-semibold text-slate-700 mt-0.5">
              Email : <span className="font-normal text-blue-800">{CLUB_INFO.email}</span> |
              WhatsApp : <span className="font-normal text-blue-800">{CLUB_INFO.whatsapp}</span>
            </p>
          </div>

          {/* Logo BINTANG SAMUDRA di Samping Kanan (Ukuran Lebih Besar & Jelas) */}
          <div
            className={`w-36 h-28 flex items-center justify-center shrink-0 relative ${isAdmin ? 'group cursor-pointer' : ''}`}
            onClick={() => {
              if (isAdmin) {
                setModalTarget('club');
                setIsLogoModalOpen(true);
              }
            }}
            title={isAdmin ? 'Klik untuk mengubah link atau gambar logo klub (Admin)' : 'Logo Resmi Klub Bintang Samudra'}
          >
            <BintangSamudraLogo src={logoUrl} className="w-36 h-24 max-h-24 object-contain" />
            {isAdmin && (
              <span
                data-html2canvas-ignore="true"
                className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm print:hidden"
              >
                <Edit3 className="w-3 h-3" />
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Garis Tipis Ganda Khas Surat Resmi */}
      <div className="border-b border-slate-900 mb-6"></div>

      {/* HEADER SURAT: JUDUL & NOMOR */}
      <div className="text-center font-sans mb-6">
        <h4 className="text-lg font-bold uppercase tracking-wide text-slate-900 underline decoration-2 underline-offset-4">
          {judulSurat}
        </h4>
        <p className="text-xs text-slate-600 mt-1 font-medium">Nomor: {nomorSurat}</p>
        {perihal && (
          <p className="text-xs text-slate-700 mt-0.5 italic">Perihal: {perihal}</p>
        )}
      </div>

      {/* ISI KONTEN UTAMA (TABEL / JADWAL / DATA) */}
      <div className="font-sans text-xs mb-8">{children}</div>

      {/* BAGIAN TANDA TANGAN RESMI (MANAGER CLUB & SEKRETARIS) */}
      <div className="font-sans text-xs mt-12 pt-4 break-inside-avoid">
        <div className="flex justify-between items-start px-8">
          {/* Sisi Kiri: Mengetahui Sekretaris */}
          <div className="text-center w-56">
            <p className="font-medium text-slate-700 mb-1">Sekretaris Club,</p>
            <div className="h-20 flex items-center justify-center relative">
              {/* Tanda Tangan Simulasi / Space */}
              <div className="italic text-slate-400 text-sm select-none border-b border-dashed border-slate-300 w-40 pb-2">
                (Tanda Tangan)
              </div>
            </div>
            <p className="font-bold text-slate-900 underline uppercase mt-2">
              {sekretarisName}
            </p>
            <p className="text-[11px] text-slate-600">NIPC. PBS-1983</p>
          </div>

          {/* Sisi Kanan: Tempat, Tanggal & Manager Club */}
          <div className="text-center w-64">
            <p className="font-medium text-slate-700">
              Mojokerto, {currentDateFormatted}
            </p>
            <p className="font-medium text-slate-700 mb-1">
              Manager Volleyball Club BINTANG SAMUDRA,
            </p>
            <div className="h-20 flex items-center justify-center relative">
              {/* Stempel Club Visual */}
              <div className="absolute right-3 w-20 h-20 rounded-full border-2 border-dashed border-blue-600/40 text-blue-600/60 flex flex-col items-center justify-center text-[7px] font-bold uppercase rotate-[-15deg] pointer-events-none text-center leading-tight">
                <span>STEMPEL</span>
                <span className="font-black text-[7.5px] text-blue-800">BINTANG SAMUDRA</span>
                <span className="text-[6px]">MOJOKERTO</span>
              </div>
              <div className="italic text-slate-400 text-sm select-none border-b border-dashed border-slate-300 w-44 pb-2">
                (Tanda Tangan)
              </div>
            </div>
            <p className="font-bold text-slate-900 underline uppercase mt-2">
              {managerName}
            </p>
            <p className="text-[11px] text-slate-600">NIPC. PBS-7492</p>
          </div>
        </div>
      </div>

      <LogoSettingsModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
        isAdmin={isAdmin}
        initialTarget={modalTarget}
      />
    </div>
  );
};
