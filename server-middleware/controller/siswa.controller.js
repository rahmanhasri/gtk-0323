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
  },
  downloadSiswaTemplate: (_req, res) => {
    res.sendFile(utils.pathResolve('/templates/template-siswa.xlsx'), (err) => {
      if (err) {
        console.error(err)
        return res.status(500).send('Error saat mengambil template')
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

      console.log(siswa)
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
        alamat: String(siswa[6]),
        jenis_kelamin: siswa[7].toUpperCase(),
        no_ponsel: siswa[8].trim(),
        tahun_angkatan: String(siswa[9]),
      }

      // TODO: allowInsert
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
    // return res.status(201).json(output)
  },
}

router.get('/:id', utils.errorWrapper(siswaController.findOne))
router.post('/', utils.errorWrapper(siswaController.create))
router.post('/upload', multipart.single('file'), uploadValidation, utils.errorWrapper(siswaController.upload))

export default {
  path: '/siswa',
  handler: router,
}
