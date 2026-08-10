/*
  Warnings:

  - The `status` column on the `Event` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `EventAttendance` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `markedBy` column on the `EventAttendance` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `SwapRequest` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `role` on the `InvitationCode` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `role` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('super_admin', 'admin', 'member');

-- CreateEnum
CREATE TYPE "InvitationRole" AS ENUM ('admin', 'member');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('upcoming', 'expired', 'cancelled');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('pending', 'confirmed', 'declined');

-- CreateEnum
CREATE TYPE "AttendanceMarkedBy" AS ENUM ('self', 'admin');

-- CreateEnum
CREATE TYPE "SwapRequestStatus" AS ENUM ('pending', 'accepted', 'declined');

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "status",
ADD COLUMN     "status" "EventStatus" NOT NULL DEFAULT 'upcoming';

-- AlterTable
ALTER TABLE "EventAttendance" DROP COLUMN "status",
ADD COLUMN     "status" "AttendanceStatus" NOT NULL DEFAULT 'pending',
DROP COLUMN "markedBy",
ADD COLUMN     "markedBy" "AttendanceMarkedBy" NOT NULL DEFAULT 'self';

-- AlterTable
ALTER TABLE "InvitationCode" DROP COLUMN "role",
ADD COLUMN     "role" "InvitationRole" NOT NULL;

-- AlterTable
ALTER TABLE "SwapRequest" DROP COLUMN "status",
ADD COLUMN     "status" "SwapRequestStatus" NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL;
