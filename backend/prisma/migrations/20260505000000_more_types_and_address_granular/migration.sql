-- ============================================
-- Agregar nuevos tipos de componentes (periféricos extra)
-- al enum TipoComponente.
-- ============================================
ALTER TYPE "TipoComponente" ADD VALUE IF NOT EXISTS 'SILLA';
ALTER TYPE "TipoComponente" ADD VALUE IF NOT EXISTS 'MOUSEPAD';
ALTER TYPE "TipoComponente" ADD VALUE IF NOT EXISTS 'WEBCAM';
ALTER TYPE "TipoComponente" ADD VALUE IF NOT EXISTS 'MICROFONO';
ALTER TYPE "TipoComponente" ADD VALUE IF NOT EXISTS 'BOCINAS';

-- ============================================
-- Crear el enum TipoVivienda para la dirección de envío.
-- ============================================
DO $$ BEGIN
    CREATE TYPE "TipoVivienda" AS ENUM ('CASA', 'DEPARTAMENTO', 'OFICINA', 'OTRO');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- Desglosar aún más la dirección de envío.
-- Se mantiene "nombreDestinatario" por retrocompatibilidad
-- con pedidos viejos; los nuevos llenan los campos desglosados.
-- ============================================
ALTER TABLE "pedidos" ADD COLUMN IF NOT EXISTS "nombreDestinatarioPila" TEXT;
ALTER TABLE "pedidos" ADD COLUMN IF NOT EXISTS "apellidoPaterno"        TEXT;
ALTER TABLE "pedidos" ADD COLUMN IF NOT EXISTS "apellidoMaterno"        TEXT;
ALTER TABLE "pedidos" ADD COLUMN IF NOT EXISTS "telefonoAlternativo"    TEXT;
ALTER TABLE "pedidos" ADD COLUMN IF NOT EXISTS "entreCalles"            TEXT;
ALTER TABLE "pedidos" ADD COLUMN IF NOT EXISTS "alcaldiaMunicipio"      TEXT;
ALTER TABLE "pedidos" ADD COLUMN IF NOT EXISTS "tipoVivienda"           "TipoVivienda";
