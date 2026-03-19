import { MigrationInterface, QueryRunner } from "typeorm";

export class AddThumbnailDuration1747672800000 implements MigrationInterface {
    name = 'AddThumbnailDuration1747672800000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "record" ADD "thumbnailPath" character varying`);
        await queryRunner.query(`ALTER TABLE "record" ADD "duration" numeric(10,3)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "record" DROP COLUMN "duration"`);
        await queryRunner.query(`ALTER TABLE "record" DROP COLUMN "thumbnailPath"`);
    }
}
