import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * MCP Grants: OAuth connections to the blog MCP server (/api/mcp).
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "mcp_grants" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"client_id" varchar NOT NULL,
  	"redirect_uri" varchar NOT NULL,
  	"user_id" integer,
  	"scope" varchar,
  	"code_hash" varchar,
  	"code_challenge" varchar,
  	"code_expires_at" timestamp(3) with time zone,
  	"access_token_hash" varchar,
  	"access_token_expires_at" timestamp(3) with time zone,
  	"refresh_token_hash" varchar,
  	"refresh_token_expires_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "mcp_grants_id" integer;
  ALTER TABLE "mcp_grants" ADD CONSTRAINT "mcp_grants_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_mcp_grants_fk" FOREIGN KEY ("mcp_grants_id") REFERENCES "public"."mcp_grants"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX IF NOT EXISTS "mcp_grants_user_idx" ON "mcp_grants" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "mcp_grants_code_hash_idx" ON "mcp_grants" USING btree ("code_hash");
  CREATE INDEX IF NOT EXISTS "mcp_grants_access_token_hash_idx" ON "mcp_grants" USING btree ("access_token_hash");
  CREATE INDEX IF NOT EXISTS "mcp_grants_refresh_token_hash_idx" ON "mcp_grants" USING btree ("refresh_token_hash");
  CREATE INDEX IF NOT EXISTS "mcp_grants_updated_at_idx" ON "mcp_grants" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "mcp_grants_created_at_idx" ON "mcp_grants" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_mcp_grants_id_idx" ON "payload_locked_documents_rels" USING btree ("mcp_grants_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_mcp_grants_fk";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_mcp_grants_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "mcp_grants_id";
  DROP TABLE IF EXISTS "mcp_grants" CASCADE;`)
}
