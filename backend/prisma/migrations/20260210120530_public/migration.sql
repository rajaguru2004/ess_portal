/*
  Warnings:

  - A unique constraint covering the columns `[userId,date,shiftId]` on the table `ShiftAssignment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ShiftAssignment_userId_date_key";

-- CreateIndex
CREATE UNIQUE INDEX "ShiftAssignment_userId_date_shiftId_key" ON "ShiftAssignment"("userId", "date", "shiftId");
