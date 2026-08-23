import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * SocialLinks: add 'coffee' (Buy Me a Coffee) to the platform enum.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_social_links_platform" ADD VALUE IF NOT EXISTS 'coffee';`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Postgres cannot drop a single enum value; recreate the type without 'coffee'.
  await db.execute(sql`
   DELETE FROM "social_links" WHERE "platform" = 'coffee';
  ALTER TYPE "public"."enum_social_links_platform" RENAME TO "enum_social_links_platform_old";
  CREATE TYPE "public"."enum_social_links_platform" AS ENUM('github', 'linkedin', 'twitter', 'email');
  ALTER TABLE "social_links" ALTER COLUMN "platform" TYPE "public"."enum_social_links_platform" USING "platform"::text::"public"."enum_social_links_platform";
  DROP TYPE "public"."enum_social_links_platform_old";`)
}
