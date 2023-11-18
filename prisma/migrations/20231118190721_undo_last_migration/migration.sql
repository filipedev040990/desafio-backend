/*
  Warnings:

  - Made the column `input` on table `requests` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `requests` MODIFY `input` LONGTEXT NOT NULL;
