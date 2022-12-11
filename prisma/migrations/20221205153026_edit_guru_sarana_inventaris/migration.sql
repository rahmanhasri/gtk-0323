-- AlterTable
ALTER TABLE "SaranaPrasarana" ADD COLUMN     "daftar_foto_url" TEXT[];

-- AlterTable
ALTER TABLE "TenagaPendidikanGuru" ADD COLUMN     "jenjang" VARCHAR(32) NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "Inventaris" (
    "id" UUID NOT NULL,
    "nama" TEXT NOT NULL,
    "kode_inventaris" TEXT NOT NULL,
    "kondisi" VARCHAR(32) NOT NULL,
    "daftar_foto_url" TEXT[],
    "sarana_prasarana_id" UUID NOT NULL,

    CONSTRAINT "Inventaris_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Inventaris" ADD CONSTRAINT "Inventaris_sarana_prasarana_id_fkey" FOREIGN KEY ("sarana_prasarana_id") REFERENCES "SaranaPrasarana"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
