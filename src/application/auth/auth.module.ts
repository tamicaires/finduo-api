import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from '@infra/database/database.module';
import { LoggingModule } from '@infra/logging/logging.module';

// Use Cases
import { SignUpUseCase } from './useCases/sign-up/sign-up.use-case';
import { SignInUseCase } from './useCases/sign-in/sign-in.use-case';
import { ValidateUserUseCase } from './useCases/validate-user/validate-user.use-case';

// Strategies
import { JwtStrategy } from '@infra/http/auth/strategies/jwt.strategy';
import { LocalStrategy } from '@infra/http/auth/strategies/local.strategy';

// Repositories
import { PrismaUserRepository } from '@infra/database/prisma/repositories/prisma-user.repository';
import { IUserRepository } from '@core/domain/repositories/user.repository';

@Module({
  imports: [
    DatabaseModule,
    LoggingModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'your-super-secret-jwt-key-change-in-production',
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '7d',
        },
      }),
    }),
  ],
  providers: [
    // Use Cases
    SignUpUseCase,
    SignInUseCase,
    ValidateUserUseCase,

    // Strategies
    JwtStrategy,
    LocalStrategy,

    // Repositories
    {
      provide: 'IUserRepository',
      useClass: PrismaUserRepository,
    },
    // Alias for injection
    {
      provide: IUserRepository,
      useExisting: 'IUserRepository',
    },
  ],
  exports: [SignUpUseCase, SignInUseCase, ValidateUserUseCase, JwtModule],
})
export class AuthModule {}
