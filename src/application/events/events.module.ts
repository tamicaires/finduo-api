import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { LoggingModule } from '@infra/logging/logging.module';

// Listeners
import { TransactionMonitoringListener } from './listeners/transaction-monitoring.listener';

/**
 * Events Module
 *
 * Centralized event handling for the application
 *
 * Features:
 * - Transaction monitoring and analytics
 * - Free spending tracking
 * - Audit logging
 */
@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
      maxListeners: 10,
      verboseMemoryLeak: true,
    }),
    LoggingModule,
  ],
  providers: [TransactionMonitoringListener],
  exports: [EventEmitterModule],
})
export class EventsModule {}
