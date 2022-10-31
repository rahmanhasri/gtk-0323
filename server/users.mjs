// const express = require('express')
// const { PrismaClient } = require('@prisma/client')

import express from 'express'
import { PrismaClient } from '@prisma/client'

const router = express.Router()

const prisma = new PrismaClient()

router.get('/all', async (_req, res) => {
  res.json(await prisma.user.findMany())
})

export default router
