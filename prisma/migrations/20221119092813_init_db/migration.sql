-- CreateTable
CREATE TABLE "Sekolah" (
    "id" UUID NOT NULL,
    "kecamatan" VARCHAR(255) NOT NULL,
    "kelurahan_atau_desa" VARCHAR(255),
    "nama" VARCHAR(255) NOT NULL,
    "is_madrasah" BOOLEAN,
    "tingkat" VARCHAR(8) NOT NULL,
    "profil" TEXT,
    "jenis" VARCHAR(8) NOT NULL,
    "npsn" VARCHAR(16) NOT NULL,
    "koordinat" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sekolah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Siswa" (
    "id" UUID NOT NULL,
    "nama" VARCHAR(255) NOT NULL DEFAULT '',
    "sekolah_id" UUID NOT NULL,
    "nomor_induk" VARCHAR(32),
    "kelas" INTEGER,
    "tanggal_lahir" TIMESTAMP(3),
    "alamat" TEXT,
    "no_ponsel" VARCHAR(24),
    "tingkat" VARCHAR(8) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tahun_ajaran" VARCHAR(16) NOT NULL,
    "jenis_kelamin" VARCHAR(8) NOT NULL,
    "is_delete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Siswa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenagaPendidikanGuru" (
    "id" UUID NOT NULL,
    "nama" VARCHAR(255) NOT NULL DEFAULT '',
    "no_ktp" VARCHAR(255) NOT NULL,
    "alamat" TEXT,
    "no_ponsel" VARCHAR(24),
    "ptk" VARCHAR(255),
    "jenis_kelamin" VARCHAR(8) NOT NULL,
    "tanggal_lahir" TIMESTAMP(3),
    "sekolah_id" UUID NOT NULL,
    "latar_belakang" TEXT NOT NULL DEFAULT '',
    "jabatan" VARCHAR(255),
    "status" VARCHAR(8),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_delete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TenagaPendidikanGuru_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaranaPrasarana" (
    "id" UUID NOT NULL,
    "nama" TEXT NOT NULL,
    "jumlah" INTEGER,
    "jenis" TEXT NOT NULL,
    "tingkat_kerusakan" INTEGER NOT NULL,
    "sekolah_id" UUID NOT NULL,
    "is_bangunan" BOOLEAN NOT NULL DEFAULT false,

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
CREATE UNIQUE INDEX "Sekolah_npsn_key" ON "Sekolah"("npsn");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Siswa" ADD CONSTRAINT "Siswa_sekolah_id_fkey" FOREIGN KEY ("sekolah_id") REFERENCES "Sekolah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenagaPendidikanGuru" ADD CONSTRAINT "TenagaPendidikanGuru_sekolah_id_fkey" FOREIGN KEY ("sekolah_id") REFERENCES "Sekolah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaranaPrasarana" ADD CONSTRAINT "SaranaPrasarana_sekolah_id_fkey" FOREIGN KEY ("sekolah_id") REFERENCES "Sekolah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
