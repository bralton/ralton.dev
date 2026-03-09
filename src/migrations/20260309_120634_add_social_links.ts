import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_social_links_platform" AS ENUM('github', 'linkedin', 'twitter', 'email');
  CREATE TABLE "social_links" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"platform" "enum_social_links_platform" NOT NULL,
  	"url" varchar NOT NULL,
  	"is_visible" boolean DEFAULT true,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "social_links_id" integer;
  CREATE INDEX "social_links_updated_at_idx" ON "social_links" USING btree ("updated_at");
  CREATE INDEX "social_links_created_at_idx" ON "social_links" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_social_links_fk" FOREIGN KEY ("social_links_id") REFERENCES "public"."social_links"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_social_links_id_idx" ON "payload_locked_documents_rels" USING btree ("social_links_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "social_links" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "social_links" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_social_links_fk";
  
  DROP INDEX "payload_locked_documents_rels_social_links_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "social_links_id";
  DROP TYPE "public"."enum_social_links_platform";`)
}
