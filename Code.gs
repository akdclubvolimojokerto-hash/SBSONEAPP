/**
 * =========================================================================
 * GOOGLE APPS SCRIPT BACKEND (Code.gs)
 * SYSTEM BS ONE - BINTANG SAMUDRA VOLLEYBALL CLUB
 * =========================================================================
 * 
 * Features:
 * - REST API using doGet and doPost
 * - Complete JSON responses
 * - Full CORS support & Edge-friendly headers
 * - Auto-initializes 9 sheets with proper header rows and styles
 * - Supports CRUD: getAll, getBySheet, ping, insert, update, delete
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

/**
 * Initializes sheets with required columns and styling
 */
function initSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Users
  ensureSheet(ss, "Users", [
    "ID", "Tanggal_Daftar", "Username", "No_WhatsApp", "Password", "Role"
  ]);

  // 2. Data_Kegiatan
  ensureSheet(ss, "Data_Kegiatan", [
    "ID", "Tanggal_Waktu", "Judul_Kegiatan", "Uraian_Kegiatan", "Foto_Url", "Dibuat_Oleh"
  ]);

  // 3. Data_Murid
  ensureSheet(ss, "Data_Murid", [
    "ID", "Tanggal_Waktu", "No_Kode_Murid", "Nama", "Tempat_Tanggal_Lahir", 
    "Tinggi_Berat_Badan", "Alamat", "No_WhatsApp", "Jenis_Kelamin", "Foto_Url", 
    "Status_Approve", "Catatan_Approve"
  ]);

  // 4. Data_Pengurus
  ensureSheet(ss, "Data_Pengurus", [
    "ID", "Tanggal_Waktu", "NIPC", "Nama", "Jabatan_Pengurus", "Alamat", "No_WA", "Foto_Url"
  ]);

  // 5. Jadwal_Pelatihan
  ensureSheet(ss, "Jadwal_Pelatihan", [
    "ID", "Tanggal_Waktu", "NIPC", "Nama", "Bidang_Kepengurusan", "Hari", "Jam", "Lokasi", "Catatan"
  ]);

  // 6. Data_Absen
  ensureSheet(ss, "Data_Absen", [
    "ID", "Tanggal_Waktu", "No_Kode_Murid", "Nama", "Status", "Bulan_Tahun", "Tanggal_Hari", "Keterangan"
  ]);

  // 7. Data_Struktur
  ensureSheet(ss, "Data_Struktur", [
    "ID", "Tanggal_Waktu", "Manager_Club", "Assisten_Manager_Club", "Sekretaris", "Bendahara", 
    "Head_Coach", "Coach", "Sie_Humas", "Sie_Perwasitan_Pertandingan", "Sie_Protokoler", 
    "Sie_Dokumentasi_Promosi", "Sie_Keamanan", "Sie_Kebugaran", "Nama_Seluruh_Murid"
  ]);

  // 8. Jadwal_Piket
  ensureSheet(ss, "Jadwal_Piket", [
    "ID", "Tanggal_Waktu", "No_Kode_Murid", "Nama", "Hari", "Piket"
  ]);

  // 9. Keuangan
  ensureSheet(ss, "Keuangan", [
    "ID", "Tanggal_Waktu", "Uraian_Catatan", "Pemasukan", "Pengeluaran", "Total_Saldo", "Tipe", "Kategori"
  ]);
}

/**
 * Helper to create or verify a sheet and apply header styling
 */
function ensureSheet(ss, sheetName, headers) {
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length)
      .setFontWeight("bold")
      .setBackground("#1e3a8a")
      .setFontColor("#ffffff");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/**
 * HTTP GET endpoint handler
 * Supports:
 * - ?action=ping
 * - ?action=getAll
 * - ?sheet=SheetName
 */
function doGet(e) {
  try {
    initSheets();
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const action = (e && e.parameter && e.parameter.action) || "getAll";
    const sheetName = e && e.parameter && e.parameter.sheet;

    if (action === "ping") {
      return jsonResponse({
        status: "success",
        message: "Koneksi Google Sheets Bintang Samudra Berhasil!",
        timestamp: new Date().toISOString()
      });
    }

    if (action === "getAll") {
      const allData = {};
      SHEET_NAMES.forEach(function (name) {
        allData[name] = getSheetData(ss, name);
      });
      return jsonResponse({
        status: "success",
        data: allData
      });
    }

    if (sheetName) {
      const data = getSheetData(ss, sheetName);
      return jsonResponse({
        status: "success",
        sheet: sheetName,
        data: data
      });
    }

    return jsonResponse({
      status: "error",
      message: "Parameter query tidak valid"
    });
  } catch (err) {
    return jsonResponse({
      status: "error",
      message: err.toString()
    });
  }
}

/**
 * HTTP POST endpoint handler
 * Supports actions: insert, update, delete
 */
