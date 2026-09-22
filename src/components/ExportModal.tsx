import React, { useState } from 'react';
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import { Download, FileImage, FileText, X, CheckCircle2, Loader2, Printer, Image as ImageIcon } from 'lucide-react';
import { LogoSettingsModal } from './LogoSettingsModal';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  nomorSurat?: string;
  perihal?: string;
  children: React.ReactNode;
  defaultFilename?: string;
  isAdmin?: boolean;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  title,
  nomorSurat,
  perihal,
  children,
  defaultFilename = 'Laporan_BINTANG_SAMUDRA',
  isAdmin = false,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

  if (!isOpen) return null;

  const handleExportJpg = async () => {
    setIsExporting(true);
    setStatusMsg('Memproses konversi dokumen ke format JPG...');
    try {
      const element = document.getElementById('printable-official-document');
      if (!element) throw new Error('Dokumen tidak ditemukan');

      const canvas = await html2canvas(element, {
        scale: 2, // High resolution
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const link = document.createElement('a');
      link.download = `${defaultFilename}_${Date.now()}.jpg`;
      link.href = imgData;
      link.click();

      setStatusMsg('Berhasil mengunduh dokumen JPG!');
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err) {
      console.error('Export JPG failed:', err);
      setStatusMsg('Gagal mengonversi gambar JPG. Silakan coba lagi.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPdf = async () => {
    setIsExporting(true);
    setStatusMsg('Mengompilasi halaman A4 dengan margin 0.5 mm ke format PDF...');
    try {
      const element = document.getElementById('printable-official-document');
      if (!element) throw new Error('Dokumen tidak ditemukan');

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      
      // Standard A4 dimensions in mm: 210 x 297
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // 0.5 mm margin requested by user
      const marginMm = 0.5;
      const pdfWidth = 210 - marginMm * 2;
      const pageHeight = 297 - marginMm * 2;
      const totalPdfHeight = (canvas.height * pdfWidth) / canvas.width;

      if (totalPdfHeight <= pageHeight) {
        pdf.addImage(imgData, 'JPEG', marginMm, marginMm, pdfWidth, totalPdfHeight);
      } else {
        let heightLeft = totalPdfHeight;
        let position = marginMm;

        pdf.addImage(imgData, 'JPEG', marginMm, position, pdfWidth, totalPdfHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
          position = marginMm - (totalPdfHeight - heightLeft);
          pdf.addPage();
          pdf.addImage(imgData, 'JPEG', marginMm, position, pdfWidth, totalPdfHeight);
          heightLeft -= pageHeight;
        }
      }

      pdf.save(`${defaultFilename}_${Date.now()}.pdf`);

      setStatusMsg('Berhasil mengunduh dokumen PDF resmi!');
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err) {
      console.error('Export PDF failed:', err);
      setStatusMsg('Gagal membuat PDF. Silakan coba lagi.');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col border border-slate-200 overflow-hidden">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">
                Pratinjau & Cetak Dokumen Resmi BINTANG SAMUDRA
              </h3>
              <p className="text-xs text-slate-500">
                Format Surat Resmi A4 dengan Kop PBVSI, Logo Klub, dan Tanda Tangan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                type="button"
                onClick={() => setIsLogoModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold shadow-sm transition-all border border-slate-300 cursor-pointer"
                title="Ganti Link atau Unggah Gambar Logo Klub Kop Surat (Khusus Admin)"
              >
                <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                <span>Link Logo</span>
              </button>
            )}
            <button
              onClick={handleExportJpg}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileImage className="w-3.5 h-3.5" />}
              Cetak JPG
            </button>
            <button
              onClick={handleExportPdf}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
              Cetak Pdf
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Toast */}
        {statusMsg && (
          <div className="px-6 py-2 bg-emerald-50 text-emerald-800 border-b border-emerald-200 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Document Preview Canvas (Scrollable) */}
        <div className="flex-1 overflow-auto bg-slate-200/80 p-4 sm:p-6 flex justify-center">
          <div className="shadow-2xl bg-white border border-slate-300">
            {children}
          </div>
        </div>

        {/* Modal Bottom Action Footnote */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>📐 Ukuran Kertas: A4 (210 x 297 mm) | Margin 0.5 mm Presisi</span>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="text-slate-600 hover:text-slate-900 font-medium px-3 py-1 rounded border border-slate-300 hover:bg-slate-100 transition cursor-pointer"
            >
              Print Langsung
            </button>
            <button
              onClick={onClose}
              className="text-slate-600 hover:text-slate-800 font-medium px-3 py-1 cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>

      <LogoSettingsModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
        isAdmin={isAdmin}
      />
    </div>
  );
};
