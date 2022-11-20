const { PrismaClient } = require('@prisma/client')
const { faker } = require('@faker-js/faker')

const prisma = new PrismaClient()

const generateFakerSekolah = async (count) => {
  const constants = await import('../utils/constants.mjs')
  const output = []
  const npsnSet = new Set()
  for (let i = 0; i < count; i++) {
    const kecamatan = faker.helpers.arrayElement(constants.LIST_KECAMATAN)
    const tingkat = faker.helpers.arrayElement(['TK', 'SD', 'PAUD', 'SMP', 'SMA', 'SMK'])
    let npsn = faker.random.numeric(8)
    while (npsnSet.has(npsn)) {
      npsn = faker.random.numeric(8)
    }
    output.push({
      id: faker.datatype.uuid(),
      kecamatan,
      kelurahan_atau_desa: faker.helpers.arrayElement(constants.LIST_DESA_BY_KECAMATAN[kecamatan]),
      nama: `${tingkat} ${faker.commerce.productName()}`,
      is_madrasah: faker.helpers.arrayElement([true, false]),
      tingkat,
      profil: faker.address.street(),
      jenis: faker.helpers.arrayElement(['swasta', 'negeri']),
      npsn,
      koordinat: constants.LIST_KOOR_KECAMATAN[kecamatan],
    })
  }
  return output
}

async function seed() {
  await prisma.sekolah.createMany({
    data: await generateFakerSekolah(100),
  })
  await prisma.$disconnect()
}

seed()
