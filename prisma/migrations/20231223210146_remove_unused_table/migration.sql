/*
  Warnings:

  - You are about to drop the `seeders_data` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `seeders_histories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `seeders_data` DROP FOREIGN KEY `seeders_data_seedersHistoryId_fkey`;

-- DropTable
DROP TABLE `seeders_data`;

-- DropTable
DROP TABLE `seeders_histories`;

-- CreateTable
CREATE TABLE `executed_seeders` (
    `id` VARCHAR(191) NOT NULL,
    `table` VARCHAR(191) NOT NULL,
    `hash` VARCHAR(191) NOT NULL,
    `executedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
