-- CreateTable
CREATE TABLE "InvitationCode" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,
    "user" BOOLEAN NOT NULL DEFAULT false,
    "usedByUserId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InvitationCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InvitationCode_code_key" ON "InvitationCode"("code");

-- AddForeignKey
ALTER TABLE "InvitationCode" ADD CONSTRAINT "InvitationCode_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvitationCode" ADD CONSTRAINT "InvitationCode_usedByUserId_fkey" FOREIGN KEY ("usedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
