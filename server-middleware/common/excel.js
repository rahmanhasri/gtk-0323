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

export const writeExcel = async (
  filePath,
  data,
  type, // sekolah | siswa
  isUploadResult = false,
) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(utils.pathResolve(filePath));

  const worksheet = workbook.getWorksheet('Sheet1')

  if (type === constants.SEKOLAH) {
    writeExcelSekolah(data, worksheet)
  }

  if (type === constants.SISWA) {
    writeExcelSiswa(data, worksheet, isUploadResult)
  }


  return workbook
}

const writeExcelSekolah = (data, worksheet) => {
  worksheet.columns = sekolahExcelColumns

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
    row.getCell('npsn').value = siswa.npsn || '0'
    row.getCell('nomor_induk_nasional').value = siswa.nomor_induk_nasional || '-'
    row.getCell('nomor_induk_sekolah').value = siswa.nomor_induk_sekolah || '-'
    row.getCell('tanggal_lahir').value = utils.toStringDateDDMMYY(siswa.tanggal_lahir)
    row.getCell('alamat').value = siswa.alamat || '-'
    row.getCell('jenis_kelamin').value = siswa.jenis_kelamin || 'Laki-Laki'
    row.getCell('no_ponsel').value = siswa.no_ponsel || '-'
    row.getCell('tahun_angkatan').value = siswa.tahun_angkatan || '-'
    if (isUploadResult) {
      row.getCell('hasil_upload').value = siswa.hasil_upload
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
