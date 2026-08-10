/*
  Warnings:

  - You are about to drop the column `user` on the `InvitationCode` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "InvitationCode" DROP COLUMN "user",
ADD COLUMN     "used" BOOLEAN NOT NULL DEFAULT false;
