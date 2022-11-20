import express from 'express'
import * as uuid from 'uuid'
import * as utils from '../common/utils.js'
import prisma from '../db.js'

const router = express.Router()

const guruReqDto = [
  'id',
  'nama',
  'no_ktp',
  'nuptk',
  'alamat',
  'no_ponsel',
  'ptk',
  'jenis_kelamin',
  'tanggal_lahir',
  'sekolah_id',
  'latar_belakang',
  'jabatan',
  'status',
]

const tenagaGuruController = {
  findOne: async (req, res) => {
    const tenagaGuru = await prisma.tenagaPendidikanGuru.findFirst({
      where: { id: req.params.id },
      include: {
        sekolah: true,
      }
    })
    return res.json(tenagaGuru)
  },
  create: async (req, res) => {
    const tenagaGuruReq = utils.pick(req.body, guruReqDto)
    tenagaGuruReq.id = uuid.v4()
    const created = await prisma.tenagaPendidikanGuru.create({
      data: tenagaGuruReq,
    })
    return res.status(201).json(created)
  },
  downloadTenagaGuruTemplate: (_req, res) => {
    res.sendFile(utils.pathResolve('/templates/template-guru.xlsx'), (err) => {
      if (err) {
        console.error(err)
        return res.status(500).send('Error saat mengambil template')
      }
    })
  },
}

router.get('/:id', utils.errorWrapper(tenagaGuruController.findOne))
router.post('/', utils.errorWrapper(tenagaGuruController.create))

export default {
  path: '/tenaga-guru',
  handler: router,
}