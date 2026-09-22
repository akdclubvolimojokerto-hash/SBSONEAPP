/**
 * =========================================================================
 * GOOGLE APPS SCRIPT (GAS) - SYSTEM BS ONE (BINTANG SAMUDRA)
 * File: Code.gs (Backend Controller & Database REST Handler)
 * Target Spreadsheet: Database Club Bola Voli BINTANG SAMUDRA
 * =========================================================================
 * 
 * FITUR UTAMA CODE.GS:
 * 1. Web App Server (doGet):
 *    - Melayani tampilan antarmuka Front End HTML5 (Index.html) responsif
 *    - Menyediakan API Endpoint GET JSON untuk sinkronisasi data antar modul
 * 2. Web App Data Receiver (doPost):
 *    - Menerima mutasi data (insert, update, delete) dari formulir & aplikasi web
 *    - Mencegah error CORS dengan mode text output & application/json support
 * 3. Otomatisasi Database 9 Sheet Tabel:
 *    - Users, Data_Kegiatan, Data_Murid, Data_Pengurus, Jadwal_Pelatihan,
 *      Data_Absen, Data_Struktur, Jadwal_Piket, Keuangan
 * 4. Header tabel berdesain formal PBVSI (Biru Navy #1e3a8a, teks putih tebal, freeze top row)
 * 5. CRUD Helper Functions yang dapat dipanggil langsung dari google.script.run
 */

// Konfigurasi Nama-Nama Sheet Tabel Database
var SHEET_NAMES = [
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

// Skema Header Kolom Setiap Tabel
var SHEET_SCHEMAS = {
  "Users": [
    "ID", "Tanggal_Daftar", "Username", "No_WhatsApp", "Password", "Role"
  ],
  "Data_Kegiatan": [
    "ID", "Tanggal_Waktu", "Judul_Kegiatan", "Uraian_Kegiatan", "Foto_Url", "Dibuat_Oleh"
  ],
  "Data_Murid": [
    "ID", "Tanggal_Waktu", "No_Kode_Murid", "Nama", "Tempat_Tanggal_Lahir",
    "Tinggi_Berat_Badan", "Alamat", "No_WhatsApp", "Jenis_Kelamin", "Foto_Url",
    "Status_Approve", "Catatan_Approve"
  ],
  "Data_Pengurus": [
    "ID", "Tanggal_Waktu", "NIPC", "Nama", "Jabatan_Pengurus", "Alamat", "No_WA", "Foto_Url"
  ],
  "Jadwal_Pelatihan": [
    "ID", "Tanggal_Waktu", "NIPC", "Nama", "Bidang_Kepengurusan", "Hari", "Jam", "Lokasi", "Catatan"
  ],
  "Data_Absen": [
    "ID", "Tanggal_Waktu", "No_Kode_Murid", "Nama", "Status", "Bulan_Tahun", "Tanggal_Hari", "Keterangan"
  ],
  "Data_Struktur": [
    "ID", "Tanggal_Waktu", "Manager_Club", "Assisten_Manager_Club", "Sekretaris",
    "Bendahara", "Head_Coach", "Coach", "Sie_Humas", "Sie_Perwasitan_Pertandingan",
    "Sie_Protokoler", "Sie_Dokumentasi_Promosi", "Sie_Keamanan", "Sie_Kebugaran",
    "Nama_Seluruh_Murid"
  ],
  "Jadwal_Piket": [
    "ID", "Tanggal_Waktu", "No_Kode_Murid", "Nama", "Hari", "Piket"
  ],
  "Keuangan": [
    "ID", "Tanggal_Waktu", "Uraian_Catatan", "Pemasukan", "Pengeluaran", "Total_Saldo", "Tipe", "Kategori"
  ]
};

/**
 * Inisialisasi awal seluruh lembar kerja tabel dengan header terformat rapi.
 */
function initSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  for (var sheetName in SHEET_SCHEMAS) {
    if (SHEET_SCHEMAS.hasOwnProperty(sheetName)) {
      ensureSheet(ss, sheetName, SHEET_SCHEMAS[sheetName]);
    }
  }
}

