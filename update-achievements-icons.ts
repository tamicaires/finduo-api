import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Mapeamento de conquistas para ícones do React Icons (Material Design)
const achievementsWithIcons = [
  // TRANSACTIONS - Transações
  { key: 'FIRST_TRANSACTION', icon: 'MdCheckCircle', name: 'Primeiro Passo' },
  { key: 'TX_10', icon: 'MdBarChart', name: 'Organizad@' },
  { key: 'TX_50', icon: 'MdBusinessCenter', name: 'Expert Financeiro' },
  { key: 'TX_100', icon: 'MdEmojiEvents', name: 'Mestre das Finanças' },

  // STREAK - Sequências
  { key: 'STREAK_3', icon: 'MdLocalFireDepartment', name: 'Comprometido' },
  { key: 'STREAK_7', icon: 'MdFitnessCenter', name: 'Determinado' },
  { key: 'STREAK_14', icon: 'MdFlashOn', name: 'Persistente' },
  { key: 'STREAK_30', icon: 'MdMilitaryTech', name: 'Imparável' },
  { key: 'STREAK_100', icon: 'MdStars', name: 'Lendário' },

  // BUDGET - Orçamento
  { key: 'BUDGET_FIRST', icon: 'MdGpsFixed', name: 'No Controle' },
  { key: 'BUDGET_3_MONTHS', icon: 'MdAutoAwesome', name: 'Disciplinado' },
  { key: 'BUDGET_6_MONTHS', icon: 'MdDiamond', name: 'Equilibrado' },
  { key: 'SAVINGS_FIRST', icon: 'MdSavings', name: 'Poupador' },

  // LEVEL - Níveis
  { key: 'LEVEL_5', icon: 'MdArrowUpward', name: 'Em Crescimento' },
  { key: 'LEVEL_10', icon: 'MdRocket', name: 'Evoluindo' },
  { key: 'LEVEL_20', icon: 'MdWorkspacePremium', name: 'Campeão' },
  { key: 'LEVEL_50', icon: 'MdStarRate', name: 'Elite' },

  // SAVINGS - Economia
  { key: 'SAVINGS_1K', icon: 'MdAccountBalanceWallet', name: 'Economizador Iniciante' },
  { key: 'SAVINGS_5K', icon: 'MdAttachMoney', name: 'Poupador Pro' },
  { key: 'SAVINGS_10K', icon: 'MdAccountBalance', name: 'Investidor' },
  { key: 'SAVINGS_50K', icon: 'MdMonetizationOn', name: 'Guru Financeiro' },
];

async function updateAchievementsIcons() {
  console.log('🏆 Atualizando ícones das conquistas...\n');

  let updated = 0;
  let notFound = 0;

  for (const achievement of achievementsWithIcons) {
    const existing = await prisma.achievement.findUnique({
      where: { key: achievement.key },
    });

    if (existing) {
      await prisma.achievement.update({
        where: { key: achievement.key },
        data: { icon: achievement.icon },
      });
      console.log(`✅ ${achievement.name} (${achievement.key}) -> ${achievement.icon}`);
      updated++;
    } else {
      console.log(`⚠️  Conquista não encontrada: ${achievement.key}`);
      notFound++;
    }
  }

  console.log(`\n📊 Resumo:`);
  console.log(`   ✅ Atualizadas: ${updated}`);
  console.log(`   ⚠️  Não encontradas: ${notFound}`);

  // Mostrar conquistas por categoria
  const allAchievements = await prisma.achievement.findMany({
    orderBy: [{ category: 'asc' }, { xp_reward: 'asc' }],
  });

  console.log('\n🏆 Conquistas por categoria:\n');

  const categories = ['TRANSACTIONS', 'STREAK', 'BUDGET', 'LEVEL', 'SAVINGS'];
  const categoryEmojis: Record<string, string> = {
    TRANSACTIONS: '📈',
    STREAK: '🔥',
    BUDGET: '💰',
    LEVEL: '⬆️',
    SAVINGS: '🏦',
  };

  for (const category of categories) {
    const categoryAchievements = allAchievements.filter(a => a.category === category);
    if (categoryAchievements.length > 0) {
      console.log(`${categoryEmojis[category]} ${category}:`);
      categoryAchievements.forEach(ach => {
        console.log(`  ${ach.icon} ${ach.name} (+${ach.xp_reward} XP)`);
      });
      console.log('');
    }
  }
}

updateAchievementsIcons()
  .catch(e => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
