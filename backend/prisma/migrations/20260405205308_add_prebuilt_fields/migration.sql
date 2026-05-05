-- AlterTable
ALTER TABLE "configuraciones" ADD COLUMN     "categoria" TEXT,
ADD COLUMN     "descripcion" TEXT,
ADD COLUMN     "destacada" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "esPrearmada" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "imagenUrl" TEXT;
