import express from 'express'
import * as uuid from 'uuid'

import prisma from '../db.js'
import * as utils from '../common/utils.js'

const router = express.Router()

const siswaReqDto = [
  'id',
  'nama',
  'sekolah_id',
  'nomor_induk_nasional',
  'nomor_induk_sekolah',
  'kelas',
  'tanggal_lahir',
  'alamat',
  'no_ponsel',
  'tingkat',
  'tahun_ajaran',
  'jenis_kelamin',
  'tahun_angkatan',
]

const siswaController = {
  findOne: async (req, res) => {
    const siswa = await prisma.siswa.findFirst({
      where: { id: req.params.id },
      include: {
        sekolah: true,
      }
    })

    return res.json(siswa)
  },
  create: async (req, res) => {
    const siswaReq = utils.pick(req.body, siswaReqDto)
    if (siswaReq.nomor_induk_nasional) {
      const siswaTerdaftar = await prisma.siswa.findFirst({
        where: {
          nomor_induk_nasional: siswaReq.nomor_induk_nasional,
        },
      })

      if (siswaTerdaftar) {
        return res.status(400).send(
          `Siswa / Murid dengan nisn ${siswaReq.nomor_induk_nasional} sudah terdaftar`
        )
      }
    }

    siswaReq.id = uuid.v4()
    const created = await prisma.siswa.create({ data: siswaReq })
    return res.status(201).json(created)
  }
}

router.get('/:id', utils.errorWrapper(siswaController.findOne))
router.post('/', utils.errorWrapper(siswaController.create))

export default {
  path: '/siswa',
  handler: router,
}