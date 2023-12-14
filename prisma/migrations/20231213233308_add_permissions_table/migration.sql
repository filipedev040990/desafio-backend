/*
  Warnings:

  - A unique constraint covering the columns `[route]` on the table `permissions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `permissions_permissionCode_key` ON `permissions`;

-- CreateIndex
CREATE UNIQUE INDEX `permissions_route_key` ON `permissions`(`route`);
