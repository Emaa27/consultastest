-- AlterTable
ALTER TABLE `consultas` MODIFY `enfermedad_actual` TEXT NULL;

-- AlterTable
ALTER TABLE `historias_clinicas` ADD COLUMN `medico_cabecera_id` INTEGER NULL,
    ADD COLUMN `sexo` VARCHAR(20) NULL;

-- AddForeignKey
ALTER TABLE `historias_clinicas` ADD CONSTRAINT `historias_clinicas_medico_cabecera_id_fkey` FOREIGN KEY (`medico_cabecera_id`) REFERENCES `profesionales`(`profesional_id`) ON DELETE SET NULL ON UPDATE CASCADE;