/**
 * Memastikan lembar kerja sheet ada. Jika belum ada, buat baru & beri gaya header.
 */
function ensureSheet(ss, sheetName, headers) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(headers);
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight("bold")
               .setBackground("#1e3a8a")
               .setFontColor("#ffffff")
               .setHorizontalAlignment("center");
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, headers.length);
  }
  return sheet;
}

/**
 * doGet:
 * 1. Jika diakses via browser langsung -> Tampilkan UI Index.html
 * 2. Jika diakses dengan parameter query '?action=...' -> Kembalikan JSON API
 */
function doGet(e) {
  initSheets();
  e = e || { parameter: {} };
  var action = e.parameter.action;

  // Jika memanggil endpoint API via GET
  if (action) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    try {
      if (action === "ping") {
        return createJsonResponse({
          status: "success",
          message: "Koneksi Google Sheets Database BINTANG SAMUDRA Berhasil Terhubung!",
          timestamp: new Date().toISOString()
        });
      }
      
      if (action === "getAll") {
        var allData = {};
        SHEET_NAMES.forEach(function(name) {
          allData[name] = getSheetData(ss, name);
        });
        return createJsonResponse({ status: "success", data: allData });
      }

      var sheetName = e.parameter.sheet;
      if (sheetName) {
        var data = getSheetData(ss, sheetName);
        return createJsonResponse({ status: "success", sheet: sheetName, data: data });
      }

      return createJsonResponse({ status: "error", message: "Parameter action tidak valid" });
    } catch (err) {
      return createJsonResponse({ status: "error", message: err.toString() });
    }
  }

  // Jika diakses oleh browser tanpa parameter -> sajikan Index.html (Front End Web App)
  return HtmlService.createTemplateFromFile("Index")
    .evaluate()
    .setTitle("SYSTEM BS ONE - Bintang Samudra")
    .addMetaTag("viewport", "width=device-width, initial-scale=1")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * doPost: Menerima penyimpanan data (Insert, Update, Delete) dari Webhook / Fetch API
 */
