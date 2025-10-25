import { PrismaService } from './prisma.service';
import { PrismaClient, Prisma } from '@prisma/client';
export declare class UnitOfWork {
    private readonly prisma;
    constructor(prisma: PrismaService);
    execute<T>(fn: (prisma: PrismaClient) => Promise<T>): Promise<T>;
    executeWithOptions<T>(fn: (prisma: PrismaClient) => Promise<T>, options?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: Prisma.TransactionIsolationLevel;
    }): Promise<T>;
    batchCreate<T>(model: string, data: T[]): Promise<Prisma.BatchPayload>;
}
