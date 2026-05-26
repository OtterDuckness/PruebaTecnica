-- CreateTable
CREATE TABLE "SummaryHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fromDate" TEXT,
    "toDate" TEXT,
    "summary" TEXT NOT NULL
);
