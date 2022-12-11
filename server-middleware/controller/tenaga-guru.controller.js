import express from 'express'
import * as uuid from 'uuid'
import readExcelFile from 'read-excel-file/node'

import prisma from '../db.js'
import * as utils from '../common/utils.js'
import * as excelUtils from '../common/excel.js'
import * as constants from '../common/constant.js'
import { multipart, uploadValidation } from '../common/upload.js'

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
  'kategori',
  'is_active',
  'jenjang',
]

const actionGuru = {
  findListByUserAccess: async (req) => {
    const { user } = req
    const query = utils.addQuerySekolahByUserAccess(
      utils.pick(req.query, ['nama', 'kategori', 'nuptk', 'sekolah_id', 'status']),
      user,
    )
    const queryGuru = []
    const querySekolahUserAccess = {}
    if (query.tingkat) {
      querySekolahUserAccess.tingkat = query.tingkat
    }
    if (Object.hasOwn(query, 'is_madrasah')) {
      querySekolahUserAccess.is_madrasah = query.is_madrasah
    }

    if (query.nama) {
      queryGuru.push({ nama: { contains: query.nama, mode: 'insensitive' }})
    }
    if (query.nuptk) {
      queryGuru.push({ nuptk: { contains: query.nuptk, mode: 'insensitive' } })
    }

    const whereCondition = { sekolah: querySekolahUserAccess, AND: [{ deleted: false }] }

    if (queryGuru.length) {
      whereCondition.OR = queryGuru
    }
    if (query.sekolah_id) {
      whereCondition.AND = whereCondition.AND.concat([{ sekolah_id: query.sekolah_id }])
    }
    if (query.kategori) {
      whereCondition.AND = whereCondition.AND.concat([{ kategori: query.kategori }])
    }
    if (query.status) {
      whereCondition.AND = whereCondition.AND.concat([{ status: query.status }])
    }

    const list = await prisma.tenagaPendidikanGuru.findMany({
      ...utils.prismaPagination(req.query.page, req.query.limit),
      where: whereCondition,
      select: {
        ...(utils.reduceStringArrayToObjValue(
            [
              'id', 'nama', 'kategori', 'no_ktp', 'nuptk', 'no_ponsel',
              'tanggal_lahir', 'alamat', 'jenis_kelamin', 'ptk', 'latar_belakang',
              'status', 'jabatan', 'jenjang', 'is_active',
            ],
            true,
          )
        ),
        sekolah: {
          select: utils.reduceStringArrayToObjValue(['id', 'nama', 'npsn'], true),
        },
      },
      orderBy: [{ created_at: 'desc' }],
    })
    return list
  }
}

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
    if (!tenagaGuruReq.kategori) {
      tenagaGuruReq.kategori = constants.GURU
    }
    const created = await prisma.tenagaPendidikanGuru.create({
      data: tenagaGuruReq,
    })
    return res.status(201).json(created)
  },
  update: async (req, res) => {
    const { id, ...reqBody } = req.body
    const guruReq = utils.pick(reqBody, guruReqDto)
    if (!id) {
      return res.status(400).send('id is required')
    }

    await prisma.tenagaPendidikanGuru.update({
      where: { id },
      data: guruReq,
    })

    return res.json({ message: 'ok' })
  },
  downloadTenagaGuruTemplate: (_req, res) => {
    res.sendFile(utils.pathResolve('/templates/template-guru-dan-tenaga-pendidik.xlsx'), (err) => {
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
    const listTenagaDanGuru = rows.slice(1)
    const output = []
    const createMany = []
    for (const tenagaGuru of listTenagaDanGuru) {
      if (!tenagaGuru[0] || !tenagaGuru[1]) {
        break
      }

      const npsnSekolah = String(tenagaGuru[2])
      let uploadMessage = 'OK'
      const sekolah = await prisma.sekolah.findFirst({
        where: {
          npsn: npsnSekolah,
        },
      })

      const jenjang = tenagaGuru[14] === '-' ? '' : (tenagaGuru[14] || '').toLowerCase()
      const newTenagaGuru = {
        nama: tenagaGuru[1].trim(),
        sekolah_id: sekolah ? sekolah.id : '',
        kategori: tenagaGuru[3].toLowerCase() || constants.GURU,
        no_ktp: String(tenagaGuru[4]),
        nuptk: String(tenagaGuru[5]),
        no_ponsel: tenagaGuru[6].trim(),
        tanggal_lahir: new Date(tenagaGuru[7]),
        alamat: (tenagaGuru[8] || '').trim(),
        jenis_kelamin: tenagaGuru[9].toUpperCase(),
        ptk: (tenagaGuru[10] || ''),
        latar_belakang: (tenagaGuru[11] || '').trim(),
        status: tenagaGuru[12].toUpperCase(),
        jabatan: tenagaGuru[13] || '',
        jenjang,
      }

      if (newTenagaGuru.kategori === constants.GURU && newTenagaGuru.status === constants.NON_PNS) {
        newTenagaGuru.status = constants.GURU_TIDAK_TETAP
      }

      if (!sekolah) {
        uploadMessage = 'GAGAL UPLOAD: NPSN Sekolah tidak terdaftar'
      } else if (!utils.validateUploadSekolah(
          req.user,
          { tingkat: sekolah?.tingkat, is_madrasah: sekolah?.is_madrasah }
        )
      ) {
        uploadMessage = 'Akses tidak diizinkan'
      } else {
        // Update or create
        let existing = null
        if (newTenagaGuru.no_ktp) {
          existing = await prisma.tenagaPendidikanGuru.findFirst({
            where: { no_ktp: newTenagaGuru.no_ktp },
          })
        }

        if (existing) {
          uploadMessage = 'Data sama dengan nomor ktp telah diperbaharui'
          await prisma.tenagaPendidikanGuru.updateMany({
            where: { no_ktp: newTenagaGuru.no_ktp },
            data: newTenagaGuru,
          })
        } else {
          newTenagaGuru.id = uuid.v4()
          createMany.push(newTenagaGuru)
        }
      }

      output.push({
        ...newTenagaGuru,
        npsn: npsnSekolah,
        hasil_upload: uploadMessage,
      })
    }

    await prisma.tenagaPendidikanGuru.createMany({
      data: createMany,
    })

    const workbook = await excelUtils.writeExcel(
      '/templates/template-guru-dan-tenaga-pendidik.xlsx',
      output,
      constants.GURU,
      true,
    )

    await excelUtils.sendWorkBookAsResponse(
      res,
      { workbook, fileName: 'list-upload-tenaga-pendidik-guru.xlsx' },
    )
  },
  findListByUserAccess: async (req, res) => {
    const result = await actionGuru.findListByUserAccess(req)

    return res.json(result)
  },
  findGuruBySekolahId: async (req, res) => {
    const result = await prisma.tenagaPendidikanGuru.findMany({
      where: { sekolah_id: req.params.id, deleted: false }
    })

    return res.status(200).json(result)
  },
  downloadListByUserAccess: async (req, res) => {
  const list = await actionGuru.findListByUserAccess(req)
  const workbook = await excelUtils.writeExcel(
    '/templates/template-guru-dan-tenaga-pendidik.xlsx',
    list,
    constants.GURU,
  )

  await excelUtils
    .sendWorkBookAsResponse(res, { workbook, fileName: 'list-guru.xlsx' })
  },
  delete: async (req, res) => {
    await prisma.tenagaPendidikanGuru.delete({
      where: { id: req.params.id },
    })

    return res.json({ message: 'ok' })
  },
}

router.get('/download-template', utils.errorWrapper(tenagaGuruController.downloadTenagaGuruTemplate))
router.get('/download-list', utils.errorWrapper(tenagaGuruController.downloadListByUserAccess))
router.get('/', utils.errorWrapper(tenagaGuruController.findListByUserAccess))
router.get('/sekolah/:id', utils.errorWrapper(tenagaGuruController.findGuruBySekolahId))
router.get('/:id', utils.errorWrapper(tenagaGuruController.findOne))
router.put('/', utils.errorWrapper(tenagaGuruController.update))
router.post('/', utils.errorWrapper(tenagaGuruController.create))
router.post('/upload', multipart.single('file'), uploadValidation, utils.errorWrapper(tenagaGuruController.upload))
router.delete('/:id', utils.errorWrapper(tenagaGuruController.delete))

export default {
  path: '/tenaga-guru',
  handler: router,
}