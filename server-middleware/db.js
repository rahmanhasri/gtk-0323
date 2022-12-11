import { PrismaClient } from '@prisma/client'

// eslint-disable-next-line import/no-mutable-exports
let prisma

const prismaUseMiddleware = prisma => {
  prisma.$use((params, next) => {
    // Check incoming query type
    if ([
      'TenagaPendidikanGuru',
      'Siswa',
      'SaranaPrasarana',
      'Inventaris',
    ].includes(params.model)) {
      if (params.action === 'findFirst') {
        params.args.where.deleted = false
      } else if (params.action === 'delete') {
        params.action = 'update'
        params.args.data = { deleted: true }
      } else if (params.action === 'deleteMany') {
        params.action = 'updateMany'
        if (params.args.data !== undefined) {
          params.args.data.deleted = true
        } else {
          params.args.data = { deleted: true }
        }
      }
    }
    return next(params)
  })
}

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
  prismaUseMiddleware(prisma)
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient()
    prismaUseMiddleware(global.prisma)
  }
  prisma = global.prisma
}


export default prisma
