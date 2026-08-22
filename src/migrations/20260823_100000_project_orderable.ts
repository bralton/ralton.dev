import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import { generateNKeysBetween } from 'payload/shared'

/**
 * Projects: enable admin drag-and-drop ordering (`orderable: true`).
 * Backfills `_order` for existing rows so the previous newest-first display
 * order is preserved until projects are reordered in the admin.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects" ADD COLUMN "_order" varchar;
  CREATE INDEX "projects__order_idx" ON "projects" USING btree ("_order");`)

  const { rows } = await db.execute<{ id: number }>(sql`
    SELECT "id" FROM "projects" ORDER BY "created_at" DESC, "id" DESC;`)

  if (rows.length === 0) return

  const keys = generateNKeysBetween(null, null, rows.length)
  for (let i = 0; i < rows.length; i++) {
    await db.execute(sql`UPDATE "projects" SET "_order" = ${keys[i]} WHERE "id" = ${rows[i].id};`)
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "projects__order_idx";
  ALTER TABLE "projects" DROP COLUMN "_order";`)
}
