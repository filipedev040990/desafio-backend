-- AlterTable
ALTER TABLE `users` MODIFY `active` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `seeders_data` (
    `id` VARCHAR(191) NOT NULL,
    `table` VARCHAR(191) NOT NULL,
    `generatedId` VARCHAR(191) NOT NULL,
    `executedAt` DATETIME(3) NOT NULL,
    `seedersHistoryId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `seeders_data` ADD CONSTRAINT `seeders_data_seedersHistoryId_fkey` FOREIGN KEY (`seedersHistoryId`) REFERENCES `seeders_histories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
