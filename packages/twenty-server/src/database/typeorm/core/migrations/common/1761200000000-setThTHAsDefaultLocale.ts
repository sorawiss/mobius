import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class SetThTHAsDefaultLocale1761200000000 implements MigrationInterface {
  name = 'SetThTHAsDefaultLocale1761200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Set default to th-TH at DB level
    await queryRunner.query(
      `ALTER TABLE "core"."user" ALTER COLUMN "locale" SET DEFAULT 'th-TH'`,
    );
    await queryRunner.query(
      `ALTER TABLE "core"."userWorkspace" ALTER COLUMN "locale" SET DEFAULT 'th-TH'`,
    );

    // Backfill existing rows to th-TH when they are null, 'en' or 'th'
    await queryRunner.query(
      `UPDATE "core"."user" SET "locale" = 'th-TH' WHERE "locale" IS NULL OR "locale" IN ('en','th')`,
    );
    await queryRunner.query(
      `UPDATE "core"."userWorkspace" SET "locale" = 'th-TH' WHERE "locale" IS NULL OR "locale" IN ('en','th')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Restore defaults only. We intentionally do not rewrite existing data to avoid destructive changes.
    await queryRunner.query(
      `ALTER TABLE "core"."user" ALTER COLUMN "locale" SET DEFAULT 'en'`,
    );
    await queryRunner.query(
      `ALTER TABLE "core"."userWorkspace" ALTER COLUMN "locale" SET DEFAULT 'en'`,
    );
  }
}

