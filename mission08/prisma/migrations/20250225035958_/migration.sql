-- CreateIndex
CREATE INDEX "Post_createdAt_updatedAt_idx" ON "Post"("createdAt", "updatedAt");

-- CreateIndex
CREATE INDEX "PostComment_postId_idx" ON "PostComment"("postId");

-- CreateIndex
CREATE INDEX "PostComment_createdAt_updatedAt_idx" ON "PostComment"("createdAt", "updatedAt");
