import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaTenantService } from './prisma/prisma-tenant.service';
import { LoggingModule } from '@infra/logging/logging.module';

@Global()
@Module({
  imports: [LoggingModule],
  providers: [PrismaService, PrismaTenantService],
  exports: [PrismaService, PrismaTenantService],
})
export class DatabaseModule {}
