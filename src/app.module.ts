import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('HOST') ?? 'localhost',
        port: Number(configService.get<string>('DB_PORT')) || 5432,
        username: configService.get<string>('DB_USERNAME') ?? '',
        password: configService.get<string>('DB_PASSWORD') ?? '',
        database: configService.get<string>('DB_NAME') ?? '',
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
