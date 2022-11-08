import express from 'express'
import * as uuid from 'uuid'
import * as utils from '../common/utils.js'
import { prisma } from '../db.js'
// import * as allConstant from '../../utils/constants';

const router = express.Router()


const sekolahReqDto = [
  "id",
  "kecamatan",
  "kelurahan_atau_desa",
  "nama",
  "is_madrasah",
  "tingkat",
  "profil",
  "jenis",
  "koor",
  "additional_info"
]

const sekolahController = {
  findOne: async (req, res) => {
    // TODO: populate siswa, guru, sarana dan prasaran
    return res.json(
      await prisma.sekolah.findFirst({ where: { id: req.params.id }})
    )
  },
  create: async (req, res) => {
    const sekolahReq = utils.pick(req.body, sekolahReqDto)
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
    const query = utils.pick(req.query, ['nama', 'tingkat', 'kecamatan', 'desa'])
    if (user.level === 'operator') {
      if (user.scope === 'dinasprov') {
        query.tingkat = 'SMA'
      } else if (user.scope === 'kemenag') {
        query.is_madrasah = true
      } else if (user.scope === 'pendidikan') {
        query.is_madrasah = false
      }
    }

    const listSekolah = await prisma.sekolah.findMany({
      ...utils.prismaPagination(req.query.page, req.query.limit),
      where: {
        ...query,
        nama: {
          contains: query.nama,
        },
      },
    })
    return res.json(listSekolah)
  },
  // listKecamatan: async (req, res) => {
  //   return res.json(
  //     await prisma.sekolah.findMany({
  //       where: {},
  //       distinct: ['kecamatan'],
  //     })
  //   )
  // },
  // listKelurahanOrDesa: async (_req, res) => {
  //   const list = await prisma.sekolah.findMany({
  //     select: {
  //       'kelurahan_atau_desa': true,
  //     },
  //     where: {},
  //     distinct: ['kelurahan_atau_desa'],
  //   })
  //   return res.json((list || []).map(d => d.kelurahan_atau_desa))
  // }
}

router.post('/', utils.errorWrapper(sekolahController.create))
router.put('/', utils.errorWrapper(sekolahController.update))
// router.get('/kelurahan-desa', utils.errorWrapper(sekolahController.listKelurahanOrDesa))
router.get('/', utils.errorWrapper(sekolahController.findListByUserAccess))
router.get('/:id', utils.errorWrapper(sekolahController.findOne))
// router.get('/kecamatan', utils.errorWrapper(sekolahController.listKecamatan))

export default {
  path: '/sekolah',
  handler: router,
}
