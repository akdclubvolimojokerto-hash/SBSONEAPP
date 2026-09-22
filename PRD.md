# PRODUCT REQUIREMENT DOCUMENT (PRD)
## SYSTEM BS ONE - CLUB BOLA VOLI BINTANG SAMUDRA MOJOKERTO
**Integrasi Penuh Google Apps Script (Code.gs) & Antarmuka Mandiri (Index.html) ke Google Spreadsheets**

---

### 1. RINGKASAN EKSEKUTIF (EXECUTIVE SUMMARY)
Dokumen ini merupakan spesifikasi fungsional dan teknis komprehensif bagi sistem manajemen informasi **SYSTEM BS ONE** milik **Club Bola Voli BINTANG SAMUDRA** (afiliasi resmi PBVSI Kabupaten Mojokerto). Sistem ini dirancang untuk beroperasi ganda:
1. **Aplikasi Web Modern React + TypeScript**: Antarmuka lengkap dengan Kop Surat cetak resmi, pembatasan akses hak Admin, audit log, serta visual bagan hierarki kepengurusan.
2. **Google Apps Script (GAS) Standalone Web App**: Terdiri dari **`Code.gs`** (Backend Controller & REST Handler) dan **`Index.html`** (Front End Mandiri) yang dapat langsung di-deploy di dalam Google Drive pengguna tanpa ketergantungan server berbayar. Seluruh data formulir tersimpan secara otomatis pada spreadsheet database.

---

### 2. ARSITEKTUR DATABASE GOOGLE SPREADSHEETS (9 TABEL UTAMA)
Sistem membuat dan mengelola 9 Sheet tabel secara otomatis dengan gaya header formal PBVSI (latar biru `#1e3a8a`, teks putih tebal, baris pertama dibekukan):

| No | Nama Sheet | Header Kolom | Deskripsi Entitas |
|:---|:---|:---|:---|
| 1 | `Users` | `ID`, `Tanggal_Daftar`, `Username`, `No_WhatsApp`, `Password`, `Role` | Akun pengguna sistem (Admin, Pengurus, Murid) |
| 2 | `Data_Kegiatan` | `ID`, `Tanggal_Waktu`, `Judul_Kegiatan`, `Uraian_Kegiatan`, `Foto_Url`, `Dibuat_Oleh` | Dokumentasi sesi latihan, try out, & uji tanding |
| 3 | `Data_Murid` | `ID`, `Tanggal_Waktu`, `No_Kode_Murid`, `Nama`, `Tempat_Tanggal_Lahir`, `Tinggi_Berat_Badan`, `Alamat`, `No_WhatsApp`, `Jenis_Kelamin`, `Foto_Url`, `Status_Approve`, `Catatan_Approve` | Biodata lengkap atlet dan murid binaan klub |
| 4 | `Data_Pengurus` | `ID`, `Tanggal_Waktu`, `NIPC`, `Nama`, `Jabatan_Pengurus`, `Alamat`, `No_WA`, `Foto_Url` | Profil manajemen, pelatih berlisensi, & staf |
| 5 | `Jadwal_Pelatihan` | `ID`, `Tanggal_Waktu`, `NIPC`, `Nama`, `Bidang_Kepengurusan`, `Hari`, `Jam`, `Lokasi`, `Catatan` | Agenda jadwal sesi latihan mingguan |
| 6 | `Data_Absen` | `ID`, `Tanggal_Waktu`, `No_Kode_Murid`, `Nama`, `Status`, `Bulan_Tahun`, `Tanggal_Hari`, `Keterangan` | Rekam kehadiran sesi latihan atlet |
| 7 | `Data_Struktur` | `ID`, `Tanggal_Waktu`, `Manager_Club`, `Assisten_Manager_Club`, `Sekretaris`, `Bendahara`, `Head_Coach`, `Coach`, `Sie_Humas`, `Sie_Perwasitan_Pertandingan`, `Sie_Protokoler`, `Sie_Dokumentasi_Promosi`, `Sie_Keamanan`, `Sie_Kebugaran`, `Nama_Seluruh_Murid` | Struktur bagan hierarki kepengurusan klub |
| 8 | `Jadwal_Piket` | `ID`, `Tanggal_Waktu`, `No_Kode_Murid`, `Nama`, `Hari`, `Piket` | Penugasan piket perlengkapan lapangan murid |
| 9 | `Keuangan` | `ID`, `Tanggal_Waktu`, `Uraian_Catatan`, `Pemasukan`, `Pengeluaran`, `Total_Saldo`, `Tipe`, `Kategori` | Buku kas pemasukan iuran & pengeluaran operasional |

---

### 3. FITUR & LOGIKA BISNIS SPESIFIK (BUSINESS RULES)

#### 3.1. Hak Akses & Keamanan Khusus Admin
1. **Pengaturan Perubahan Logo Klub & Logo PBVSI**:
   - Modal konfigurasi link dan unggah logo hanya dapat diakses oleh user ber-role **Admin**.
   - Dilengkapi 2 tab pengelolaan: Tab Logo Resmi Klub Bintang Samudra dan Tab Logo PBVSI Pusat.
2. **Aksi Edit pada Widget Kegiatan**:
   - Tombol "Edit" pada galeri maupun daftar kegiatan di Dashboard dilindungi otorisasi khusus **Admin**.
