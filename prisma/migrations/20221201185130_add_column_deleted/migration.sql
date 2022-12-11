/*
  Warnings:

  - You are about to drop the column `is_delete` on the `Siswa` table. All the data in the column will be lost.
  - You are about to drop the column `is_delete` on the `TenagaPendidikanGuru` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Siswa" DROP COLUMN "is_delete",
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "TenagaPendidikanGuru" DROP COLUMN "is_delete",
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;
