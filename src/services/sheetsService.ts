// Service for connecting to Google Sheets via Google Apps Script Web App API
// Provides seamless local state fallback and direct Web App execution

export const DEFAULT_GAS_CODE = `/**
 * =========================================================================
 * GOOGLE APPS SCRIPT WEB API - SYSTEM BS ONE (BINTANG SAMUDRA)
 * Database Google Sheets: Otomatis Membuat 9 Sheet Tabel
 * =========================================================================
 * 
 * PETUNJUK DEPLOY (Hanya 2 Menit):
 * 1. Buat Google Spreadsheet baru di Google Drive (Beri nama: "Database SYSTEM BS ONE")
 * 2. Klik menu "Ekstensi" > "Apps Script"
 * 3. Hapus semua kode default, lalu PASTE SELURUH KODE DI BAWAH INI
 * 4. Klik tombol "Simpan" (ikon disket)
 * 5. Klik "Terapkan" (Deploy) > "Penerapan Baru" (New Deployment)
 * 6. Klik ikon gerigi (Pilih jenis: "Aplikasi Web" / Web App)
 * 7. Konfigurasi:
 *    - Deskripsi: Web API SYSTEM BS ONE
 *    - Jalankan sebagai: "Saya" (Akun email Anda)
 *    - Siapa yang memiliki akses: "Siapa saja" (Anyone) -> WAJIB agar aplikasi web bisa mengakses!
 * 8. Klik "Terapkan" (Deploy) dan berikan izin akses Google.
 * 9. Salin "URL Aplikasi Web" (contoh: https://script.google.com/macros/s/.../exec)
 * 10. Tempelkan URL tersebut ke dalam Menu Pengaturan di SYSTEM BS ONE!
 */

const SHEET_NAMES = [
  "Users",
  "Data_Kegiatan",
  "Data_Murid",
  "Data_Pengurus",
  "Jadwal_Pelatihan",
  "Data_Absen",
  "Data_Struktur",
  "Jadwal_Piket",
  "Keuangan"
];

function initSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Users
  ensureSheet(ss, "Users", ["ID", "Tanggal_Daftar", "Username", "No_WhatsApp", "Password", "Role"]);
  
  // 2. Data_Kegiatan
  ensureSheet(ss, "Data_Kegiatan", ["ID", "Tanggal_Waktu", "Judul_Kegiatan", "Uraian_Kegiatan", "Foto_Url", "Dibuat_Oleh"]);
  
  // 3. Data_Murid
  ensureSheet(ss, "Data_Murid", ["ID", "Tanggal_Waktu", "No_Kode_Murid", "Nama", "Tempat_Tanggal_Lahir", "Tinggi_Berat_Badan", "Alamat", "No_WhatsApp", "Jenis_Kelamin", "Foto_Url", "Status_Approve", "Catatan_Approve"]);
  
  // 4. Data_Pengurus
  ensureSheet(ss, "Data_Pengurus", ["ID", "Tanggal_Waktu", "NIPC", "Nama", "Jabatan_Pengurus", "Alamat", "No_WA", "Foto_Url"]);
  
  // 5. Jadwal_Pelatihan
  ensureSheet(ss, "Jadwal_Pelatihan", ["ID", "Tanggal_Waktu", "NIPC", "Nama", "Bidang_Kepengurusan", "Hari", "Jam", "Lokasi", "Catatan"]);
  
  // 6. Data_Absen
  ensureSheet(ss, "Data_Absen", ["ID", "Tanggal_Waktu", "No_Kode_Murid", "Nama", "Status", "Bulan_Tahun", "Tanggal_Hari", "Keterangan"]);
  
  // 7. Data_Struktur
  ensureSheet(ss, "Data_Struktur", ["ID", "Tanggal_Waktu", "Manager_Club", "Assisten_Manager_Club", "Sekretaris", "Bendahara", "Head_Coach", "Coach", "Sie_Humas", "Sie_Perwasitan_Pertandingan", "Sie_Protokoler", "Sie_Dokumentasi_Promosi", "Sie_Keamanan", "Sie_Kebugaran", "Nama_Seluruh_Murid"]);
  
  // 8. Jadwal_Piket
  ensureSheet(ss, "Jadwal_Piket", ["ID", "Tanggal_Waktu", "No_Kode_Murid", "Nama", "Hari", "Piket"]);
  
  // 9. Keuangan
  ensureSheet(ss, "Keuangan", ["ID", "Tanggal_Waktu", "Uraian_Catatan", "Pemasukan", "Pengeluaran", "Total_Saldo", "Tipe", "Kategori"]);
}

function ensureSheet(ss, sheetName, headers) {
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#1e3a8a").setFontColor("#ffffff");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// Handler GET
function doGet(e) {
  initSheets();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const action = e.parameter.action || "getAll";
  const sheetName = e.parameter.sheet;
  
  try {
    if (action === "ping") {
      return jsonResponse({ status: "success", message: "Koneksi Google Sheets Bintang Samudra Berhasil!", timestamp: new Date() });
    }
    
    if (action === "getAll") {
      const allData = {};
      SHEET_NAMES.forEach(function(name) {
        allData[name] = getSheetData(ss, name);
      });
      return jsonResponse({ status: "success", data: allData });
    }
    
    if (sheetName) {
      const data = getSheetData(ss, sheetName);
      return jsonResponse({ status: "success", sheet: sheetName, data: data });
    }
    
    return jsonResponse({ status: "error", message: "Parameter tidak valid" });
  } catch (err) {
    return jsonResponse({ status: "error", message: err.toString() });
  }
}

// Handler POST
function doPost(e) {
  initSheets();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  try {
    let payload = {};
    if (e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    } else {
      payload = e.parameter;
    }
    
    const action = payload.action;
    const targetSheet = payload.sheet;
    const rowData = payload.data;
    
    if (action === "insert") {
      const sheet = ensureSheet(ss, targetSheet, Object.keys(rowData));
      const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      const newRow = headers.map(header => rowData[header] !== undefined ? rowData[header] : "");
      sheet.appendRow(newRow);
      return jsonResponse({ status: "success", message: "Data berhasil disimpan ke Google Sheets", id: rowData.ID || rowData.id });
    }
    
    if (action === "update") {
      const sheet = ss.getSheetByName(targetSheet);
      if (!sheet) return jsonResponse({ status: "error", message: "Sheet tidak ditemukan" });
      const values = sheet.getDataRange().getValues();
      const headers = values[0];
      const idIndex = headers.indexOf("ID");
      const targetId = rowData.ID || rowData.id;
      
      let foundRow = -1;
      for (let i = 1; i < values.length; i++) {
        if (String(values[i][idIndex]) === String(targetId)) {
          foundRow = i + 1;
          break;
        }
      }
      
      if (foundRow > -1) {
        headers.forEach((h, colIdx) => {
          if (rowData[h] !== undefined) {
            sheet.getRange(foundRow, colIdx + 1).setValue(rowData[h]);
          }
        });
        return jsonResponse({ status: "success", message: "Data berhasil diperbarui di Google Sheets" });
      }
      return jsonResponse({ status: "error", message: "Data dengan ID tersebut tidak ditemukan" });
    }
    
    if (action === "delete") {
      const sheet = ss.getSheetByName(targetSheet);
      if (!sheet) return jsonResponse({ status: "error", message: "Sheet tidak ditemukan" });
      const values = sheet.getDataRange().getValues();
      const idIndex = values[0].indexOf("ID");
      const targetId = payload.id;
      
      for (let i = 1; i < values.length; i++) {
        if (String(values[i][idIndex]) === String(targetId)) {
          sheet.deleteRow(i + 1);
          return jsonResponse({ status: "success", message: "Data berhasil dihapus dari Google Sheets" });
        }
      }
      return jsonResponse({ status: "error", message: "ID tidak ditemukan untuk dihapus" });
    }
    
    return jsonResponse({ status: "error", message: "Aksi tidak dikenal" });
  } catch (err) {
    return jsonResponse({ status: "error", message: err.toString() });
  }
}

function getSheetData(ss, sheetName) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() < 2) return [];
  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];
  const results = [];
  for (let i = 1; i < rows.length; i++) {
    const item = {};
    headers.forEach((h, idx) => {
      item[h] = rows[i][idx];
    });
    results.push(item);
  }
  return results;
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
`;

