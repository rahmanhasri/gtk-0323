const uuid = require('uuid');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client')


const prisma = new PrismaClient()

async function main() {
  const initPassword = 'admin123$'
  const hash = bcrypt.hashSync(initPassword, 10);
  await prisma.user.createMany({
    data: [{
      id: uuid.v4(),
      username: 'admin',
      password: hash,
      level: 'root',
      scope: 'all',
    }, {
      id: uuid.v4(),
      username: 'dinas_pendidikan',
      password: hash,
      level: 'operator',
      scope: 'pendidikan',
    }, {
      id: uuid.v4(),
      username: 'kementerian_agama',
      password: hash,
      level: 'operator',
      scope: 'kemenag',
    }, {
      id: uuid.v4(),
      username: 'cabang_dinas',
      password: hash,
      level: 'operator',
      scope: 'dinasprov',
    }],
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })