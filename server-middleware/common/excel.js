import ExcelJS from 'exceljs'
import * as utils from './utils.js'

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

export const writeExcel = async (listSekolah, filePath) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(utils.pathResolve(filePath));

  const worksheet = workbook.getWorksheet('Sheet1')
  worksheet.columns = sekolahExcelColumns

  for (const [index, sekolah] of listSekolah.entries()) {
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
  return workbook
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
