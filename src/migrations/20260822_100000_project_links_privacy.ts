import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Projects: replace repo_url/live_url with a generic links array, add a slug,
 * and add an optional privacy policy (rich text + last-updated date).
 *
 * Data migration:
 * - slug is backfilled from title (same algorithm as createSlugHook), suffixed
 *   with the row id if it would collide.
 * - existing repo_url/live_url values are copied into projects_links.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_projects_links_type" AS ENUM('github', 'live', 'appStore', 'googlePlay', 'other');
  CREATE TABLE "projects_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_projects_links_type" DEFAULT 'github' NOT NULL,
  	"url" varchar NOT NULL,
  	"label" varchar
  );

  ALTER TABLE "projects" ADD COLUMN "slug" varchar;
  ALTER TABLE "projects" ADD COLUMN "privacy_policy" jsonb;
  ALTER TABLE "projects" ADD COLUMN "privacy_policy_updated_at" timestamp(3) with time zone;

  ALTER TABLE "projects_links" ADD CONSTRAINT "projects_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "projects_links_order_idx" ON "projects_links" USING btree ("_order");
  CREATE INDEX "projects_links_parent_id_idx" ON "projects_links" USING btree ("_parent_id");

  -- Backfill slugs from titles; de-duplicate by appending the id.
  UPDATE "projects" SET "slug" = trim(both '-' from regexp_replace(lower("title"), '[^a-z0-9]+', '-', 'g'));
  UPDATE "projects" p SET "slug" = p."slug" || '-' || p."id"
  WHERE EXISTS (
    SELECT 1 FROM "projects" q WHERE q."slug" = p."slug" AND q."id" < p."id"
  );
  ALTER TABLE "projects" ALTER COLUMN "slug" SET NOT NULL;
  CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");

  -- Copy legacy link fields into the links array.
  INSERT INTO "projects_links" ("_order", "_parent_id", "id", "type", "url")
  SELECT 1, "id", gen_random_uuid()::varchar, 'github', "repo_url"
  FROM "projects" WHERE "repo_url" IS NOT NULL AND "repo_url" <> '';
  INSERT INTO "projects_links" ("_order", "_parent_id", "id", "type", "url")
  SELECT 2, "id", gen_random_uuid()::varchar, 'live', "live_url"
  FROM "projects" WHERE "live_url" IS NOT NULL AND "live_url" <> '';

  ALTER TABLE "projects" DROP COLUMN "repo_url";
  ALTER TABLE "projects" DROP COLUMN "live_url";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects" ADD COLUMN "repo_url" varchar;
  ALTER TABLE "projects" ADD COLUMN "live_url" varchar;

  UPDATE "projects" p SET "repo_url" = l."url"
  FROM "projects_links" l WHERE l."_parent_id" = p."id" AND l."type" = 'github';
  UPDATE "projects" p SET "live_url" = l."url"
  FROM "projects_links" l WHERE l."_parent_id" = p."id" AND l."type" = 'live';

  DROP TABLE "projects_links" CASCADE;
  DROP INDEX "projects_slug_idx";
  ALTER TABLE "projects" DROP COLUMN "slug";
  ALTER TABLE "projects" DROP COLUMN "privacy_policy";
  ALTER TABLE "projects" DROP COLUMN "privacy_policy_updated_at";
  DROP TYPE "public"."enum_projects_links_type";`)
}
