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
  'is_active',
]

const actionSiswa = {
  findListByUserAccess: async (req) => {
    const { user } = req
    const query = utils.addQuerySekolahByUserAccess(
      utils.pick(req.query, ['nama', 'tingkat', 'nomor_induk_nasional', 'sekolah_id', 'tahun_angkatan']),
      user,
    )

    const querySiswa = []
    const querySekolahUserAccess = {}
    if (query.nama) {
      querySiswa.push({ nama: { contains: query.nama, mode: 'insensitive' }})
    }
    if (query.nomor_induk_nasional) {
      querySiswa.push({ nomor_induk_nasional: { contains: query.nomor_induk_nasional }})
    }
    if (query.tingkat) {
      querySekolahUserAccess.tingkat = query.tingkat
    }
    if (Object.hasOwn(query, 'is_madrasah')) {
      querySekolahUserAccess.is_madrasah = query.is_madrasah
    }

    const whereCondition = { sekolah: querySekolahUserAccess, AND: [{ deleted: false }] }

    if (querySiswa.length) {
      whereCondition.OR = querySiswa
    }

    if (query.sekolah_id) {
      whereCondition.AND = whereCondition.AND.concat([{ sekolah_id: query.sekolah_id }])
    }

    if (query.tahun_angkatan) {
      whereCondition.AND = whereCondition.AND.concat([{ tahun_angkatan: query.tahun_angkatan }])
    }
    const result = await prisma.siswa.findMany({
      ...utils.prismaPagination(req.query.page, req.query.limit),
      where: whereCondition,
      select: {
        ...utils.reduceStringArrayToObjValue(
          [
            'id', 'nama', 'nomor_induk_nasional', 'nomor_induk_sekolah', 'tingkat',
            'jenis_kelamin', 'tahun_angkatan', 'is_active', 'alamat', 'no_ponsel',
          ],
          true,
        ),
        sekolah: {
          select: utils.reduceStringArrayToObjValue(['id', 'nama', 'npsn'], true),
        }
      },
      orderBy: [{ created_at: 'desc' }],
    })

    return result
  }
}

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
    const result = await actionSiswa.findListByUserAccess(req)
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
  update: async (req, res) => {
    const { id, ...reqBody } = req.body
    const siswaReq = utils.pick(reqBody, siswaReqDto)
    if (!id) {
      return res.status(400).send('id is required')
    }

    await prisma.siswa.update({
      where: { id },
      data: siswaReq,
    })

    return res.json({ message: 'ok' })
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

      // TODO: Upsert by nomor_induk_nasional
      if (!sekolah) {
        uploadMessage = 'GAGAL UPLOAD: NPSN Sekolah tidak terdaftar'
      } else if(!utils.validateUploadSekolah(
        req.user,
        { tingkat: sekolah?.tingkat, is_madrasah: sekolah?.is_madrasah },
      )) {
        uploadMessage = 'Akses tidak diizinkan'
      } else {
        let existingSiswa = null
        if (newSiswa.nomor_induk_nasional) {
          existingSiswa = await prisma.siswa.findFirst({
            where: {
              nomor_induk_nasional: newSiswa.nomor_induk_nasional,
            }
          })
        }

        if (existingSiswa) {
          uploadMessage = 'Data Siswa dengan nomor induk nasional sama diperbaharui'
          await prisma.siswa.updateMany({
            where: { nomor_induk_nasional: newSiswa.nomor_induk_nasional },
            data: newSiswa
          })
        } else {
          newSiswa.id = uuid.v4()
          createMany.push(newSiswa)
        }
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
  downloadlistByUserAccess: async (req, res) => {
    const list = await actionSiswa.findListByUserAccess(req)
    const workbook = await excelUtils.writeExcel(
      '/templates/template-siswa.xlsx',
      list,
      constants.SISWA,
    )

    await excelUtils
      .sendWorkBookAsResponse(res, { workbook, fileName: 'list-siswa.xlsx' })
  },
  delete: async (req, res) => {
    await prisma.siswa.delete({
      where: { id: req.params.id },
    })

    return res.json({ message: 'ok' })
  }
}

router.get('/download-template', utils.errorWrapper(siswaController.downloadSiswaTemplate))
router.get('/download-list', utils.errorWrapper(siswaController.downloadlistByUserAccess))
router.get('/', utils.errorWrapper(siswaController.findListByUserAccess))
router.get('/:id', utils.errorWrapper(siswaController.findOne))
router.put('/', utils.errorWrapper(siswaController.update))
router.post('/', utils.errorWrapper(siswaController.create))
router.post('/upload', multipart.single('file'), uploadValidation, utils.errorWrapper(siswaController.upload))
router.delete('/:id', utils.errorWrapper(siswaController.delete))

export default {
  path: '/siswa',
  handler: router,
}
