-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "roomsBooked" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "inventoryCount" INTEGER NOT NULL DEFAULT 1;
