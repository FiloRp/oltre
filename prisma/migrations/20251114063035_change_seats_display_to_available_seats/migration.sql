/*
  Warnings:

  - You are about to drop the column `seatsDisplay` on the `Departure` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Departure" DROP COLUMN "seatsDisplay",
ADD COLUMN     "availableSeats" INTEGER;
