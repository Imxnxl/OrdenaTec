-- DropForeignKey
ALTER TABLE "configuracion_componentes" DROP CONSTRAINT "configuracion_componentes_componenteId_fkey";

-- AddForeignKey
ALTER TABLE "configuracion_componentes" ADD CONSTRAINT "configuracion_componentes_componenteId_fkey" FOREIGN KEY ("componenteId") REFERENCES "componentes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
