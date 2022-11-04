import express from 'express'
import { PrismaClient } from '@prisma/client'
import * as uuid from 'uuid'
import * as utils from '../common/utils.js'

const router = express.Router()

const prisma = new PrismaClient()

const lembagaReqDto = [
  "id",
  "kecamatan",
  "desa",
  "nama",
  "is_madrasah",
  "tingkat",
  "profil",
  "jenis",
  "additional_info"
]

const lembagaController = {
  findOne: async (req, res) => {
    return res.json(
      await prisma.lembaga.findFirst({ where: { id: req.params.id }})
    )
  },
  create: async (req, res) => {
    const lembagaReq = utils.pick(req.body, lembagaReqDto)
    lembagaReq.id = uuid.v4()
    const lembaga = await prisma.lembaga.create({ data: lembagaReq })
    return res.status(201).json(lembaga)
  },
  update: async (req, res) => {
    const { id, ...reqBody } = req.body
    const lembagaReq = utils.pick(reqBody, lembagaReqDto)
    if (!id) {
      return res.status(400).send('id is required')
    }
    await prisma.lembaga.update({
      where: { id },
      data: lembagaReq,
    })
  }
}

router.post('/', utils.errorWrapper(lembagaController.create))
router.put('/', utils.errorWrapper(lembagaController.update))
router.get('/:id', utils.errorWrapper(lembagaController.findOne))

export default {
  path: '/lembaga',
  handler: router,
}