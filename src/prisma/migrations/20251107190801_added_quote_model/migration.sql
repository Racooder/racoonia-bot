-- AlterTable
ALTER TABLE "Feedback" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Quote" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "context" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuoteStatement" (
    "id" SERIAL NOT NULL,
    "quoteId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "QuoteStatement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Quote_token_creatorId_createdAt_idx" ON "Quote"("token", "creatorId", "createdAt");

-- CreateIndex
CREATE INDEX "QuoteStatement_quoteId_authorId_order_idx" ON "QuoteStatement"("quoteId", "authorId", "order");

-- CreateIndex
CREATE INDEX "Feedback_type_authorId_createdAt_idx" ON "Feedback"("type", "authorId", "createdAt");

-- AddForeignKey
ALTER TABLE "QuoteStatement" ADD CONSTRAINT "QuoteStatement_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;
