import ExcelJS from 'exceljs'
import * as utils from './utils.js'
import * as constants from './constant.js'

const sekolahExcelColumns = [
  { header: 'No.', key: 'index', width: 5 },
  { header: 'Nama', key: 'nama', width: 32 },
  { header: 'Kecamatan', key: 'kecamatan', width: 32 },
  { header: 'Kelurahan / Desa', key: 'kelurahan_atau_desa', width: 32 },
  { header: 'Madrasah', key: 'is_madrasah', width: 16 },
  { header: 'Jenis', key: 'jenis', width: 32 },
  { header: 'Tingkat', key: 'tingkat', width: 16 },
  { header: 'Profil', key: 'profil', width: 48 },
  { header: 'Longitude', key: 'longitude', width: 16 },
  { header: 'Latitude', key: 'latitude', width: 16 },
  { header: 'NPSN', key: 'npsn', width: 16 },
]

const siswaExcelColumns = [
  { header: 'No.', key: 'index', width: 5 },
  { header: 'Nama', key: 'nama', width: 32 },
  { header: 'NPSN Sekolah', key: 'npsn', width: 20 },
  { header: 'Nomor Induk Nasional', key: 'nomor_induk_nasional', width: 24 },
  { header: 'Nomor Induk Sekolah', key: 'nomor_induk_sekolah', width: 24 },
  { header: 'Tanggal Lahir', key: 'tanggal_lahir', width: 16 },
  { header: 'Alamat', key: 'alamat', width: 32 },
  { header: 'Jenis Kelamin', key: 'jenis_kelamin', width: 16 },
  { header: 'No Ponsel', key: 'no_ponsel', width: 16 },
  { header: 'Tahun Angkatan', key: 'tahun_angkatan', width: 16 },
]

const guruExcelColumns = [
  { header: 'No.', key: 'index', width: 5 },
  { header: 'Nama', key: 'nama', width: 32 },
  { header: 'NPSN Sekolah', key: 'npsn', width: 20 },
  { header: 'Kategori', key: 'kategori', width: 16 },
  { header: 'No KTP', key: 'no_ktp', width: 20 },
  { header: 'NUPTK', key: 'nuptk', width: 16 },
  { header: 'No Ponsel', key: 'no_ponsel', width: 16 },
  { header: 'Tanggal Lahir', key: 'tanggal_lahir', width: 16 },
  { header: 'Alamat', key: 'alamat', width: 32 },
  { header: 'Jenis Kelamin', key: 'jenis_kelamin', width: 16 },
  { header: 'Mata Kelas PTK', key: 'ptk', width: 16 },
  { header: 'Latar Belakang', key: 'latar_belakang', width: 20 },
  { header: 'Status', key: 'status', width: 16 },
  { header: 'Jabatan', key: 'jabatan', width: 16 },
  { header: 'Jenjang', key: 'jenjang', width: 16 },
]

export const writeExcel = async (
  filePath,
  data,
  type, // sekolah | siswa | guru
  isUploadResult = false,
) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(utils.pathResolve(filePath));

  const worksheet = workbook.getWorksheet('Sheet1')

  if (type === constants.SEKOLAH) {
    writeExcelSekolah(data, worksheet, isUploadResult)
  }

  if (type === constants.SISWA) {
    writeExcelSiswa(data, worksheet, isUploadResult)
  }

  if (type === constants.GURU) {
    writeExcelGuru(data, worksheet, isUploadResult)
  }


  return workbook
}

