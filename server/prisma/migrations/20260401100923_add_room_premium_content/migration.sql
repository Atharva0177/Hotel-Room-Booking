-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "cancellationPolicy" TEXT,
ADD COLUMN     "checkInTime" TEXT,
ADD COLUMN     "checkOutTime" TEXT,
ADD COLUMN     "guestAssurancePoints" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "paymentPolicy" TEXT,
ADD COLUMN     "signatureExperiences" TEXT[] DEFAULT ARRAY[]::TEXT[];
