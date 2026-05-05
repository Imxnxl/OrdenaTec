-- ============================================
-- Agregar tipos de periféricos al enum TipoComponente
-- ============================================
ALTER TYPE "TipoComponente" ADD VALUE IF NOT EXISTS 'MONITOR';
ALTER TYPE "TipoComponente" ADD VALUE IF NOT EXISTS 'TECLADO';
ALTER TYPE "TipoComponente" ADD VALUE IF NOT EXISTS 'MOUSE';
ALTER TYPE "TipoComponente" ADD VALUE IF NOT EXISTS 'AUDIFONOS';

-- ============================================
-- Desglosar la dirección de envío en columnas estructuradas
-- ============================================
ALTER TABLE "pedidos" ADD COLUMN "nombreDestinatario" TEXT;
ALTER TABLE "pedidos" ADD COLUMN "telefonoContacto"   TEXT;
ALTER TABLE "pedidos" ADD COLUMN "calle"              TEXT;
ALTER TABLE "pedidos" ADD COLUMN "numeroExterior"     TEXT;
ALTER TABLE "pedidos" ADD COLUMN "numeroInterior"     TEXT;
ALTER TABLE "pedidos" ADD COLUMN "colonia"            TEXT;
ALTER TABLE "pedidos" ADD COLUMN "ciudad"             TEXT;
ALTER TABLE "pedidos" ADD COLUMN "estadoEnvio"        TEXT;
ALTER TABLE "pedidos" ADD COLUMN "codigoPostal"       TEXT;
ALTER TABLE "pedidos" ADD COLUMN "pais"               TEXT;
ALTER TABLE "pedidos" ADD COLUMN "referenciasEnvio"   TEXT;

-- Los pedidos antiguos con la columna monolítica "direccionEnvio"
-- se migran copiando el valor a "calle" como fallback legible.
UPDATE "pedidos" SET "calle" = "direccionEnvio" WHERE "direccionEnvio" IS NOT NULL;

ALTER TABLE "pedidos" DROP COLUMN "direccionEnvio";
