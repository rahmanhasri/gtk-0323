import express from 'express'

import prisma from '../db.js'
import * as utils from '../common/utils.js'

const router = express.Router()

const mapGroupByCount = (fieldName) => (result) => {
  return result
    .map(item => ({ count: item._count[fieldName], [fieldName]: item[fieldName] }))
}
const dataController = {
  // jumlah sekolah by tingkat (query kecamatan and tingkat?),
  // TODO: Jumlah Murid
  // TODO: Jumlah guru
  getPresentaseByUserAccess: async (req, res) => {
    const resultTingkat = await prisma.sekolah.groupBy({
      by: ['tingkat'],
      _count: {
        tingkat: true
      }
    }).then(mapGroupByCount('tingkat'))
    const resultKecamatan = await prisma.sekolah.groupBy({
      by: ['kecamatan'],
      _count: {
        kecamatan: true
      }
    }).then(mapGroupByCount('kecamatan'))
    return res.status(200).json({
      tingkat: resultTingkat,
      kecamatan: resultKecamatan,
    })
  },
}

router.get('/presentase', utils.errorWrapper(dataController.getPresentaseByUserAccess))

export default {
  path: '/data',
  handler: router,
}
