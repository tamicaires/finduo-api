import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...\n');

  // Clear existing data
  console.log('🧹 Cleaning database...');
  await prisma.transaction.deleteMany();
  await prisma.account.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.couple.deleteMany();
  await prisma.user.deleteMany();
  await prisma.plan.deleteMany();
  console.log('✅ Database cleaned\n');

  // 1. Create Plans
  console.log('📋 Creating plans...');
  const freePlan = await prisma.plan.create({
    data: {
      name: 'FREE',
      price_monthly: 0,
      max_accounts: 2,
      max_transactions_month: 100,
      features: {
        basic_dashboard: true,
        transaction_tracking: true,
        free_spending: true,
        multiple_accounts: false,
        advanced_reports: false,
        export_data: false,
      },
    },
  });

  const premiumPlan = await prisma.plan.create({
    data: {
      name: 'PREMIUM',
      price_monthly: 29.90,
      max_accounts: 10,
      max_transactions_month: 999999,
      features: {
        basic_dashboard: true,
        transaction_tracking: true,
        free_spending: true,
        multiple_accounts: true,
        advanced_reports: true,
        export_data: true,
        priority_support: true,
      },
    },
  });
  console.log(`✅ Created plans: ${freePlan.name}, ${premiumPlan.name}\n`);

  // 2. Create Test Users
  console.log('👥 Creating test users...');
  const passwordHash = await bcrypt.hash('123456', 10);

  const userJoao = await prisma.user.create({
    data: {
      email: 'joao@test.com',
      password_hash: passwordHash,
      name: 'João Silva',
    },
  });

  const userMaria = await prisma.user.create({
    data: {
      email: 'maria@test.com',
      password_hash: passwordHash,
      name: 'Maria Santos',
    },
  });
  console.log(`✅ Created users: ${userJoao.email}, ${userMaria.email}`);
  console.log(`   Password for both: 123456\n`);

  // 3. Create Couple
  console.log('💑 Creating couple...');
  const couple = await prisma.couple.create({
    data: {
      user_id_a: userJoao.id,
      user_id_b: userMaria.id,
      free_spending_a_monthly: 500.00,
      free_spending_b_monthly: 500.00,
      free_spending_a_remaining: 350.00,
      free_spending_b_remaining: 450.00,
      reset_day: 1,
    },
  });
  console.log(`✅ Created couple: ${userJoao.name} + ${userMaria.name}\n`);

  // 4. Create Subscription
  console.log('📝 Creating subscription...');
  const subscription = await prisma.subscription.create({
    data: {
      couple_id: couple.id,
      plan_id: freePlan.id,
      status: 'TRIAL',
      start_date: new Date(),
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days trial
    },
  });
  console.log(`✅ Created subscription: ${freePlan.name} - ${subscription.status}\n`);

  // 5. Create Accounts
  console.log('🏦 Creating accounts...');
  const accountJoao = await prisma.account.create({
    data: {
      couple_id: couple.id,
      owner_id: userJoao.id,
      name: 'Conta Corrente João',
      type: 'CHECKING',
      current_balance: 2500.00,
    },
  });

  const accountMaria = await prisma.account.create({
    data: {
      couple_id: couple.id,
      owner_id: userMaria.id,
      name: 'Conta Poupança Maria',
      type: 'SAVINGS',
      current_balance: 5000.00,
    },
  });
  console.log(`✅ Created accounts: ${accountJoao.name} (R$ ${accountJoao.current_balance})`);
  console.log(`                     ${accountMaria.name} (R$ ${accountMaria.current_balance})\n`);

  // 6. Create Sample Transactions
  console.log('💰 Creating sample transactions...');

  // João's expense - free spending
  await prisma.transaction.create({
    data: {
      couple_id: couple.id,
      paid_by_id: userJoao.id,
      account_id: accountJoao.id,
      type: 'EXPENSE',
      amount: 150.00,
      description: 'Compras pessoais no shopping',
      category: 'SHOPPING',
      is_free_spending: true,
      is_couple_expense: false,
      transaction_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    },
  });

  // Maria's expense - free spending
  await prisma.transaction.create({
    data: {
      couple_id: couple.id,
      paid_by_id: userMaria.id,
      account_id: accountMaria.id,
      type: 'EXPENSE',
      amount: 50.00,
      description: 'Academia - mensalidade',
      category: 'HEALTHCARE',
      is_free_spending: true,
      is_couple_expense: false,
      transaction_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
  });

  // Couple expense - groceries
  await prisma.transaction.create({
    data: {
      couple_id: couple.id,
      paid_by_id: userJoao.id,
      account_id: accountJoao.id,
      type: 'EXPENSE',
      amount: 450.00,
      description: 'Supermercado - compra mensal',
      category: 'GROCERIES',
      is_free_spending: false,
      is_couple_expense: true,
      transaction_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
  });

  // Income - João's salary
  await prisma.transaction.create({
    data: {
      couple_id: couple.id,
      paid_by_id: userJoao.id,
      account_id: accountJoao.id,
      type: 'INCOME',
      amount: 5000.00,
      description: 'Salário - Janeiro',
      category: 'SALARY',
      is_free_spending: false,
      is_couple_expense: false,
      transaction_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    },
  });

  // Income - Maria's salary
  await prisma.transaction.create({
    data: {
      couple_id: couple.id,
      paid_by_id: userMaria.id,
      account_id: accountMaria.id,
      type: 'INCOME',
      amount: 6000.00,
      description: 'Salário - Janeiro',
      category: 'SALARY',
      is_free_spending: false,
      is_couple_expense: false,
      transaction_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    },
  });

  console.log('✅ Created 5 sample transactions\n');

  console.log('🎉 Seeding completed successfully!\n');
  console.log('📝 Test Credentials:');
  console.log('   Email: joao@test.com | Password: 123456');
  console.log('   Email: maria@test.com | Password: 123456\n');
  console.log('🔗 Access Swagger at: http://localhost:3000/api/docs\n');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
