-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT,
    "equipmentNeeded" TEXT,
    "teamId" INTEGER NOT NULL,
    "createdbyUserId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'upcoming',
    "deteledAt" TIMESTAMP(3),

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_createdbyUserId_fkey" FOREIGN KEY ("createdbyUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
