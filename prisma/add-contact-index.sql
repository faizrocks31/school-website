-- Index supporting the per-mobile-number message limit query.
-- Additive only: creates an index, touches no data and drops nothing.
CREATE INDEX IF NOT EXISTS "ContactMessage_contactNumber_idx"
  ON "ContactMessage" ("contactNumber");
