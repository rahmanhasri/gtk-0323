import express from 'express'
import bcrypt from 'bcrypt'
import { prisma } from '../db.js';
import * as utils from '../common/utils.js'

const router = express.Router()

const userController = {
  all: async (_req, res) => {
    return res.json(await prisma.user.findMany())
  },
  authentication: async (req, res) => {
    const { username, password } = req.body
    const errMessage = {
      message: 'User / Password salah'
    }

    if (!username || !password) {
      return res.status(400).json(errMessage)
    }
    const user = await prisma.user.findFirst({ where: { username } })
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