const writeExcelSekolah = (data, worksheet, isUploadResult) => {
  let columns = sekolahExcelColumns
  if (isUploadResult) {
    columns = sekolahExcelColumns.concat([{
      header: 'Hasil Upload', key: 'hasil_upload', width: 32
    }])
  }
  worksheet.columns = columns

  for (const [index, sekolah] of data.entries()) {
    const row = worksheet.getRow(index + 2)
    row.getCell('index').value = index + 1
    row.getCell('nama').value = sekolah.nama
    row.getCell('kecamatan').value = sekolah.kecamatan
    row.getCell('kelurahan_atau_desa').value = sekolah.kelurahan_atau_desa || '-'
    row.getCell('is_madrasah').value = sekolah.is_madrasah || false
    row.getCell('jenis').value = sekolah.jenis
    row.getCell('tingkat').value = sekolah.tingkat
    row.getCell('profil').value = sekolah.profil || '-'
    row.getCell('longitude').value = sekolah.koordinat.length ? sekolah.koordinat[0] : '-'
    row.getCell('latitude').value = sekolah.koordinat.length ? sekolah.koordinat[1] : '-'
    row.getCell('npsn').value = sekolah.npsn || '-'
    if (isUploadResult) {
      row.getCell('hasil_upload').value = sekolah.hasil_upload
    }
  }

  return worksheet
}

const writeExcelSiswa = (data, worksheet, isUploadResult) => {
  let columns = siswaExcelColumns
  if (isUploadResult) {
    columns = siswaExcelColumns.concat([{
      header: 'Hasil Upload', key: 'hasil_upload', width: 32
    }])
  }
  worksheet.columns = columns


  for (const [index, siswa] of data.entries()) {
    const row = worksheet.getRow(index + 2)
    row.getCell('index').value = index + 1
    row.getCell('nama').value = siswa.nama
    row.getCell('npsn').value = siswa.sekolah?.npsn || '0'
    row.getCell('nomor_induk_nasional').value = siswa.nomor_induk_nasional || '-'
    row.getCell('nomor_induk_sekolah').value = siswa.nomor_induk_sekolah || '-'
    row.getCell('tanggal_lahir').value = utils.toStringDateDDMMYY(siswa.tanggal_lahir)
    row.getCell('alamat').value = siswa.alamat || '-'
    row.getCell('jenis_kelamin').value = siswa.jenis_kelamin ? constants.EXCEL[siswa.jenis_kelamin] : 'Laki-Laki'
    row.getCell('no_ponsel').value = siswa.no_ponsel || '-'
    row.getCell('tahun_angkatan').value = siswa.tahun_angkatan || '-'
    if (isUploadResult) {
      row.getCell('hasil_upload').value = siswa.hasil_upload
    }
  }

  return worksheet
}

const writeExcelGuru = (data, worksheet, isUploadResult) => {
  let columns = guruExcelColumns
  if (isUploadResult) {
    columns = guruExcelColumns.concat([{
      header: 'Hasil Upload', key: 'hasil_upload', width: 32
    }])
  }
  worksheet.columns = columns

  for (const [index, guru] of data.entries()) {
    const row = worksheet.getRow(index + 2)
    row.getCell('index').value = index + 1
    row.getCell('nama').value = guru.nama || '-'
    row.getCell('npsn').value = guru.sekolah?.npsn || '0'
    row.getCell('kategori').value = guru.kategori ? constants.EXCEL[guru.kategori] : '-'
    row.getCell('no_ktp').value = guru.no_ktp || '-'
    row.getCell('nuptk').value = guru.nuptk || '-'
    row.getCell('no_ponsel').value = guru.no_ponsel || '-'
    row.getCell('tanggal_lahir').value = guru.tanggal_lahir ? utils.toStringDateDDMMYY(guru.tanggal_lahir) : '-'
    row.getCell('alamat').value = guru.alamat || '-'
    row.getCell('jenis_kelamin').value = guru.jenis_kelamin || 'Laki-Laki'
    row.getCell('ptk').value = guru.ptk || '-'
    row.getCell('latar_belakang').value = guru.latar_belakang || '-'
    row.getCell('status').value = guru.status ? constants.EXCEL[guru.status] : '-'
    row.getCell('jabatan').value = guru.jabatan || '-'
    row.getCell('jenjang').value = guru.jenjang ? constants.EXCEL[guru.jenjang] : '-'
    if (isUploadResult) {
      row.getCell('hasil_upload').value = guru.hasil_upload
    }
  }

  return worksheet
}

export const sendWorkBookAsResponse = async (
  res,
  {
    workbook,
    fileName,
  }
) => {
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader("Content-Disposition", "attachment; filename=" + fileName);

  await workbook.xlsx.write(res);

  res.end();
}
