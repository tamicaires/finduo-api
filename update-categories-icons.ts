import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Categorias com ícones do React Icons (Material Design Icons)
const categoriesWithIcons = [
  // EXPENSE - Despesas
  { name: 'Alimentação', icon: 'MdRestaurant', color: '#ef4444', type: 'EXPENSE' },
  { name: 'Transporte', icon: 'MdDirectionsCar', color: '#3b82f6', type: 'EXPENSE' },
  { name: 'Lazer', icon: 'MdTheaterComedy', color: '#8b5cf6', type: 'EXPENSE' },
  { name: 'Moradia', icon: 'MdHome', color: '#06b6d4', type: 'EXPENSE' },
  { name: 'Saúde', icon: 'MdLocalHospital', color: '#10b981', type: 'EXPENSE' },
  { name: 'Educação', icon: 'MdSchool', color: '#f59e0b', type: 'EXPENSE' },
  { name: 'Compras', icon: 'MdShoppingCart', color: '#ec4899', type: 'EXPENSE' },
  { name: 'Contas', icon: 'MdReceipt', color: '#6366f1', type: 'EXPENSE' },

  // INCOME - Receitas
  { name: 'Salário', icon: 'MdAccountBalance', color: '#22c55e', type: 'INCOME' },
  { name: 'Freelance', icon: 'MdWork', color: '#14b8a6', type: 'INCOME' },
  { name: 'Investimentos', icon: 'MdTrendingUp', color: '#0ea5e9', type: 'INCOME' },
  { name: 'Outros Ganhos', icon: 'MdAttachMoney', color: '#84cc16', type: 'INCOME' },

  // BOTH - Ambos
  { name: 'Outros', icon: 'MdMoreHoriz', color: '#64748b', type: null },
];

async function updateCategories() {
  console.log('🔍 Verificando categorias existentes...\n');

  // Buscar todas as categorias
  const existingCategories = await prisma.category.findMany();

  console.log(`📊 Encontradas ${existingCategories.length} categorias no banco:\n`);
  existingCategories.forEach(cat => {
    console.log(`  - ${cat.name} (${cat.type || 'BOTH'}) - Icon: ${cat.icon}`);
  });

  console.log('\n🔄 Atualizando ícones das categorias...\n');

  for (const categoryData of categoriesWithIcons) {
    // Encontrar categoria existente pelo nome
    const existing = existingCategories.find(c => c.name === categoryData.name);

    if (existing) {
      // Atualizar categoria existente
      await prisma.category.update({
        where: { id: existing.id },
        data: {
          icon: categoryData.icon,
          color: categoryData.color,
        },
      });
      console.log(`✅ Atualizada: ${categoryData.name} -> ${categoryData.icon}`);
    } else {
      console.log(`⚠️  Categoria não encontrada: ${categoryData.name} (será necessário criar)`);
    }
  }

  console.log('\n✨ Atualização concluída!');

  // Mostrar categorias atualizadas
  const updatedCategories = await prisma.category.findMany({
    orderBy: [
      { type: 'asc' },
      { name: 'asc' },
    ],
  });

  console.log('\n📋 Categorias atualizadas:\n');

  const expenseCategories = updatedCategories.filter(c => c.type === 'EXPENSE');
  const incomeCategories = updatedCategories.filter(c => c.type === 'INCOME');
  const bothCategories = updatedCategories.filter(c => c.type === null);

  console.log('💸 DESPESAS:');
  expenseCategories.forEach(cat => {
    console.log(`  ${cat.icon} ${cat.name} (${cat.color})`);
  });

  console.log('\n💰 RECEITAS:');
  incomeCategories.forEach(cat => {
    console.log(`  ${cat.icon} ${cat.name} (${cat.color})`);
  });

  console.log('\n🔀 AMBOS:');
  bothCategories.forEach(cat => {
    console.log(`  ${cat.icon} ${cat.name} (${cat.color})`);
  });
}

updateCategories()
  .catch(e => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
