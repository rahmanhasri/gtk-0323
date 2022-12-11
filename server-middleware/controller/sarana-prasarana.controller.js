import express from 'express'
import * as uuid from 'uuid'
import prisma from '../db.js'
import * as utils from '../common/utils.js'
import {
  multipart,
  uploadValidation,
  uploadToS3,
  getS3FullUrl,
} from '../common/upload.js'

const router = express.Router()

const saranaReqDto = [
  'id',
  'nama',
  'jumlah',
  'jenis',
  'sekolah_id',
  'kondisi',
  'daftar_foto_url',
]

const inventarisReqDto = [
  'id',
  'nama',
  'kode_inventaris',
  'kondisi',
  'daftar_foto_url',
  'sarana_prasarana_id',
]

const saranaPrasaranaController = {
  create: async (req, res) => {
    const saranaReq = utils.pick(req.body, saranaReqDto)
    if (!saranaReq.sekolah_id) {
      return res.status(400).json({
        errMessage: 'sekolahId dibutuhkan',
      })
    }

    saranaReq.id = uuid.v4()
    const sarana = await prisma.saranaPrasarana.create({ data: saranaReq })
    return res.status(201).json(sarana)
  },

  findOneSaranaPrasarana: async (req, res) => {
    const sarana = await prisma.saranaPrasarana.findFirst({
      where: { id: req.params.id },
      include: {
        daftar_inventori: {
          select: utils.reduceStringArrayToObjValue(['id', 'kondisi', 'nama', 'daftar_foto_url', 'kode_inventaris'], true),
          where: { deleted: false },
        },
        sekolah: true,
      },
    })
    return res.json(sarana)
  },

  update: async (req, res) => {
    const { id, ...reqBody } = req.body
    const saranaReq = utils.pick(reqBody, saranaReqDto)
    if (!id) {
      return res.status(400).json({
        errMessage: 'id dibutuhkan',
      })
    }
    await prisma.saranaPrasarana.update({
      data: saranaReq,
      where: { id },
    })
    return res.json({ message: 'ok' })
  },

  deleteSaranaPrasarana: async (req, res) => {
    await prisma.inventaris.updateMany({
      where: { sarana_prasarana_id: req.params.id },
      data: { deleted: true },
    })
    await prisma.saranaPrasarana.delete({ where: { id: req.params.id } })
    return res.json({ message: 'ok' })
  },

  createInventaris: async (req, res) => {
    const inventarisReq = utils.pick(req.body, inventarisReqDto)
    if (!inventarisReq.sarana_prasarana_id) {
      return res.status(400).json({
        errMessage: 'sarana_prasarana_id dibutuhkan',
      })
    }
    const inventaris = await prisma.inventaris.create({ data: inventarisReq })
    return res.status(201).json(inventaris)
  },

  updateInventaris: async (req, res) => {
    const { id, ...reqBody } = req.body
    const inventarisReq = utils.pick(reqBody, inventarisReqDto)
    await prisma.inventaris.update({
      data: inventarisReq,
      where: { id }
    })
    return res.json({ message: 'ok' })
  },

  deleteInventaris: async (req, res) => {
    await prisma.inventaris.delete({ where: { id: req.params.id } })
    return res.json({ message: 'ok' })
  },
  uploadImage: async (req, res) => {
    const fileName = `${req.file.fileName}-${Date.now()}.${req.file.extension}`
    const response = await uploadToS3(req.file.buffer, req.body.folder || '/assets', fileName)
    if (!response) {
      return res.status(500).json({ errMessage: 'ada kesalahan di server' })
    }
    return res.status(201).json({ fileURL: getS3FullUrl(response) })
  },
}

router.post('/', utils.errorWrapper(saranaPrasaranaController.create))
router.post('/upload-image',
  multipart.single('file'),
  uploadValidation,
  utils.errorWrapper(saranaPrasaranaController.uploadImage),
)
router.put('/', utils.errorWrapper(saranaPrasaranaController.update))
router.delete('/inventaris/:id', utils.errorWrapper(saranaPrasaranaController.deleteInventaris))
router.delete('/:id', utils.errorWrapper(saranaPrasaranaController.deleteSaranaPrasarana))
router.get('/:id', utils.errorWrapper(saranaPrasaranaController.findOneSaranaPrasarana))
router.post('/inventaris', utils.errorWrapper(saranaPrasaranaController.createInventaris))
router.put('/inventaris', utils.errorWrapper(saranaPrasaranaController.updateInventaris))
router.get('/:id', utils.errorWrapper(saranaPrasaranaController.findOneInventaris))

export default {
  path: '/sarana',
  handler: router,
}
