import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // ---------------- CONFIG ----------------
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // ---------------- DATABASE ----------------
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const host = config.get<string>('HOST');
        const port = config.get<number>('DB_PORT');
        const username = config.get<string>('DB_USERNAME');
        const password = config.get<string>('DB_PASSWORD');
        const database = config.get<string>('DB_NAME');

        if (!host || !port || !username || !database) {
          throw new Error('Missing database environment variables');
        }

        return {
          type: 'postgres',
          host,
          port,
          username,
          password,
          database,
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),

    // ---------------- FEATURES ----------------
    TasksModule,
  ],
})
export class AppModule {}
