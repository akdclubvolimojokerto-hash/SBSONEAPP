import React, { useState } from 'react';
import {
  X,
  Database,
  Link,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  TableProperties,
  Sparkles,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { DEFAULT_GAS_CODE, testSheetsConnection } from '../services/sheetsService';

interface GoogleSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sheetsUrl: string;
  onSaveUrl: (url: string) => void;
}

export const GoogleSheetsModal: React.FC<GoogleSheetsModalProps> = ({
  isOpen,
  onClose,
  sheetsUrl,
  onSaveUrl,
}) => {
  const [urlInput, setUrlInput] = useState(sheetsUrl);
  const [copied, setCopied] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(DEFAULT_GAS_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleTest = async () => {
    if (!urlInput.trim()) {
      setTestResult({
        success: false,
        message: 'Masukkan URL Google Apps Script Web App terlebih dahulu!',
      });
      return;
    }
    setTesting(true);
    setTestResult(null);
    const result = await testSheetsConnection(urlInput.trim());
    setTesting(false);
    setTestResult(result);
    if (result.success) {
      onSaveUrl(urlInput.trim());
    }
  };

  const handleSaveOnly = () => {
    onSaveUrl(urlInput.trim());
    setTestResult({
      success: true,
      message: 'URL Google Apps Script berhasil disimpan ke sistem!',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <Database className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Integrasi Database Google Sheets</h3>
              <p className="text-xs text-blue-200">
                Hubungkan SYSTEM BS ONE dengan Google Apps Script Web App API
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* URL Input Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Google Apps Script Web App URL (Spreadsheet API)
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Link className="w-4 h-4" />
                </div>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <button
                onClick={handleTest}
                disabled={testing}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer shrink-0"
              >
                {testing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                Tes & Simpan
              </button>
            </div>

            {testResult && (
              <div
                className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                  testResult.success
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {testResult.success ? (
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}

            <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
              <span>
                Status saat ini:{' '}
                {sheetsUrl ? (
                  <span className="text-emerald-600 font-bold">● Terhubung ke Google Sheets</span>
                ) : (
                  <span className="text-amber-600 font-bold">● Mode Demo / Local Storage Aktif</span>
                )}
              </span>
              <button
                onClick={handleSaveOnly}
                className="text-blue-700 hover:underline font-semibold cursor-pointer"
              >
                Simpan Langsung
              </button>
            </div>
          </div>

          {/* Tutorial Step-by-Step */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
            <h4 className="font-bold text-slate-800 flex items-center gap-2 text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Cara Menghubungkan Google Sheets (3 Langkah Mudah):
            </h4>
            <ol className="list-decimal list-inside text-xs text-slate-600 space-y-1.5">
              <li>
                Buka Spreadsheet baru di{' '}
                <a
                  href="https://sheets.new"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 font-medium underline inline-flex items-center gap-0.5"
                >
                  sheets.new <ExternalLink className="w-3 h-3" />
                </a>{' '}
                dan beri nama: <span className="font-mono bg-slate-100 px-1 py-0.5 rounded">Database SYSTEM BS ONE</span>.
              </li>
              <li>
                Klik menu <strong>Ekstensi</strong> &gt; <strong>Apps Script</strong>. Salin kode GAS di bawah dan tempel di editor.
              </li>
              <li>
                Klik <strong>Terapkan (Deploy)</strong> &gt; <strong>Penerapan Baru (New Deployment)</strong> &gt; Pilih <strong>Aplikasi Web</strong>:
                <ul className="list-disc list-inside pl-4 mt-1 space-y-0.5 text-slate-500">
                  <li>Jalankan sebagai: <strong>Saya</strong></li>
                  <li>Akses: <strong>Siapa Saja (Anyone)</strong> <span className="text-rose-600 font-semibold">(Wajib agar bisa sync!)</span></li>
                </ul>
              </li>
              <li>Salin URL Web App dan tempel pada form di atas.</li>
            </ol>
          </div>

          {/* Copyable Apps Script Code */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <TableProperties className="w-4 h-4 text-blue-600" />
                Kode Google Apps Script (Otomatis Buat 9 Lembar Kerja):
              </span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold shadow-sm transition cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Tersalin!' : 'Salin Semua Kode GAS'}
              </button>
            </div>
            <div className="relative">
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl text-[11px] font-mono overflow-x-auto max-h-56 leading-relaxed border border-slate-800">
                {DEFAULT_GAS_CODE}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition cursor-pointer"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