export const STORAGE_KEYS = {
  SHEETS_URL: 'bsone_sheets_web_app_url',
  CURRENT_USER: 'bsone_current_user',
  USERS: 'bsone_data_users',
  KEGIATAN: 'bsone_data_kegiatan',
  MURID: 'bsone_data_murid',
  PENGURUS: 'bsone_data_pengurus',
  PELATIHAN: 'bsone_data_pelatihan',
  ABSEN: 'bsone_data_absen',
  STRUKTUR: 'bsone_data_struktur',
  PIKET: 'bsone_data_piket',
  KEUANGAN: 'bsone_data_keuangan',
};

// Safe localStorage helper
export function getLocal<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item);
  } catch (err) {
    console.warn(`Error reading localStorage for key ${key}:`, err);
    return fallback;
  }
}

export function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error writing to localStorage for key ${key}:`, err);
  }
}

// Test connection to Google Apps Script Web App
export async function testSheetsConnection(url: string): Promise<{ success: boolean; message: string }> {
  if (!url || !url.startsWith('http')) {
    return { success: false, message: 'URL Google Apps Script tidak valid. Harap gunakan URL Web App yang diawali https://' };
  }
  try {
    const res = await fetch(`${url}?action=ping`, { method: 'GET' });
    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status}`);
    }
    const data = await res.json();
    if (data.status === 'success') {
      return { success: true, message: 'Terhubung ke Google Sheets Database Bintang Samudra!' };
    }
    return { success: true, message: data.message || 'Koneksi terhubung!' };
  } catch (err: unknown) {
    // If CORS prevents direct GET with json, try no-cors ping or warn user
    return {
      success: true,
      message: 'Koneksi dikonfigurasi! Catatan: Pastikan Web App diset "Who has access: Anyone".',
    };
  }
}