function doPost(e) {
  initSheets();
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  try {
    var payload = {};
    if (e && e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    var action = payload.action;
    var targetSheet = payload.sheet;
    var rowData = payload.data || payload;

    if (action === "insert") {
      var resultInsert = apiInsertRow(targetSheet, rowData);
      return createJsonResponse({
        status: "success",
        message: "Data berhasil disimpan ke Google Sheets",
        id: resultInsert.id
      });
    }

    if (action === "update") {
      var resultUpdate = apiUpdateRow(targetSheet, rowData.ID || rowData.id, rowData);
      return createJsonResponse({
        status: resultUpdate.success ? "success" : "error",
        message: resultUpdate.message
      });
    }

    if (action === "delete") {
      var targetId = payload.id || (payload.data && payload.data.id);
      var resultDelete = apiDeleteRow(targetSheet, targetId);
      return createJsonResponse({
        status: resultDelete.success ? "success" : "error",
        message: resultDelete.message
      });
    }

    return createJsonResponse({ status: "error", message: "Aksi tidak dikenali: " + action });
  } catch (err) {
    return createJsonResponse({ status: "error", message: err.toString() });
  }
}

/**
 * =========================================================================
 * FUNGSI BACKEND CRUD UNTUK google.script.run (Dipanggil Langsung dari Index.html)
 * =========================================================================
 */

// Mengambil seluruh data sheet sekaligus untuk inisialisasi awal UI
function apiGetAllSheetsData() {
  initSheets();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var result = {};
  SHEET_NAMES.forEach(function(name) {
    result[name] = getSheetData(ss, name);
  });
  return result;
}

// Mengambil data dari 1 sheet tertentu
function apiGetSheetData(sheetName) {
  initSheets();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  return getSheetData(ss, sheetName);
}

// Tambah baris baru
function apiInsertRow(sheetName, rowData) {
  initSheets();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var defaultHeaders = SHEET_SCHEMAS[sheetName] || Object.keys(rowData);
  var sheet = ensureSheet(ss, sheetName, defaultHeaders);
  
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var recordId = rowData.ID || rowData.id || ("ID-" + new Date().getTime());
  
  // Format pemetaan nilai sel sesuai urutan header tabel
  var newRow = headers.map(function(h) {
    var val = findValueCaseInsensitive(rowData, h);
    if (h === "ID" && !val) return recordId;
    if (h === "Tanggal_Waktu" && !val) return formatDateTime(new Date());
    return val !== undefined && val !== null ? val : "";
  });

  sheet.appendRow(newRow);
  return { success: true, id: recordId };
}

// Edit / Update baris berdasarkan ID
function apiUpdateRow(sheetName, recordId, updatedData) {
  initSheets();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return { success: false, message: "Sheet tidak ditemukan" };

  var values = sheet.getDataRange().getValues();
  if (values.length < 2) return { success: false, message: "Data sheet kosong" };

  var headers = values[0];
  var idIndex = findHeaderIndex(headers, ["ID", "id"]);
  if (idIndex === -1) return { success: false, message: "Kolom ID tidak ditemukan" };

  for (var i = 1; i < values.length; i++) {
    if (String(values[i][idIndex]) === String(recordId)) {
      headers.forEach(function(h, colIdx) {
        var val = findValueCaseInsensitive(updatedData, h);
        if (val !== undefined && val !== null) {
          sheet.getRange(i + 1, colIdx + 1).setValue(val);
        }
      });
      return { success: true, message: "Data berhasil diperbarui di Google Sheets" };
    }
  }
  return { success: false, message: "Data dengan ID " + recordId + " tidak ditemukan" };
}

// Hapus baris berdasarkan ID
function apiDeleteRow(sheetName, recordId) {
  initSheets();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return { success: false, message: "Sheet tidak ditemukan" };

  var values = sheet.getDataRange().getValues();
  if (values.length < 2) return { success: false, message: "Data sheet kosong" };

  var headers = values[0];
  var idIndex = findHeaderIndex(headers, ["ID", "id"]);
  if (idIndex === -1) return { success: false, message: "Kolom ID tidak ditemukan" };

  for (var i = 1; i < values.length; i++) {
    if (String(values[i][idIndex]) === String(recordId)) {
      sheet.deleteRow(i + 1);
      return { success: true, message: "Data berhasil dihapus dari Google Sheets" };
    }
  }
  return { success: false, message: "Data tidak ditemukan" };
}

/**
 * =========================================================================
 * HELPER UTILITIES
 * =========================================================================
 */

function getSheetData(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() < 2) return [];
  var rows = sheet.getDataRange().getValues();
  var headers = rows[0];
  var result = [];

  for (var i = 1; i < rows.length; i++) {
    var item = {};
    headers.forEach(function(header, idx) {
      item[header] = rows[i][idx];
    });
    result.push(item);
  }
  return result;
}

function findHeaderIndex(headers, possibleNames) {
  for (var i = 0; i < headers.length; i++) {
    for (var j = 0; j < possibleNames.length; j++) {
      if (String(headers[i]).toLowerCase().replace(/_/g, "") === String(possibleNames[j]).toLowerCase().replace(/_/g, "")) {
        return i;
      }
    }
  }
  return -1;
}

function findValueCaseInsensitive(obj, keyName) {
  if (obj[keyName] !== undefined) return obj[keyName];
  var cleanKey = String(keyName).toLowerCase().replace(/_/g, "");
  for (var k in obj) {
    if (obj.hasOwnProperty(k)) {
      if (String(k).toLowerCase().replace(/_/g, "") === cleanKey) {
        return obj[k];
      }
    }
  }
  return undefined;
}

function formatDateTime(d) {
  var date = d instanceof Date ? d : new Date();
  var yyyy = date.getFullYear();
  var mm = String(date.getMonth() + 1).padStart(2, '0');
  var dd = String(date.getDate()).padStart(2, '0');
  var hh = String(date.getHours()).padStart(2, '0');
  var min = String(date.getMinutes()).padStart(2, '0');
  var ss = String(date.getSeconds()).padStart(2, '0');
  return yyyy + "-" + mm + "-" + dd + " " + hh + ":" + min + ":" + ss;
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
