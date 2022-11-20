/* eslint-disable no-console */
import express from 'express'
import morganBody from 'morgan-body'
import * as dotenv from 'dotenv'
import * as constant from './common/constant.js'
import * as utils from './common/utils.js'


// routes
import userRoutes from './controller/user.controller.js'
import sekolahRoutes from './controller/sekolah.controller.js'
import dataRoutes from './controller/data.controller.js'
import siswaRoutes from './controller/siswa.controller.js'
// import tenagaDanGuruRoutes from './controller/tenaga-guru.controller.js'

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
app.use(dataRoutes.path, utils.authMiddleware, dataRoutes.handler)
app.use(siswaRoutes.path, utils.authMiddleware, siswaRoutes.handler)

export default app
