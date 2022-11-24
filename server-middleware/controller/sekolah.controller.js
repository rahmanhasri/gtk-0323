import express from 'express'
import * as uuid from 'uuid'
import readExcelFile from 'read-excel-file/node'
import * as utils from '../common/utils.js'
import prisma from '../db.js'
import { multipart, uploadValidation } from '../common/upload.js'
import * as excelUtils from '../common/excel.js'
import * as constants from '../common/constant';

const router = express.Router()

const sekolahReqDto = [
  'id',
  'kecamatan',
  'kelurahan_atau_desa',
  'nama',
  'is_madrasah',
  'tingkat',
  'profil',
  'jenis',
  'additional_info',
  'koordinat',
  'npsn',
]

const sekolahController = {
  findOne: async (req, res) => {
    const sekolah = await prisma.sekolah.findFirst({
      where: { id: req.params.id },
      include: {
        daftar_siswa: true,
        daftar_guru: true,
        daftar_sarana_prasarana: true,
      },
    })
    return res.json(sekolah)
  },
  create: async (req, res) => {
    const sekolahReq = utils.pick(req.body, sekolahReqDto)
    if (!sekolahReq.npsn) {
      return res.status(400).json({
        errMessage: 'Npsn dibutuhkan',
      })
    }
    const sekolahTerdaftar = await prisma.sekolah.findFirst({
      where: {
        npsn: sekolahReq.npsn
      },
    })
    if (sekolahTerdaftar) {
      return res.status(400).json({
        errMessage: 'Sekolah dengan npsn sudah terdaftar',
      })
    }

    sekolahReq.id = uuid.v4()
    const sekolah = await prisma.sekolah.create({ data: sekolahReq })
    return res.status(201).json(sekolah)
  },
  update: async (req, res) => {
    const { id, ...reqBody } = req.body
    const sekolahReq = utils.pick(reqBody, sekolahReqDto)
    if (!id) {
      return res.status(400).send('id is required')
    }
    await prisma.sekolah.update({
      where: { id },
      data: sekolahReq,
    })
  },
  findListByUserAccess: async (req, res) => {
    const { user } = req;
    let query = utils.pick(req.query, ['nama', 'tingkat', 'kecamatan', 'kelurahan_atau_desa'])
    query = utils.addQuerySekolahByUserAccess(query, user)

    const listSekolah = await prisma.sekolah.findMany({
      ...utils.prismaPagination(req.query.page, req.query.limit),
      where: {
        ...query,
        nama: {
          contains: query.nama,
          mode: 'insensitive',
        },
      },
    })

    return res.json(listSekolah)
  },
  downloadListByFilterAndUserAccess: async (req, res) => {
    const { user } = req;
    let query = utils.pick(req.query, ['nama', 'tingkat', 'kecamatan', 'desa'])
    query = utils.addQuerySekolahByUserAccess(query, user)

    const listSekolah = await prisma.sekolah.findMany({
      where: {
        ...query,
        nama: {
          contains: query.nama,
        },
      },
    })


    const workbook = await excelUtils.writeExcel(
      '/templates/template-sekolah.xlsx',
      listSekolah,
      constants.SEKOLAH,
    )

    await excelUtils
      .sendWorkBookAsResponse(res, { workbook, fileName: 'list-sekolah.xlsx' })
  },
  downloadSekolahTemplate: (_req, res) => {
    res.sendFile(utils.pathResolve('/templates/template-sekolah.xlsx'), (err) => {
      if (err) {
        console.error(err)
        return res.status(500).json({
          errMessage: 'Error saat mengambil template',
        })
      }
    })
  },
  upload: async (req, res) => {
    const rows = await readExcelFile(req.file.buffer)
    const listSekolah = rows.slice(1)
    const output = []
    for (const sekolah of listSekolah) {
      if (!sekolah[0] || !sekolah[1] || !sekolah[10]) {
        break
      }

      const allowInsert = utils.validateUploadSekolah(
        req.user,
        { tingkat: sekolah[6], is_madrasah: sekolah[4] }
      )

      if (!allowInsert) {
        continue
      }

      const newSekolah = {
        nama: sekolah[1].trim(),
        kecamatan: sekolah[2].trim(),
        kelurahan_atau_desa: sekolah[3].trim(),
        is_madrasah: sekolah[4],
        jenis: (sekolah[5] || '').toLowerCase().trim(),
        tingkat: sekolah[6].trim(),
        profil: sekolah[7].trim(),
        koordinat: [sekolah[8].replace(',', '.').trim(), sekolah[9].replace(',', '.').trim()],
        npsn: sekolah[10].trim()
      }

      const existingSekolah = await prisma.sekolah.findFirst({
        where: {
          npsn: sekolah[10].trim()
        },
      })
      if (existingSekolah) {
        await prisma.sekolah.updateMany({
          where: {
            npsn: sekolah[10].trim(),
          },
          data: newSekolah,
        })
        output.push({ id: existingSekolah.id, ...newSekolah })
      } else {
        const created = await prisma.sekolah.create({
          data: {
            id: uuid.v4(),
            ...newSekolah,
          }
        })
        output.push(created)
      }
    }

    return res.status(201).json(output)
  },
  findAllSekolahByUserAccess: async (req, res) => {
    const query = utils.addQuerySekolahByUserAccess({}, req.user)
    const listSekolah = await prisma.sekolah.findMany({
      where: {
        ...query,
      },
      select: {
        id: true,
        nama: true,
      }
    })
    return res.json(listSekolah)
  },
}

router.post('/', utils.errorWrapper(sekolahController.create))
router.put('/', utils.errorWrapper(sekolahController.update))
router.get('/', utils.errorWrapper(sekolahController.findListByUserAccess))
router.get('/download-template', utils.errorWrapper(sekolahController.downloadSekolahTemplate))
router.get('/download-list', utils.errorWrapper(sekolahController.downloadListByFilterAndUserAccess))
router.get('/list-name', utils.errorWrapper(sekolahController.findAllSekolahByUserAccess))
router.get('/:id', utils.errorWrapper(sekolahController.findOne))
router.post('/upload', multipart.single('file'), uploadValidation, utils.errorWrapper(sekolahController.upload))

export default {
  path: '/sekolah',
  handler: router,
}
