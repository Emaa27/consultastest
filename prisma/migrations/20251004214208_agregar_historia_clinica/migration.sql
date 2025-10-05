/*
  Warnings:

  - The primary key for the `pacientes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `creacion` on the `pacientes` table. All the data in the column will be lost.
  - You are about to drop the column `dni` on the `pacientes` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `pacientes` table. All the data in the column will be lost.
  - You are about to alter the column `nombre` on the `pacientes` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(120)`.
  - You are about to alter the column `apellido` on the `pacientes` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(120)`.
  - You are about to alter the column `email` on the `pacientes` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(120)`.
  - You are about to alter the column `telefono` on the `pacientes` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(40)`.
  - The primary key for the `profesionales` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `apellido` on the `profesionales` table. All the data in the column will be lost.
  - You are about to drop the column `creacion` on the `profesionales` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `profesionales` table. All the data in the column will be lost.
  - You are about to drop the column `nombre` on the `profesionales` table. All the data in the column will be lost.
  - You are about to drop the column `profesion` on the `profesionales` table. All the data in the column will be lost.
  - You are about to drop the column `telefono` on the `profesionales` table. All the data in the column will be lost.
  - The primary key for the `turnos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `creacion` on the `turnos` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `turnos` table. All the data in the column will be lost.
  - You are about to alter the column `inicio` on the `turnos` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(0)`.
  - You are about to alter the column `fin` on the `turnos` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(0)`.
  - A unique constraint covering the columns `[documento]` on the table `pacientes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[usuario_id]` on the table `profesionales` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `paciente_id` to the `pacientes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profesion_id` to the `profesionales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profesional_id` to the `profesionales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuario_id` to the `profesionales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duracion_min` to the `turnos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `turno_id` to the `turnos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `turnos` DROP FOREIGN KEY `FK_turnos_pacientes`;

-- DropForeignKey
ALTER TABLE `turnos` DROP FOREIGN KEY `FK_turnos_profesionales`;

-- DropIndex
DROP INDEX `pacientes_dni_key` ON `pacientes`;

-- DropIndex
DROP INDEX `pacientes_telefono_key` ON `pacientes`;

-- DropIndex
DROP INDEX `FK_turnos_pacientes` ON `turnos`;

-- DropIndex
DROP INDEX `FK_turnos_profesionales` ON `turnos`;

-- AlterTable
ALTER TABLE `pacientes` DROP PRIMARY KEY,
    DROP COLUMN `creacion`,
    DROP COLUMN `dni`,
    DROP COLUMN `id`,
    ADD COLUMN `documento` VARCHAR(40) NULL,
    ADD COLUMN `estado` ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo',
    ADD COLUMN `fecha_nacimiento` DATE NULL,
    ADD COLUMN `fecha_registro` DATETIME(0) NULL,
    ADD COLUMN `genero` ENUM('Mujer', 'Hombre', 'otro') NULL,
    ADD COLUMN `obra_social_id` INTEGER NULL,
    ADD COLUMN `paciente_id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `nombre` VARCHAR(120) NOT NULL,
    MODIFY `apellido` VARCHAR(120) NOT NULL,
    MODIFY `email` VARCHAR(120) NULL,
    MODIFY `telefono` VARCHAR(40) NULL,
    ADD PRIMARY KEY (`paciente_id`);

-- AlterTable
ALTER TABLE `profesionales` DROP PRIMARY KEY,
    DROP COLUMN `apellido`,
    DROP COLUMN `creacion`,
    DROP COLUMN `id`,
    DROP COLUMN `nombre`,
    DROP COLUMN `profesion`,
    DROP COLUMN `telefono`,
    ADD COLUMN `estado` ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo',
    ADD COLUMN `matricula` VARCHAR(60) NULL,
    ADD COLUMN `profesion_id` INTEGER NOT NULL,
    ADD COLUMN `profesional_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `usuario_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`profesional_id`);

-- AlterTable
ALTER TABLE `turnos` DROP PRIMARY KEY,
    DROP COLUMN `creacion`,
    DROP COLUMN `id`,
    ADD COLUMN `duracion_min` SMALLINT NOT NULL,
    ADD COLUMN `estado` ENUM('reservado', 'confirmado', 'cancelado', 'no_show', 'atendido') NOT NULL DEFAULT 'reservado',
    ADD COLUMN `obra_social_id` INTEGER NULL,
    ADD COLUMN `turno_id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `inicio` DATETIME(0) NOT NULL,
    MODIFY `fin` DATETIME(0) NULL,
    ADD PRIMARY KEY (`turno_id`);

-- CreateTable
CREATE TABLE `agenda_semanal` (
    `agenda_id` INTEGER NOT NULL AUTO_INCREMENT,
    `profesional_id` INTEGER NOT NULL,
    `dia_semana` TINYINT NOT NULL,
    `hora_inicio` TIME(0) NOT NULL,
    `hora_fin` TIME(0) NOT NULL,
    `slot_min` SMALLINT NOT NULL,
    `estado` ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo',

    UNIQUE INDEX `uq_agenda`(`profesional_id`, `dia_semana`, `hora_inicio`, `hora_fin`),
    PRIMARY KEY (`agenda_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `obras_sociales` (
    `obra_social_id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(120) NOT NULL,
    `estado` ENUM('activa', 'inactiva') NOT NULL DEFAULT 'activa',

    UNIQUE INDEX `nombre`(`nombre`),
    PRIMARY KEY (`obra_social_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profesiones` (
    `profesion_id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(80) NOT NULL,

    UNIQUE INDEX `nombre`(`nombre`),
    PRIMARY KEY (`profesion_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `rol_id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(40) NOT NULL,

    UNIQUE INDEX `nombre`(`nombre`),
    PRIMARY KEY (`rol_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios` (
    `usuario_id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(120) NOT NULL,
    `apellido` VARCHAR(120) NOT NULL,
    `email` VARCHAR(120) NULL,
    `contrasena` VARCHAR(100) NOT NULL,
    `telefono` VARCHAR(40) NULL,
    `rol_id` INTEGER NOT NULL,
    `estado` ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo',

    UNIQUE INDEX `email`(`email`),
    INDEX `fk_usuarios_rol`(`rol_id`),
    PRIMARY KEY (`usuario_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `historias_clinicas` (
    `historia_id` INTEGER NOT NULL AUTO_INCREMENT,
    `paciente_id` INTEGER NOT NULL,
    `grupo_sanguineo` VARCHAR(5) NULL,
    `estado_civil` VARCHAR(50) NULL,
    `ocupacion` VARCHAR(120) NULL,
    `enfermedades_infancia` TEXT NULL,
    `enfermedades_cronicas` TEXT NULL,
    `cirugias` TEXT NULL,
    `alergias` TEXT NULL,
    `hospitalizaciones` TEXT NULL,
    `traumatismos` TEXT NULL,
    `medicamentos_actuales` TEXT NULL,
    `consume_tabaco` BOOLEAN NOT NULL DEFAULT false,
    `consume_alcohol` BOOLEAN NOT NULL DEFAULT false,
    `otras_sustancias` VARCHAR(255) NULL,
    `dieta_ok` BOOLEAN NOT NULL DEFAULT false,
    `actividad_fisica` ENUM('sedentario', 'ligera', 'moderada', 'intensa') NULL,
    `habitos_sueno` ENUM('insuficiente', 'normal', 'excesivo') NULL,

    UNIQUE INDEX `historias_clinicas_paciente_id_key`(`paciente_id`),
    PRIMARY KEY (`historia_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `consultas` (
    `consulta_id` INTEGER NOT NULL AUTO_INCREMENT,
    `historia_id` INTEGER NOT NULL,
    `profesional_id` INTEGER NOT NULL,
    `fecha_consulta` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `motivo_consulta` TEXT NOT NULL,
    `enfermedad_actual` TEXT NOT NULL,
    `pa_sistolica` INTEGER NULL,
    `pa_diastolica` INTEGER NULL,
    `frecuencia_cardiaca` INTEGER NULL,
    `frecuencia_respiratoria` INTEGER NULL,
    `temperatura` DECIMAL(4, 2) NULL,
    `peso` DECIMAL(5, 2) NULL,
    `altura` DECIMAL(3, 2) NULL,
    `imc` DECIMAL(4, 2) NULL,
    `notas_evolucion` TEXT NULL,
    `nota_referencia` TEXT NULL,
    `consentimiento_informado` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`consulta_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `diagnosticos` (
    `diagnostico_id` INTEGER NOT NULL AUTO_INCREMENT,
    `consulta_id` INTEGER NOT NULL,
    `fecha_diagnostico` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `juicio_clinico` TEXT NULL,
    `diagnostico_presuntivo` TEXT NULL,
    `diagnostico_definitivo` TEXT NULL,
    `indicacion_terapeutica` TEXT NOT NULL,
    `tratamiento_farmacologico` TEXT NULL,
    `plan_cuidados` TEXT NULL,
    `recomendaciones` TEXT NULL,
    `pronostico` VARCHAR(255) NULL,

    PRIMARY KEY (`diagnostico_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pruebas_complementarias` (
    `prueba_id` INTEGER NOT NULL AUTO_INCREMENT,
    `consulta_id` INTEGER NOT NULL,
    `tipo_prueba` ENUM('laboratorio', 'imagen', 'otro_estudio') NOT NULL DEFAULT 'laboratorio',
    `descripcion` VARCHAR(255) NOT NULL,
    `url_archivo` VARCHAR(512) NOT NULL,

    PRIMARY KEY (`prueba_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `documento` ON `pacientes`(`documento`);

-- CreateIndex
CREATE INDEX `fk_paciente_os` ON `pacientes`(`obra_social_id`);

-- CreateIndex
CREATE UNIQUE INDEX `usuario_id` ON `profesionales`(`usuario_id`);

-- CreateIndex
CREATE INDEX `ix_prof_profesion` ON `profesionales`(`profesion_id`);

-- CreateIndex
CREATE INDEX `fk_turno_os` ON `turnos`(`obra_social_id`);

-- CreateIndex
CREATE INDEX `ix_turnos_paciente` ON `turnos`(`paciente_id`, `inicio`);

-- CreateIndex
CREATE INDEX `ix_turnos_prof_inicio` ON `turnos`(`profesional_id`, `inicio`);

-- AddForeignKey
ALTER TABLE `pacientes` ADD CONSTRAINT `fk_paciente_os` FOREIGN KEY (`obra_social_id`) REFERENCES `obras_sociales`(`obra_social_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profesionales` ADD CONSTRAINT `fk_prof_profesion` FOREIGN KEY (`profesion_id`) REFERENCES `profesiones`(`profesion_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `profesionales` ADD CONSTRAINT `fk_prof_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`usuario_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `turnos` ADD CONSTRAINT `fk_turno_os` FOREIGN KEY (`obra_social_id`) REFERENCES `obras_sociales`(`obra_social_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `turnos` ADD CONSTRAINT `FK_turnos_pacientes` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes`(`paciente_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `turnos` ADD CONSTRAINT `FK_turnos_profesionales` FOREIGN KEY (`profesional_id`) REFERENCES `profesionales`(`profesional_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `agenda_semanal` ADD CONSTRAINT `fk_agenda_prof` FOREIGN KEY (`profesional_id`) REFERENCES `profesionales`(`profesional_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `fk_usuarios_rol` FOREIGN KEY (`rol_id`) REFERENCES `roles`(`rol_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `historias_clinicas` ADD CONSTRAINT `historias_clinicas_paciente_id_fkey` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes`(`paciente_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `consultas` ADD CONSTRAINT `consultas_historia_id_fkey` FOREIGN KEY (`historia_id`) REFERENCES `historias_clinicas`(`historia_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `consultas` ADD CONSTRAINT `consultas_profesional_id_fkey` FOREIGN KEY (`profesional_id`) REFERENCES `profesionales`(`profesional_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `diagnosticos` ADD CONSTRAINT `diagnosticos_consulta_id_fkey` FOREIGN KEY (`consulta_id`) REFERENCES `consultas`(`consulta_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pruebas_complementarias` ADD CONSTRAINT `pruebas_complementarias_consulta_id_fkey` FOREIGN KEY (`consulta_id`) REFERENCES `consultas`(`consulta_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `pacientes` RENAME INDEX `pacientes_email_key` TO `email`;
