/*
  Warnings:

  - You are about to drop the column `base_route` on the `requests` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `requests_base_route_idx` ON `requests`;

-- AlterTable
ALTER TABLE `requests` DROP COLUMN `base_route`;
