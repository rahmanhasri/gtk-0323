import express from 'express'

import prisma from '../db.js'
import * as utils from '../common/utils.js'

const router = express.Router()

const mapGroupByCount = (fieldName) => (result) => {
  return result
    .map(item => ({ count: item._count[fieldName], [fieldName]: item[fieldName] }))
}
const dataController = {
  getPresentaseByUserAccess: async (req, res) => {
    const resultActiveSiswa = await prisma.siswa.count({
      where: {
        is_active: true,
        deleted: false,
      },
    })
    const resultActiveGuruDanTenaga = await prisma.tenagaPendidikanGuru.groupBy({
      by: ['kategori'],
      where: {
        is_active: true,
        deleted: false,
      },
      _count: {
        kategori: true
      }
    }).then(mapGroupByCount('kategori'))
    const resultTingkatSekolah = await prisma.sekolah.groupBy({
      by: ['tingkat'],
      _count: {
        tingkat: true
      }
    }).then(mapGroupByCount('tingkat'))

    const resultKecamatanSekolah = await prisma.sekolah.groupBy({
      by: ['kecamatan'],
      _count: {
        kecamatan: true
      }
    }).then(mapGroupByCount('kecamatan'))

    const resultJenisSekolah = await prisma.sekolah.groupBy({
      by: ['jenis'],
      _count: { jenis: true }
    }).then(mapGroupByCount('jenis'))

    return res.status(200).json({
      countTingkat: resultTingkatSekolah,
      countJenis: resultJenisSekolah,
      countKecamatan: resultKecamatanSekolah,
      totalSiswa: resultActiveSiswa,
      totalGuru: resultActiveGuruDanTenaga,
    })
  },
}

router.get('/presentase', utils.errorWrapper(dataController.getPresentaseByUserAccess))

export default {
  path: '/data',
  handler: router,
}
