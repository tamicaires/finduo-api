import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Categorias faltantes para criar
const missingCategories = [
  // EXPENSE - Despesas
  { name: 'Saúde', icon: 'MdLocalHospital', color: '#10b981', type: 'EXPENSE', is_default: true },
  { name: 'Educação', icon: 'MdSchool', color: '#f59e0b', type: 'EXPENSE', is_default: true },
  { name: 'Compras', icon: 'MdShoppingCart', color: '#ec4899', type: 'EXPENSE', is_default: true },
  { name: 'Contas', icon: 'MdReceipt', color: '#6366f1', type: 'EXPENSE', is_default: true },

  // INCOME - Receitas
  { name: 'Investimentos', icon: 'MdTrendingUp', color: '#0ea5e9', type: 'INCOME', is_default: true },
  { name: 'Outros Ganhos', icon: 'MdAttachMoney', color: '#84cc16', type: 'INCOME', is_default: true },
];

async function createMissingCategories() {
  console.log('🔍 Buscando casais no banco...\n');

  // Buscar todos os casais
  const couples = await prisma.couple.findMany();

  if (couples.length === 0) {
    console.log('⚠️  Nenhum casal encontrado no banco');
    return;
  }

  console.log(`📊 Encontrados ${couples.length} casal(is)\n`);

  for (const couple of couples) {
    console.log(`\n👫 Criando categorias para o casal ID: ${couple.id}`);

    for (const categoryData of missingCategories) {
      // Verificar se já existe
      const existing = await prisma.category.findFirst({
        where: {
          couple_id: couple.id,
          name: categoryData.name,
        },
      });

      if (!existing) {
        await prisma.category.create({
          data: {
            couple_id: couple.id,
            name: categoryData.name,
            icon: categoryData.icon,
            color: categoryData.color,
            type: categoryData.type as 'INCOME' | 'EXPENSE',
            is_default: categoryData.is_default,
          },
        });
        console.log(`  ✅ Criada: ${categoryData.icon} ${categoryData.name}`);
      } else {
        console.log(`  ⏭️  Já existe: ${categoryData.name}`);
      }
    }
  }

  console.log('\n✨ Processo concluído!\n');

  // Mostrar resumo final
  const totalCategories = await prisma.category.count();
  console.log(`📊 Total de categorias no banco: ${totalCategories}`);

  for (const couple of couples) {
    const coupleCategories = await prisma.category.findMany({
      where: { couple_id: couple.id },
      orderBy: [
        { type: 'asc' },
        { name: 'asc' },
      ],
    });

    console.log(`\n👫 Casal ${couple.id}: ${coupleCategories.length} categorias`);

    const expenseCategories = coupleCategories.filter(c => c.type === 'EXPENSE');
    const incomeCategories = coupleCategories.filter(c => c.type === 'INCOME');
    const bothCategories = coupleCategories.filter(c => c.type === null);

    console.log('\n  💸 DESPESAS:');
    expenseCategories.forEach(cat => {
      console.log(`    ${cat.icon} ${cat.name}`);
    });

    console.log('\n  💰 RECEITAS:');
    incomeCategories.forEach(cat => {
      console.log(`    ${cat.icon} ${cat.name}`);
    });

    if (bothCategories.length > 0) {
      console.log('\n  🔀 AMBOS:');
      bothCategories.forEach(cat => {
        console.log(`    ${cat.icon} ${cat.name}`);
      });
    }
  }
}

createMissingCategories()
  .catch(e => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
