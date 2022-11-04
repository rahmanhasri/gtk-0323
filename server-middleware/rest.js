/* eslint-disable no-console */
import express from 'express'
import morganBody from 'morgan-body'
import * as dotenv from 'dotenv'
import * as constant from './common/constant.js'
import * as utils from './common/utils.js'


// routes
import userRoutes from './controller/user.controller.js'
import lembagaRoutes from './controller/lembaga.controller.js'

dotenv.config()
const app = express()
// Body parser, to access `req.body`
app.use(express.json())

const isProd = process.env.NODE_ENV === constant.PRODUCTION
if (!isProd) {
  morganBody(app, { noColors: true, prettify: false })
}

app.use(userRoutes.path, userRoutes.handler)
app.use(lembagaRoutes.path, utils.authMiddleware, lembagaRoutes.handler)

export default app