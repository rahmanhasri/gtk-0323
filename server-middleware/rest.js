/* eslint-disable no-console */
import express from 'express'
import morganBody from 'morgan-body'
import * as dotenv from 'dotenv'
import * as constant from './common/constant.js'
import * as utils from './common/utils.js'


// routes
import userRoutes from './controller/user.controller.js'
import sekolahRoutes from './controller/sekolah.controller.js'

dotenv.config()
const app = express()
// Body parser, to access `req.body`
app.use(express.json())

const isProd = process.env.NODE_ENV === constant.PRODUCTION
if (!isProd) {
  morganBody(app, { noColors: true, prettify: false })
}

app.use(userRoutes.path, userRoutes.handler)
app.use(sekolahRoutes.path, utils.authMiddleware, sekolahRoutes.handler)

export default app