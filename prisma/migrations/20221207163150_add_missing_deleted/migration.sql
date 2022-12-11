-- AlterTable
ALTER TABLE "Inventaris" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "SaranaPrasarana" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;
