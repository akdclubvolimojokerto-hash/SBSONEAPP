import React from 'react';
import {
  ReportType,
  DataMurid,
  DataPengurus,
  DataKegiatan,
  JadwalPelatihan,
  DataAbsen,
  JadwalPiket,
  Keuangan,
  DataStruktur,
} from '../types';

interface OfficialReportContentProps {
  reportType: ReportType;
  data: any[];
  struktur?: DataStruktur;
}

export const OfficialReportContent: React.FC<OfficialReportContentProps> = ({
  reportType,
  data,
  struktur,
}) => {
  if (reportType === 'murid') {
    const muridList = data as DataMurid[];
    return (
      <div className="space-y-4 text-xs font-sans">
        <div className="text-center pb-2">
          <h4 className="font-bold text-sm uppercase tracking-wide text-slate-900">
            DAFTAR BIODATA ATLET / MURID BINAAN RESMI
          </h4>
          <p className="text-[11px] text-slate-500">
            Tahun Pembinaan 2026 - PBVSI Kabupaten Mojokerto
          </p>
        </div>

        <table className="w-full border-collapse border border-slate-400 text-[11px]">
          <thead>
            <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-400">
              <th className="border border-slate-300 py-1.5 px-2 w-8 text-center">No</th>
              <th className="border border-slate-300 py-1.5 px-2 w-14 text-center">Foto</th>
              <th className="border border-slate-300 py-1.5 px-2 w-24">No Kode Murid</th>
              <th className="border border-slate-300 py-1.5 px-2">Nama Lengkap</th>
              <th className="border border-slate-300 py-1.5 px-2 w-16 text-center">L/P</th>
              <th className="border border-slate-300 py-1.5 px-2 w-28">Posisi Pemain</th>
              <th className="border border-slate-300 py-1.5 px-2 w-24">Kontak WA</th>
              <th className="border border-slate-300 py-1.5 px-2 w-20 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {muridList.map((m, idx) => (
              <tr key={m.id || idx} className="hover:bg-slate-50">
                <td className="border border-slate-300 py-1 px-2 text-center">{idx + 1}</td>
                <td className="border border-slate-300 py-1 px-1 text-center">
                  <div className="w-8 h-10 mx-auto rounded overflow-hidden border border-slate-300">
                    <img
                      src={m.fotoUrl}
                      alt={m.nama}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </td>
                <td className="border border-slate-300 py-1 px-2 font-mono font-bold text-slate-900">
                  {m.noKodeMurid}
                </td>
                <td className="border border-slate-300 py-1 px-2 font-semibold">
                  {m.nama}
                </td>
                <td className="border border-slate-300 py-1 px-2 text-center">
                  {m.jenisKelamin === 'Laki - Laki' ? 'L' : 'P'}
                </td>
                <td className="border border-slate-300 py-1 px-2">{m.posisiBermain || 'All-Round'}</td>
                <td className="border border-slate-300 py-1 px-2 font-mono">{m.noHp || m.noWhatsapp || '-'}</td>
                <td className="border border-slate-300 py-1 px-2 text-center font-bold">
                  {m.statusApproval || m.statusApprove || 'Approved'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (reportType === 'pengurus') {
    const pengurusList = data as DataPengurus[];
    return (
      <div className="space-y-4 text-xs font-sans">
        <div className="text-center pb-2">
          <h4 className="font-bold text-sm uppercase tracking-wide text-slate-900">
            DAFTAR PENGURUS &amp; PELATIH VOLLEYBALL CLUB BINTANG SAMUDRA
          </h4>
        </div>

        <table className="w-full border-collapse border border-slate-400 text-[11px]">
          <thead>
            <tr className="bg-slate-100 text-slate-800 font-bold">
              <th className="border border-slate-300 py-1.5 px-2 w-8 text-center">No</th>
              <th className="border border-slate-300 py-1.5 px-2 w-24">NIPC</th>
              <th className="border border-slate-300 py-1.5 px-2">Nama Lengkap</th>
              <th className="border border-slate-300 py-1.5 px-2">Jabatan Pengurus</th>
              <th className="border border-slate-300 py-1.5 px-2">Alamat Domisili</th>
              <th className="border border-slate-300 py-1.5 px-2 w-28">No WhatsApp</th>
            </tr>
          </thead>
          <tbody>
            {pengurusList.map((p, idx) => (
              <tr key={p.id || idx}>
                <td className="border border-slate-300 py-1.5 px-2 text-center">{idx + 1}</td>
                <td className="border border-slate-300 py-1.5 px-2 font-mono font-bold text-blue-900">
                  {p.nipc}
                </td>
                <td className="border border-slate-300 py-1.5 px-2 font-bold">{p.nama}</td>
                <td className="border border-slate-300 py-1.5 px-2">{p.jabatanPengurus}</td>
                <td className="border border-slate-300 py-1.5 px-2">{p.alamat}</td>
                <td className="border border-slate-300 py-1.5 px-2 font-mono">{p.noWa}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (reportType === 'kegiatan') {
    const kegiatanList = data as DataKegiatan[];
    return (
      <div className="space-y-4 text-xs font-sans">
        <div className="text-center pb-2">
          <h4 className="font-bold text-sm uppercase tracking-wide text-slate-900">
            DOKUMENTASI &amp; LAPORAN KEGIATAN RESMI CLUB BINTANG SAMUDRA
          </h4>
          <p className="text-[11px] text-slate-500">
            PBVSI Kabupaten Mojokerto • Arsip Pelaksanaan Program Kerja
          </p>
        </div>

        <table className="w-full border-collapse border border-slate-400 text-[11px]">
          <thead>
            <tr className="bg-slate-100 text-slate-800 font-bold">
              <th className="border border-slate-300 py-1.5 px-2 w-8 text-center">No</th>
              <th className="border border-slate-300 py-1.5 px-2 w-28 text-center">Tanggal &amp; Waktu</th>
              <th className="border border-slate-300 py-1.5 px-2 w-16 text-center">Foto</th>
              <th className="border border-slate-300 py-1.5 px-2 w-44">Judul Kegiatan</th>
              <th className="border border-slate-300 py-1.5 px-2">Uraian / Deskripsi Kegiatan</th>
              <th className="border border-slate-300 py-1.5 px-2 w-24 text-center">Diupload Oleh</th>
            </tr>
          </thead>
          <tbody>
            {kegiatanList.length === 0 ? (
              <tr>
                <td colSpan={6} className="border border-slate-300 py-6 text-center text-slate-400 italic">
                  Tidak ada data kegiatan yang dipilih
                </td>
              </tr>
            ) : (
              kegiatanList.map((k, idx) => (
                <tr key={k.id || idx} className="hover:bg-slate-50">
                  <td className="border border-slate-300 py-2 px-2 text-center font-mono">{idx + 1}</td>
                  <td className="border border-slate-300 py-2 px-2 font-mono text-[10px] text-slate-600 text-center">
                    {k.tanggalWaktu || '-'}
                  </td>
                  <td className="border border-slate-300 py-1.5 px-1 text-center">
                    {k.fotoUrl ? (
                      <div className="w-12 h-12 mx-auto rounded overflow-hidden border border-slate-300 bg-slate-100">
                        <img
                          src={k.fotoUrl}
                          alt={k.judulKegiatan}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">-</span>
                    )}
                  </td>
                  <td className="border border-slate-300 py-2 px-2 font-bold text-slate-900 leading-snug">
                    {k.judulKegiatan}
                  </td>
                  <td className="border border-slate-300 py-2 px-2 text-slate-700 leading-relaxed">
                    {k.uraianKegiatan || '-'}
                  </td>
                  <td className="border border-slate-300 py-2 px-2 text-center font-medium text-slate-600">
                    {k.createdBy || 'Admin'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  }

  if (reportType === 'jadwal') {
    const jadwalList = data as JadwalPelatihan[];
    return (
      <div className="space-y-4 text-xs font-sans">
        <div className="text-center pb-2">
          <h4 className="font-bold text-sm uppercase tracking-wide text-slate-900">
            JADWAL RESMI PELATIHAN ATLET BINTANG SAMUDRA
          </h4>
        </div>

        <table className="w-full border-collapse border border-slate-400 text-[11px]">
          <thead>
            <tr className="bg-slate-100 text-slate-800 font-bold">
              <th className="border border-slate-300 py-1.5 px-2 w-8 text-center">No</th>
              <th className="border border-slate-300 py-1.5 px-2 w-20">Hari</th>
              <th className="border border-slate-300 py-1.5 px-2 w-28">Waktu (WIB)</th>
              <th className="border border-slate-300 py-1.5 px-2">Pelatih Pengampu</th>
              <th className="border border-slate-300 py-1.5 px-2 w-24">NIPC</th>
              <th className="border border-slate-300 py-1.5 px-2">Bidang / Jabatan</th>
              <th className="border border-slate-300 py-1.5 px-2">Lokasi &amp; Catatan</th>
            </tr>
          </thead>
          <tbody>
            {jadwalList.map((j, idx) => (
              <tr key={j.id || idx}>
                <td className="border border-slate-300 py-1.5 px-2 text-center">{idx + 1}</td>
                <td className="border border-slate-300 py-1.5 px-2 font-bold text-blue-900">
                  {j.hari}
                </td>
                <td className="border border-slate-300 py-1.5 px-2 font-mono">{j.jam}</td>
                <td className="border border-slate-300 py-1.5 px-2 font-bold">{j.nama}</td>
                <td className="border border-slate-300 py-1.5 px-2 font-mono">{j.nipc}</td>
                <td className="border border-slate-300 py-1.5 px-2">{j.bidangKepengurusan}</td>
                <td className="border border-slate-300 py-1.5 px-2">
                  {j.lokasi} {j.catatan ? `(${j.catatan})` : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (reportType === 'keuangan') {
    const keuList = data as Keuangan[];
    const totalMasuk = keuList.reduce((acc, c) => acc + (c.pemasukan || 0), 0);
    const totalKeluar = keuList.reduce((acc, c) => acc + (c.pengeluaran || 0), 0);
    const saldo = keuList.length > 0 ? keuList[keuList.length - 1].totalSaldo : totalMasuk - totalKeluar;

    const fmt = (val: number) =>
      new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
      }).format(val);

    return (
      <div className="space-y-4 text-xs font-sans">
        <div className="text-center pb-2">
          <h4 className="font-bold text-sm uppercase tracking-wide text-slate-900">
            LAPORAN PEMBUKUAN ARUS KAS KEUANGAN CLUB
          </h4>
        </div>

        <table className="w-full border-collapse border border-slate-400 text-[11px]">
          <thead>
            <tr className="bg-slate-100 text-slate-800 font-bold">
              <th className="border border-slate-300 py-1.5 px-2 w-8 text-center">No</th>
              <th className="border border-slate-300 py-1.5 px-2 w-32">Tanggal &amp; Waktu</th>
              <th className="border border-slate-300 py-1.5 px-2">Uraian Transaksi</th>
              <th className="border border-slate-300 py-1.5 px-2 text-right w-28">Pemasukan</th>
              <th className="border border-slate-300 py-1.5 px-2 text-right w-28">Pengeluaran</th>
              <th className="border border-slate-300 py-1.5 px-2 text-right w-32">Total Saldo</th>
            </tr>
          </thead>
          <tbody>
            {keuList.map((k, idx) => (
              <tr key={k.id || idx}>
                <td className="border border-slate-300 py-1.5 px-2 text-center">{idx + 1}</td>
                <td className="border border-slate-300 py-1.5 px-2 font-mono text-[10px]">
                  {k.tanggalWaktu}
                </td>
                <td className="border border-slate-300 py-1.5 px-2 font-medium">
                  {k.uraianCatatan}
                </td>
                <td className="border border-slate-300 py-1.5 px-2 text-right font-mono text-emerald-800">
                  {k.pemasukan > 0 ? fmt(k.pemasukan) : '-'}
                </td>
                <td className="border border-slate-300 py-1.5 px-2 text-right font-mono text-rose-800">
                  {k.pengeluaran > 0 ? fmt(k.pengeluaran) : '-'}
                </td>
                <td className="border border-slate-300 py-1.5 px-2 text-right font-mono font-bold text-slate-900">
                  {fmt(k.totalSaldo)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-slate-100 font-bold">
              <td colSpan={3} className="border border-slate-300 py-2 px-2 text-right uppercase">
                Total Akumulasi:
              </td>
              <td className="border border-slate-300 py-2 px-2 text-right text-emerald-900">
                {fmt(totalMasuk)}
              </td>
              <td className="border border-slate-300 py-2 px-2 text-right text-rose-900">
                {fmt(totalKeluar)}
              </td>
              <td className="border border-slate-300 py-2 px-2 text-right text-blue-900 font-black">
                {fmt(saldo)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  }

  if (reportType === 'absen') {
    const absenList = data as DataAbsen[];
    return (
      <div className="space-y-4 text-xs font-sans">
        <div className="text-center pb-2">
          <h4 className="font-bold text-sm uppercase tracking-wide text-slate-900">
            REKAPITULASI PRESENSI &amp; KEHADIRAN ATLET BINTANG SAMUDRA
          </h4>
          <p className="text-[11px] text-slate-500">
            PBVSI Kabupaten Mojokerto • Catatan Kedisiplinan Latihan
          </p>
        </div>

        <table className="w-full border-collapse border border-slate-400 text-[11px]">
          <thead>
            <tr className="bg-slate-100 text-slate-800 font-bold">
              <th className="border border-slate-300 py-1.5 px-2 w-8 text-center">No</th>
              <th className="border border-slate-300 py-1.5 px-2 w-28">No Kode Murid</th>
              <th className="border border-slate-300 py-1.5 px-2">Nama Atlet</th>
              <th className="border border-slate-300 py-1.5 px-2 w-24 text-center">Periode/Bulan</th>
              <th className="border border-slate-300 py-1.5 px-2 w-16 text-center">Tgl (Hari)</th>
              <th className="border border-slate-300 py-1.5 px-2 w-20 text-center">Status</th>
              <th className="border border-slate-300 py-1.5 px-2">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {absenList.length === 0 ? (
              <tr>
                <td colSpan={7} className="border border-slate-300 py-6 text-center text-slate-400 italic">
                  Tidak ada data presensi yang dipilih
                </td>
              </tr>
            ) : (
              absenList.map((a, idx) => {
                const statusLabel =
                  a.status === '.'
                    ? 'Hadir'
                    : a.status === 'S'
                    ? 'Sakit'
                    : a.status === 'I'
                    ? 'Izin'
                    : a.status === 'A'
                    ? 'Alpa'
                    : a.status === 'L'
                    ? 'Libur'
                    : a.status;

                return (
                  <tr key={a.id || idx} className="hover:bg-slate-50">
                    <td className="border border-slate-300 py-1.5 px-2 text-center font-mono">{idx + 1}</td>
                    <td className="border border-slate-300 py-1.5 px-2 font-mono font-bold text-blue-900">
                      {a.noKodeMurid}
                    </td>
                    <td className="border border-slate-300 py-1.5 px-2 font-bold text-slate-900">{a.nama}</td>
                    <td className="border border-slate-300 py-1.5 px-2 font-mono text-center text-slate-600">
                      {a.bulanTahun}
                    </td>
                    <td className="border border-slate-300 py-1.5 px-2 font-mono text-center font-bold">
                      {a.tanggalHari}
                    </td>
                    <td className="border border-slate-300 py-1.5 px-2 text-center font-bold">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] ${
                          a.status === '.'
                            ? 'bg-emerald-100 text-emerald-800'
                            : a.status === 'S'
                            ? 'bg-blue-100 text-blue-800'
                            : a.status === 'I'
                            ? 'bg-amber-100 text-amber-800'
                            : a.status === 'A'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {statusLabel}
                      </span>
                    </td>
                    <td className="border border-slate-300 py-1.5 px-2 text-slate-600">
                      {a.keterangan || '-'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    );
  }

  if (reportType === 'piket') {
    const piketList = data as JadwalPiket[];
    return (
      <div className="space-y-4 text-xs font-sans">
        <div className="text-center pb-2">
          <h4 className="font-bold text-sm uppercase tracking-wide text-slate-900">
            JADWAL PIKET KEBERSIHAN &amp; PERAWATAN LAPANGAN
          </h4>
          <p className="text-[11px] text-slate-500">
            PBVSI Kabupaten Mojokerto • Tanggung Jawab Operasional Atlet Bintang Samudra
          </p>
        </div>

        <table className="w-full border-collapse border border-slate-400 text-[11px]">
          <thead>
            <tr className="bg-slate-100 text-slate-800 font-bold">
              <th className="border border-slate-300 py-1.5 px-2 w-8 text-center">No</th>
              <th className="border border-slate-300 py-1.5 px-2 w-28">No Kode Murid</th>
              <th className="border border-slate-300 py-1.5 px-2">Nama Atlet Petugas</th>
              <th className="border border-slate-300 py-1.5 px-2 w-28 text-center">Hari Piket</th>
              <th className="border border-slate-300 py-1.5 px-2">Uraian Tugas Piket Lapangan</th>
              <th className="border border-slate-300 py-1.5 px-2 w-28 text-center">Waktu Dibuat</th>
            </tr>
          </thead>
          <tbody>
            {piketList.length === 0 ? (
              <tr>
                <td colSpan={6} className="border border-slate-300 py-6 text-center text-slate-400 italic">
                  Tidak ada jadwal piket yang dipilih
                </td>
              </tr>
            ) : (
              piketList.map((p, idx) => (
                <tr key={p.id || idx} className="hover:bg-slate-50">
                  <td className="border border-slate-300 py-1.5 px-2 text-center font-mono">{idx + 1}</td>
                  <td className="border border-slate-300 py-1.5 px-2 font-mono font-bold text-blue-900">
                    {p.noKodeMurid}
                  </td>
                  <td className="border border-slate-300 py-1.5 px-2 font-bold text-slate-900">{p.nama}</td>
                  <td className="border border-slate-300 py-1.5 px-2 text-center font-bold text-slate-800 bg-slate-50">
                    {p.hari}
                  </td>
                  <td className="border border-slate-300 py-1.5 px-2 text-slate-700">
                    {p.piket || 'Membasahi lapangan dan Menyiapkan peralatan'}
                  </td>
                  <td className="border border-slate-300 py-1.5 px-2 text-center font-mono text-[10px] text-slate-500">
                    {p.tanggalWaktu || '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  }

  // Default fallback for other reports
  return (
    <div className="space-y-4 text-xs font-sans">
      <div className="text-center pb-2">
        <h4 className="font-bold text-sm uppercase tracking-wide text-slate-900">
          REKAPITULASI DOKUMEN RESMI KLUB
        </h4>
      </div>

      <table className="w-full border-collapse border border-slate-400 text-[11px]">
        <thead>
          <tr className="bg-slate-100 text-slate-800 font-bold">
            <th className="border border-slate-300 py-1.5 px-2 w-8 text-center">No</th>
            <th className="border border-slate-300 py-1.5 px-2 w-28">ID / Kode</th>
            <th className="border border-slate-300 py-1.5 px-2">Nama / Judul</th>
            <th className="border border-slate-300 py-1.5 px-2">Keterangan / Rincian</th>
            <th className="border border-slate-300 py-1.5 px-2 w-28 text-center">Waktu</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={item.id || idx}>
              <td className="border border-slate-300 py-1.5 px-2 text-center">{idx + 1}</td>
              <td className="border border-slate-300 py-1.5 px-2 font-mono">
                {item.noKodeMurid || item.nipc || item.id || `BS-${idx + 1}`}
              </td>
              <td className="border border-slate-300 py-1.5 px-2 font-bold">
                {item.nama || item.judulKegiatan || '-'}
              </td>
              <td className="border border-slate-300 py-1.5 px-2">
                {item.uraianKegiatan || item.keterangan || item.piket || '-'}
              </td>
              <td className="border border-slate-300 py-1.5 px-2 text-center font-mono text-[10px]">
                {item.tanggalWaktu || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
