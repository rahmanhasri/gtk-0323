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
  if (process.env.NODE_ENV !== 'production') {
    await prisma.sekolah.createMany({
      data: [{
        id: "018daeac-7803-492a-91ab-e16592c3a238",
        kecamatan: "test",
        kelurahan_atau_desa: "lurah atau desa",
        nama: "lembaga",
        is_madrasah: false,
        tingkat: "SMP",
        profil: "sekolah description",
        jenis: "swasta",
        koordinat: ["1", "1"],
        created_at: "2022-11-01T18:28:02.178Z",
        updated_at: "2022-11-01T18:28:30.579Z"
      }]
    })
  }
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