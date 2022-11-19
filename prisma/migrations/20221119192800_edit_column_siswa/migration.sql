/*
  Warnings:

  - You are about to drop the column `nomor_induk` on the `Siswa` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Siswa" DROP COLUMN "nomor_induk",
ADD COLUMN     "nomor_induk_nasional" VARCHAR(32),
ADD COLUMN     "nomor_induk_sekolah" VARCHAR(32),
ADD COLUMN     "tahun_angkatan" VARCHAR(4),
ALTER COLUMN "tingkat" DROP NOT NULL,
ALTER COLUMN "tahun_ajaran" DROP NOT NULL;
