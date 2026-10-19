-- ContactMessage: add a single `name` column. Nothing is dropped.
-- Existing rows keep every value; `name` is backfilled from firstName + lastName.
-- The old columns are only relaxed to nullable so the trimmed form can insert without them.

ALTER TABLE "ContactMessage" ADD COLUMN IF NOT EXISTS "name" TEXT;

UPDATE "ContactMessage"
   SET "name" = TRIM(CONCAT_WS(' ', NULLIF("firstName", ''), NULLIF("lastName", '')))
 WHERE "name" IS NULL OR "name" = '';

ALTER TABLE "ContactMessage" ALTER COLUMN "firstName" DROP NOT NULL;
ALTER TABLE "ContactMessage" ALTER COLUMN "lastName"  DROP NOT NULL;
ALTER TABLE "ContactMessage" ALTER COLUMN "email"     DROP NOT NULL;
ALTER TABLE "ContactMessage" ALTER COLUMN "subject"   DROP NOT NULL;
ALTER TABLE "ContactMessage" ALTER COLUMN "childName" DROP NOT NULL;
ALTER TABLE "ContactMessage" ALTER COLUMN "grade"     DROP NOT NULL;