3. **Standarisasi Penamaan Organisasi**:
   - Nama klub di seluruh surat, dashboard, dan database menggunakan nama resmi **BINTANG SAMUDRA**.
   - Nama aplikasi dipertahankan secara konsisten sebagai **SYSTEM BS ONE**.

#### 3.2. Standar Kop Surat Resmi Cetak PBVSI (A4 Standard)
- **Sisi Kiri**: Logo resmi PBVSI (tersinkronisasi dengan file `logopbvsi.png` dan fallback vector SVG).
- **Bagian Tengah**: Identitas resmi klub:
  - *PERSATUAN BOLA VOLI SELURUH INDONESIA*
  - *CLUB BOLA VOLI*
  - *BINTANG SAMUDRA*
  - *Alamat Sekretariat: Dsn Japanan Kidul Ds Japanan Kec Kemlagi Kab Mojokerto Jawa Timur Kode Pos 61353*
  - *Email: bsone@gmail.com | WhatsApp: 0859-4400-4657*
- **Sisi Kanan**: Logo resmi Club Bintang Samudra (`LogoBS.jpg`).
- **Footer Penandatanganan**: Manager Club (H. Budi Santoso, S.Pd / NIPC. PBS-7492) dan Sekretaris (Dian Permata, S.Kom / NIPC. PBS-7493) lengkap dengan stempel digital.

---

### 4. SPESIFIKASI DUA FILE UTAMA GOOGLE APPS SCRIPT

#### 4.1. File `Code.gs` (Backend Controller)
- **`doGet(e)`**:
  - Menyajikan `Index.html` responsif saat dibuka melalui peramban web (Web App URL).
  - Menyediakan endpoint REST GET JSON (`?action=getAll`, `?action=ping`, `?sheet=...`) untuk integrasi client-side.
- **`doPost(e)`**:
  - Menerima payload mutasi data (`insert`, `update`, `delete`) dari formulir eksternal.
  - Menghindari isu blokir CORS browser.
- **Metode Internal Google Script (`google.script.run`)**:
  - `apiGetAllSheetsData()`: Mengambil 9 tabel sekaligus dalam satu kali panggilan cepat.
  - `apiInsertRow(sheetName, rowData)`: Menyimpan baris data baru ke sheet tujuan.
  - `apiUpdateRow(sheetName, recordId, updatedData)`: Memperbarui baris berdasarkan kolom `ID`.
  - `apiDeleteRow(sheetName, recordId)`: Menghapus baris berdasarkan kolom `ID`.

#### 4.2. File `Index.html` (Front End Mandiri)
- **Teknologi**: HTML5, Tailwind CSS CDN, FontAwesome Icons 6, Plus Jakarta Sans typography.
- **Navigasi 9 Tab Interaktif**:
  1. *Dashboard*: Statistik ringkas murid, pengurus, kegiatan, saldo kas, serta galeri kegiatan.
  2. *Data Kegiatan*: Tabel dokumentasi kegiatan & tombol tambah kegiatan baru.
  3. *Data Murid*: Manajemen biodata atlet binaan lengkap dengan kode unik otomatis (`BSM-XXXX`).
  4. *Data Pengurus*: Tabel data kepengurusan dan nomor induk pengurus club (NIPC).
  5. *Jadwal Pelatihan*: Informasi hari, jam, lokasi, dan pelatih penanggung jawab.
  6. *Data Absen*: Rekapitulasi absensi kehadiran latihan atlet binaan.
  7. *Struktur Organisasi*: Bagan hierarki visual mulai dari Manager hingga Pelatih.
  8. *Keuangan*: Rekap buku kas masuk & keluar beserta kalkulasi saldo otomatis.
  9. *Kop Surat Resmi*: Pratinjau layout surat resmi standar PBVSI yang siap dicetak langsung (`window.print()`).

---

### 5. PANDUAN PENERAPAN (DEPLOYMENT GUIDE)

1. Buka [Google Drive](https://drive.google.com/) dan buat **Google Spreadsheet** baru.
2. Beri nama spreadsheet: `Database SYSTEM BS ONE - Bintang Samudra`.
3. Buka menu **Ekstensi (Extensions)** > **Apps Script**.
4. Di panel editor Apps Script:
   - Tempelkan isi dari file `Code.gs` ke file script default.
   - Buat file HTML baru dengan nama `Index` (akan menjadi `Index.html`), lalu tempelkan isi dari file `Index.html`.
5. Klik **Simpan (Save)**.
6. Klik tombol biru **Terapkan (Deploy)** > **Penerapan Baru (New Deployment)**:
   - Pilih jenis: **Aplikasi Web (Web App)**.
   - Deskripsi: `SYSTEM BS ONE Web App PBVSI`.
   - Jalankan sebagai (Execute as): **Saya (Akun email Anda)**.
   - Siapa yang memiliki akses (Who has access): **Siapa saja (Anyone)** *(Wajib agar penyimpanan formulir berjalan tanpa kendala otorisasi)*.
7. Klik **Terapkan**, lalu berikan izin akses Google (Review permissions).
8. Salin **URL Aplikasi Web** yang didapatkan (contoh: `https://script.google.com/macros/s/.../exec`).
9. URL tersebut kini dapat dibuka langsung di browser sebagai Web App mandiri, atau dimasukkan ke dalam Menu Pengaturan Google Sheets di aplikasi SYSTEM BS ONE untuk sinkronisasi otomatis!
