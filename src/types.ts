export type UserRole = 'Admin' | 'Pengurus' | 'Murid' | 'User';

export interface User {
  id: string;
  username: string;
  whatsapp: string;
  password?: string;
  role: UserRole;
  createdAt: string;
}

export interface DataKegiatan {
  id: string;
  tanggalWaktu: string;
  judulKegiatan: string;
  uraianKegiatan: string;
  fotoUrl: string;
  createdBy: string;
}

export type JenisKelamin = 'Laki - Laki' | 'Perempuan';
export type ApprovalStatus = 'Pending' | 'Disetujui' | 'Approved' | 'Ditolak';

export interface DataMurid {
  id: string;
  tanggalWaktu: string;
  noKodeMurid: string;
  nama: string;
  tempatTanggalLahir?: string;
  tinggiBeratBadan?: string;
  alamat: string;
  noWhatsapp?: string;
  noHp?: string;
  tempatLahir?: string;
  tanggalLahir?: string;
  agama?: string;
  tinggiBadan?: string;
  beratBadan?: string;
  golDarah?: string;
  posisiBermain?: string;
  namaOrangTua?: string;
  noHpOrangTua?: string;
  jenisKelamin: JenisKelamin;
  fotoUrl: string;
  statusApprove: ApprovalStatus;
  statusApproval?: ApprovalStatus;
  catatanApprove?: string;
  tandaTanganUrl?: string;
}

export type ReportType =
  | 'murid'
  | 'pengurus'
  | 'kegiatan'
  | 'jadwal'
  | 'absen'
  | 'struktur'
  | 'piket'
  | 'keuangan';

export type JabatanPengurus =
  | 'MANAGER CLUB'
  | 'ASSISTEN MANAGER CLUB'
  | 'HEAD COACH'
  | 'COACH'
  | 'BENDAHARA'
  | 'SEKRETARIS'
  | 'SIE PROTOKOLER'
  | 'SIE PERWASITAN/PERTANDINGAN'
  | 'SIE KEAMANAN'
  | 'SIE DOKUMENTASI/PROMOSI'
  | 'SIE KEBUGARAN'
  | 'SIE HUMAS';

export interface DataPengurus {
  id: string;
  tanggalWaktu: string;
  nipc: string;
  nama: string;
  jabatanPengurus: JabatanPengurus;
  alamat: string;
  noWa: string;
  fotoUrl: string;
}

export type HariLatihan = 'SENIN' | 'SELASA' | 'RABU' | 'KAMIS' | 'JUMAT' | 'SABTU' | 'MINGGU';

export interface JadwalPelatihan {
  id: string;
  tanggalWaktu: string;
  nipc: string;
  nama: string;
  bidangKepengurusan: string;
  hari: HariLatihan;
  jam: string;
  lokasi?: string;
  catatan?: string;
}

export type StatusAbsen = 'L' | 'S' | 'I' | 'A' | '.'; // L=Libur, S=Sakit, I=Izin, A=Alpa, .=Hadir

export interface DataAbsen {
  id: string;
  tanggalWaktu: string;
  noKodeMurid: string;
  nama: string;
  status: StatusAbsen;
  bulanTahun: string; // e.g. "2026-09"
  tanggalHari: number; // 1-31
  keterangan?: string;
}

export interface DataStruktur {
  id: string;
  tanggalWaktu: string;
  managerClub: string;
  assistenManagerClub: string;
  sekretaris: string;
  bendahara: string;
  headCoach: string;
  coach: string;
  sieHumas: string;
  siePerwasitanPertandingan: string;
  sieProtokoler: string;
  sieDokumentasiPromosi: string;
  sieKeamanan: string;
  sieKebugaran: string;
  namaSeluruhMurid: string[];
}

export interface JadwalPiket {
  id: string;
  tanggalWaktu: string;
  noKodeMurid: string;
  nama: string;
  hari: HariLatihan;
  piket: string; // default: "Membasahi lapangan dan Menyiapkan peralatan"
}

export interface Keuangan {
  id: string;
  tanggalWaktu: string;
  uraianCatatan: string;
  pemasukan: number;
  pengeluaran: number;
  totalSaldo: number;
  tipe: 'Pemasukan' | 'Pengeluaran' | 'Penyesuaian';
  kategori?: string;
}

export interface ClubInfo {
  namaKlub: string;
  namaSistem: string;
  alamatSekretariat: string;
  email: string;
  whatsapp: string;
  alamat: string;
  telp: string;
}

export type ActiveTab =
  | 'dashboard'
  | 'murid'
  | 'pengurus'
  | 'jadwal'
  | 'pelatihan'
  | 'absen'
  | 'struktur'
  | 'piket'
  | 'keuangan'
  | 'laporan'
  | 'settings';