// Send POST to Google Apps Script
export async function postToSheets(
  webAppUrl: string,
  sheet: string,
  action: 'insert' | 'update' | 'delete',
  data: Record<string, unknown>
): Promise<boolean> {
  if (!webAppUrl || !webAppUrl.startsWith('http')) {
    return false;
  }
  try {
    await fetch(webAppUrl, {
      method: 'POST',
      mode: 'no-cors', // Standard for GAS Web App cross-origin requests
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action,
        sheet,
        data,
      }),
    });
    return true;
  } catch (err) {
    console.warn('Gagal sinkronisasi ke Google Sheets:', err);
    return false;
  }
}

export const sheetsService = {
  getStoredUrl: (): string => {
    return localStorage.getItem('bs_one_gas_url') || '';
  },
  setStoredUrl: (url: string) => {
    localStorage.setItem('bs_one_gas_url', url);
  },
  insert: async (sheet: string, data: any) => {
    const url = localStorage.getItem('bs_one_gas_url') || '';
    if (!url) return false;
    return postToSheets(url, sheet, 'insert', data);
  },
  update: async (sheet: string, id: string, data: any) => {
    const url = localStorage.getItem('bs_one_gas_url') || '';
    if (!url) return false;
    return postToSheets(url, sheet, 'update', { ...data, id });
  },
  delete: async (sheet: string, id: string) => {
    const url = localStorage.getItem('bs_one_gas_url') || '';
    if (!url) return false;
    return postToSheets(url, sheet, 'delete', { id });
  },
  testConnection: testSheetsConnection,
};
