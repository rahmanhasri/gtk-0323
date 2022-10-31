-- CreateTable
CREATE TABLE "Lembaga" (
    "id" UUID NOT NULL,
    "kecamatan" TEXT NOT NULL,
    "desa" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "is_madrasah" TEXT NOT NULL,
    "tingkat" TEXT NOT NULL,
    "profil" TEXT,
    "jenis" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lembaga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Siswa" (
    "id" UUID NOT NULL,
    "nama" TEXT NOT NULL DEFAULT '',
    "lembaga_id" UUID NOT NULL,
    "nomor_induk" TEXT,
    "kelas" INTEGER,
    "tanggal_lahir" TIMESTAMP(3),
    "alamat" TEXT,
    "no_ponsel" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tahun_ajaran" TEXT NOT NULL,
    "jenis_kelamin" TEXT NOT NULL,
    "is_delete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Siswa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guru" (
    "id" UUID NOT NULL,
    "nama" TEXT NOT NULL DEFAULT '',
    "no_ktp" TEXT NOT NULL,
    "alamat" TEXT,
    "no_ponsel" TEXT,
    "ptk" TEXT,
    "jenis_kelamin" TEXT NOT NULL,
    "lembaga_id" UUID NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_delete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Guru_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenagaKependidikan" (
    "id" UUID NOT NULL,
    "nama" TEXT NOT NULL,
    "jabatan" TEXT NOT NULL,
    "lembaga_id" UUID NOT NULL,

    CONSTRAINT "TenagaKependidikan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaranaPrasarana" (
    "id" UUID NOT NULL,
    "nama" TEXT NOT NULL,
    "jumlah" INTEGER,
    "jenis" TEXT NOT NULL,
    "tingkat_kelayakan" INTEGER NOT NULL,
    "lembaga_id" UUID NOT NULL,

    CONSTRAINT "SaranaPrasarana_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "scope" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Siswa" ADD CONSTRAINT "Siswa_lembaga_id_fkey" FOREIGN KEY ("lembaga_id") REFERENCES "Lembaga"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guru" ADD CONSTRAINT "Guru_lembaga_id_fkey" FOREIGN KEY ("lembaga_id") REFERENCES "Lembaga"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenagaKependidikan" ADD CONSTRAINT "TenagaKependidikan_lembaga_id_fkey" FOREIGN KEY ("lembaga_id") REFERENCES "Lembaga"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaranaPrasarana" ADD CONSTRAINT "SaranaPrasarana_lembaga_id_fkey" FOREIGN KEY ("lembaga_id") REFERENCES "Lembaga"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
