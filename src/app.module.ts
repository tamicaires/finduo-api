import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from '@infra/database/database.module';
import { LoggingModule } from '@infra/logging/logging.module';
import { I18nCustomModule } from '@infra/i18n/i18n.module';
import { EventsModule } from '@application/events/events.module';
import { PresenterModule } from '@presenters/presenter.module';
import { GlobalExceptionFilter } from '@infra/http/filters/global-exception.filter';
import { JwtAuthGuard } from '@infra/http/auth/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    LoggingModule,
    I18nCustomModule,
    EventsModule,
    PresenterModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
