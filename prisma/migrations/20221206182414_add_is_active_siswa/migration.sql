/*
  Warnings:

  - You are about to drop the column `tingkat_kerusakan` on the `SaranaPrasarana` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Inventaris" ALTER COLUMN "kondisi" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SaranaPrasarana" DROP COLUMN "tingkat_kerusakan",
ADD COLUMN     "kondisi" TEXT;

-- AlterTable
ALTER TABLE "Siswa" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;
