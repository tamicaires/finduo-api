import { randomUUID } from 'crypto';
import { z } from 'zod';

export class User {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  created_at: Date;
  updated_at: Date;

  constructor(data: UserType) {
    const validatedData = userSchema.parse(data);
    Object.assign(this, validatedData);
    this.id = validatedData.id ?? randomUUID();
    this.created_at = validatedData.created_at ?? new Date();
    this.updated_at = validatedData.updated_at ?? new Date();
  }

  // Helper: Get user initials
  getInitials(): string {
    return this.name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  // Helper: Get display name
  getDisplayName(): string {
    return this.name || this.email.split('@')[0];
  }
}

export const userSchema = z.object({
  id: z.string().uuid().optional(),
  email: z.string().email(),
  password_hash: z.string().min(1),
  name: z.string().min(1),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export type UserType = z.infer<typeof userSchema>;
