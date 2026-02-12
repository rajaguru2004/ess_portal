-- AlterTable
ALTER TABLE "LeaveApplication" ADD COLUMN     "currentApproverId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isHeadManager" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
