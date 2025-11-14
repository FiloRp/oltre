-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "homeHeroUrl" TEXT,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);
