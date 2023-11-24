-- DropForeignKey
ALTER TABLE `requests` DROP FOREIGN KEY `requests_userId_fkey`;

-- AlterTable
ALTER TABLE `requests` MODIFY `userId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `requests` ADD CONSTRAINT `requests_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
