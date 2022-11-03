/* eslint-disable no-console */
// import { Nuxt, Builder } from 'nuxt'
import express from 'express'
import morganBody from 'morgan-body'
import * as dotenv from 'dotenv'
import * as constant from './constant.mjs'
import * as utils from './utils.mjs'


// routes
import userRoutes from './user.controller.mjs'
import lembagaRoutes from './lembaga.controller.mjs'

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