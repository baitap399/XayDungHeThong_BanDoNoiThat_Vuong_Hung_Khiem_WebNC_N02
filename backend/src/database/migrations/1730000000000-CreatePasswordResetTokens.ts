import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreatePasswordResetTokens1730000000000 implements MigrationInterface {
  name = 'CreatePasswordResetTokens1730000000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasTable('password_reset_tokens')) return;

    await queryRunner.createTable(new Table({
      name: 'password_reset_tokens',
      columns: [
        { name: 'id', type: 'bigint', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
        { name: 'user_id', type: 'bigint' },
        { name: 'otp_hash', type: 'varchar', length: '255' },
        { name: 'expires_at', type: 'datetime' },
        { name: 'verified_at', type: 'datetime', isNullable: true },
        { name: 'used_at', type: 'datetime', isNullable: true },
        { name: 'created_at', type: 'datetime', default: 'CURRENT_TIMESTAMP' },
      ],
    }));
    await queryRunner.createIndex('password_reset_tokens', new TableIndex({
      name: 'IDX_password_reset_user_created',
      columnNames: ['user_id', 'created_at'],
    }));
    await queryRunner.createForeignKey('password_reset_tokens', new TableForeignKey({
      name: 'FK_password_reset_user',
      columnNames: ['user_id'],
      referencedTableName: 'users',
      referencedColumnNames: ['id'],
      onDelete: 'CASCADE',
    }));
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('password_reset_tokens', true);
  }
}