function doPost(e) {
  try {
    initSheets();
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    let payload = {};
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        payload = e.parameter || {};
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    const action = payload.action;
    const targetSheet = payload.sheet;
    const rowData = payload.data || {};

    if (!action || !targetSheet) {
      return jsonResponse({
        status: "error",
        message: "Missing 'action' or 'sheet' parameter"
      });
    }

    // 1. INSERT ACTION
    if (action === "insert") {
      const sheet = ss.getSheetByName(targetSheet) || ensureSheet(ss, targetSheet, Object.keys(rowData));
      const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      
      const newRow = headers.map(function (header) {
        // Match case-insensitively or exact
        if (rowData[header] !== undefined) return rowData[header];
        const lowerH = header.toLowerCase();
        for (const key of Object.keys(rowData)) {
          if (key.toLowerCase() === lowerH || key.replace(/_/g, '').toLowerCase() === lowerH.replace(/_/g, '')) {
            return rowData[key];
          }
        }
        return "";
      });

      sheet.appendRow(newRow);
      return jsonResponse({
        status: "success",
        message: "Data berhasil disimpan ke Google Sheets",
        id: rowData.ID || rowData.id || ""
      });
    }

    // 2. UPDATE ACTION
    if (action === "update") {
      const sheet = ss.getSheetByName(targetSheet);
      if (!sheet) {
        return jsonResponse({ status: "error", message: "Sheet tidak ditemukan: " + targetSheet });
      }

      const values = sheet.getDataRange().getValues();
      if (values.length < 2) {
        return jsonResponse({ status: "error", message: "Sheet masih kosong" });
      }

      const headers = values[0];
      const idColIdx = headers.findIndex(function (h) {
        return String(h).toLowerCase() === "id";
      });

      if (idColIdx === -1) {
        return jsonResponse({ status: "error", message: "Kolom ID tidak ditemukan di sheet " + targetSheet });
      }

      const targetId = String(rowData.ID || rowData.id || payload.id || "");
      let foundRow = -1;

      for (let i = 1; i < values.length; i++) {
        if (String(values[i][idColIdx]) === targetId) {
          foundRow = i + 1;
          break;
        }
      }

      if (foundRow > -1) {
        headers.forEach(function (h, colIdx) {
          let valToSet = undefined;
          if (rowData[h] !== undefined) valToSet = rowData[h];
          else {
            const lowerH = h.toLowerCase();
            for (const key of Object.keys(rowData)) {
              if (key.toLowerCase() === lowerH || key.replace(/_/g, '').toLowerCase() === lowerH.replace(/_/g, '')) {
                valToSet = rowData[key];
                break;
              }
            }
          }

          if (valToSet !== undefined) {
            sheet.getRange(foundRow, colIdx + 1).setValue(valToSet);
          }
        });

        return jsonResponse({
          status: "success",
          message: "Data berhasil diperbarui di Google Sheets"
        });
      }

      return jsonResponse({
        status: "error",
        message: "Data dengan ID " + targetId + " tidak ditemukan"
      });
    }

    // 3. DELETE ACTION
    if (action === "delete") {
      const sheet = ss.getSheetByName(targetSheet);
      if (!sheet) {
        return jsonResponse({ status: "error", message: "Sheet tidak ditemukan: " + targetSheet });
      }

      const values = sheet.getDataRange().getValues();
      if (values.length < 2) {
        return jsonResponse({ status: "error", message: "Sheet kosong" });
      }

      const headers = values[0];
      const idColIdx = headers.findIndex(function (h) {
        return String(h).toLowerCase() === "id";
      });

      if (idColIdx === -1) {
        return jsonResponse({ status: "error", message: "Kolom ID tidak ditemukan di sheet " + targetSheet });
      }

      const targetId = String((rowData && (rowData.ID || rowData.id)) || payload.id || "");
      for (let i = 1; i < values.length; i++) {
        if (String(values[i][idColIdx]) === targetId) {
          sheet.deleteRow(i + 1);
          return jsonResponse({
            status: "success",
            message: "Data berhasil dihapus dari Google Sheets"
          });
        }
      }

      return jsonResponse({
        status: "error",
        message: "ID tidak ditemukan untuk dihapus"
      });
    }

    return jsonResponse({
      status: "error",
      message: "Aksi '" + action + "' tidak dikenali"
    });
  } catch (err) {
    return jsonResponse({
      status: "error",
      message: err.toString()
    });
  }
}

/**
 * Read all rows from sheet into JSON array of objects
 */
function getSheetData(ss, sheetName) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() < 2) return [];
  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];
  const results = [];
  for (let i = 1; i < rows.length; i++) {
    const item = {};
    headers.forEach(function (h, idx) {
      item[h] = rows[i][idx];
    });
    results.push(item);
  }
  return results;
}

/**
 * Formats JSON response with proper MIME type
 */
function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
