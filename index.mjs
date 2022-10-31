import { Nuxt, Builder } from 'nuxt'
import express from 'express'
// const { PrismaClient } = require('@prisma/client')


// routes
// const userRoutes = require('./users')
import userRoutes from './server/users.mjs'

console.log(process.env.PORT, 'PORT')
const app = express()
// const prisma = new PrismaClient()
// Body parser, to access `req.body`
app.use(express.json())

app.use('/api/users', userRoutes)

// We instantiate Nuxt.js with the options
const isProd = process.env.NODE_ENV === 'production'
const nuxt = new Nuxt({ dev: !isProd })
// No build in production
if (!isProd) {
  const builder = new Builder(nuxt)
  builder.build()
}
app.use(nuxt.render)
app.listen(process.env.PORT || 3000)
// eslint-disable-next-line no-console
console.log('Server is listening on http://localhost:3000')
