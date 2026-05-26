-- CreateTable
CREATE TABLE "SummaryHistory" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fromDate" TEXT,
    "toDate" TEXT,
    "summary" TEXT NOT NULL,

    CONSTRAINT "SummaryHistory_pkey" PRIMARY KEY ("id")
);
