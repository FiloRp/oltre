-- AlterTable
ALTER TABLE "Departure" ADD COLUMN     "coordinatorId" TEXT;

-- AddForeignKey
ALTER TABLE "Departure" ADD CONSTRAINT "Departure_coordinatorId_fkey" FOREIGN KEY ("coordinatorId") REFERENCES "TeamMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;
