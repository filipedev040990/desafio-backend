/*
  Warnings:

  - A unique constraint covering the columns `[permissionCode]` on the table `permissions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `permissions_permissionCode_key` ON `permissions`(`permissionCode`);
