import express from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import * as utils from './utils.mjs'

const router = express.Router()

const prisma = new PrismaClient()

const userController = {
  all: async (_req, res) => {
    return res.json(await prisma.user.findMany())
  },
  authentication: async (req, res) => {
    const { username, password } = req.body
    const user = await prisma.user.findFirst({ where: { username } })
    const errMessage = {
      message: 'User / Password salah'
    }
    if (!user) {
      return res.status(400).json(errMessage)
    }

    const { password: hash, ...restUser } = user
    const match = bcrypt.compareSync(password, hash)
    if (!match) {
      return res.status(400).json(errMessage)
    }
    return res.json({
      user: restUser,
      token: utils.signJwt(restUser)
    })
  }
}

router.get('/all', utils.errorWrapper(userController.all))
router.post('/authentication', utils.errorWrapper(userController.authentication))

export default {
  path: '/users',
  handler: router
}
