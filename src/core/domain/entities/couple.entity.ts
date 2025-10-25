export class Couple {
  id: string;
  user_id_a: string;
  user_id_b: string;
  free_spending_a_monthly: number;
  free_spending_b_monthly: number;
  free_spending_a_remaining: number;
  free_spending_b_remaining: number;
  reset_day: number;
  created_at: Date;
  updated_at: Date;

  constructor(props: Couple) {
    Object.assign(this, props);
  }

  // Helper: Check if user belongs to this couple
  hasUser(userId: string): boolean {
    return this.user_id_a === userId || this.user_id_b === userId;
  }

  // Helper: Get partner ID
  getPartnerId(userId: string): string | null {
    if (this.user_id_a === userId) return this.user_id_b;
    if (this.user_id_b === userId) return this.user_id_a;
    return null;
  }

  // Helper: Check if user is User A
  isUserA(userId: string): boolean {
    return this.user_id_a === userId;
  }

  // Helper: Get free spending monthly for specific user
  getFreeSpendingMonthly(userId: string): number {
    return this.isUserA(userId)
      ? this.free_spending_a_monthly
      : this.free_spending_b_monthly;
  }

  // Helper: Get remaining free spending for specific user
  getFreeSpendingRemaining(userId: string): number {
    return this.isUserA(userId)
      ? this.free_spending_a_remaining
      : this.free_spending_b_remaining;
  }

  // Helper: Update free spending for specific user
  updateFreeSpending(userId: string, amount: number): void {
    if (this.isUserA(userId)) {
      this.free_spending_a_remaining = amount;
    } else {
      this.free_spending_b_remaining = amount;
    }
  }
}
