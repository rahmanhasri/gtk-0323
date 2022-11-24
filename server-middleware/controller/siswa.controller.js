import express from 'express'
import * as uuid from 'uuid'
import readExcelFile from 'read-excel-file/node'

import prisma from '../db.js'
import * as utils from '../common/utils.js'
import * as excelUtils from '../common/excel.js'
import * as constants from '../common/constant.js'
import { multipart, uploadValidation } from '../common/upload.js'

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
  findListByUserAccess: async (req, res) => {
    const { user } = req
    const query = utils.addQuerySekolahByUserAccess(
      utils.pick(req.query, ['nama', 'nomor_induk_nasional', 'sekolah_id']),
      user,
    )

    const querySiswa = []
    const querySekolahUserAccess = {}
    if (query.nama) {
      querySiswa.push({ nama: { contains: query.nama }})
    }
    if (query.nomor_induk_nasional) {
      querySiswa.push({ nomor_induk_nasional: { contains: query.nomor_induk_nasional }})
    }
    if (query.sekolah_id) {
      querySiswa.push({ sekolah_id: query.sekolah_id })
    }
    if (query.tingkat) {
      querySekolahUserAccess.tingkat = query.tingkat
    }
    if (Object.hasOwn(query, 'is_madrasah')) {
      querySekolahUserAccess.is_madrasah = query.is_madrasah
    }

    const selectIncludeSiswa = querySiswa.length ? { OR: querySiswa } : {}

    const result = await prisma.sekolah.findMany({
      where: querySekolahUserAccess,
      select: {
        ...(utils.reduceStringArrayToObjValue(['id', 'nama'], true)),
        daftar_siswa: {
          where: selectIncludeSiswa,
          select: utils.reduceStringArrayToObjValue([
            'id', 'nama', 'nomor_induk_nasional', 'tingkat', 'jenis_kelamin', 'tahun_angkatan'
          ], true),
        }
      }
    })
    return res.status(200).json(result)
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

    const sekolah = await prisma.sekolah.findFirst({
      where: { id: siswaReq.sekolah_id }
    })

    siswaReq.id = uuid.v4()
    siswaReq.tingkat = sekolah?.tingkat
    const created = await prisma.siswa.create({ data: siswaReq })
    return res.status(201).json(created)
  },
  downloadSiswaTemplate: (_req, res) => {
    res.sendFile(utils.pathResolve('/templates/template-siswa.xlsx'), (err) => {
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
    const listSiswa = rows.slice(1)
    const output = []
    const createMany = []
    for (const siswa of listSiswa) {
      if (!siswa[0] || !siswa[1]) {
        break
      }

      const npsnSekolah = String(siswa[2])
      let uploadMessage = 'OK'
      const sekolah = await prisma.sekolah.findFirst({
        where: {
          npsn: npsnSekolah,
        },
      })

      const newSiswa = {
        id: uuid.v4(),
        nama: siswa[1].trim(),
        sekolah_id: sekolah ? sekolah.id : '',
        nomor_induk_nasional: String(siswa[3]),
        nomor_induk_sekolah: String(siswa[4]),
        tanggal_lahir: new Date(siswa[5]),
        alamat: (siswa[6] || '').trim(),
        jenis_kelamin: siswa[7].toUpperCase(),
        no_ponsel: siswa[8].trim(),
        tahun_angkatan: String(siswa[9]),
        tingkat: sekolah?.tingkat,
      }

      // TODO: allowInsert
      // TODO: Upsert by nomor_induk_nasional
      if (!sekolah) {
        uploadMessage = 'GAGAL UPLOAD: NPSN Sekolah tidak terdaftar'
      } else {
        createMany.push(newSiswa)
      }

      output.push({
        ...newSiswa,
        npsn: npsnSekolah,
        hasil_upload: uploadMessage,
      })
    }

    await prisma.siswa.createMany({
      data: createMany,
    })

    const workbook = await excelUtils.writeExcel(
      '/templates/template-siswa.xlsx',
      output,
      constants.SISWA,
      true,
    )

    await excelUtils
      .sendWorkBookAsResponse(res, { workbook, fileName: 'list-upload-siswa.xlsx' })
  },
  findSiswaBySekolahId: async (req, res) => {
    const siswas = await prisma.siswa.findMany({
      where: { sekolah_id: req.params.id }
    })

    return res.status(200).json(siswas)
  }
}

router.get('/download-template', utils.errorWrapper(siswaController.downloadSiswaTemplate))
router.get('/', utils.errorWrapper(siswaController.findListByUserAccess))
router.get('/sekolah/:id', utils.errorWrapper(siswaController.findSiswaBySekolahId))
router.get('/:id', utils.errorWrapper(siswaController.findOne))
router.post('/', utils.errorWrapper(siswaController.create))
router.post('/upload', multipart.single('file'), uploadValidation, utils.errorWrapper(siswaController.upload))

export default {
  path: '/siswa',
  handler: router,
}
