import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { DangkiModule } from './dangki/dangki.module.js';
import { MonhocModule } from './monhoc/monhoc.module.js';
import { SinhvienModule } from './sinhvien/sinhvien.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const caPath = config.get<string>('DB_SSL_CA_PATH')?.trim();
        const sslEnabled = config.get<string>('DB_SSL', 'true') === 'true';
        const databaseUrl = new URL(config.getOrThrow<string>('DATABASE_URL'));
        databaseUrl.searchParams.delete('sslmode');
        databaseUrl.searchParams.delete('sslrootcert');

        return {
          type: 'postgres' as const,
          url: databaseUrl.toString(),
          autoLoadEntities: true,
          synchronize: config.get<string>('DB_SYNCHRONIZE', 'true') === 'true',
          ssl: sslEnabled
            ? caPath
              ? {
                  ca: readFileSync(resolve(caPath), 'utf8'),
                  rejectUnauthorized: true,
                }
              : { rejectUnauthorized: false }
            : false,
        };
      },
    }),
    SinhvienModule,
    MonhocModule,
    DangkiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
