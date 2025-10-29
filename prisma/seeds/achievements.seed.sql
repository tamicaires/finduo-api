-- Achievement Seeds for FindUO Gamification System
-- Categories: TRANSACTIONS, STREAK, BUDGET, LEVEL, SAVINGS

-- ============================================
-- TRANSACTION ACHIEVEMENTS
-- ============================================

INSERT INTO achievements (id, key, name, description, icon, xp_reward, category)
VALUES
  (gen_random_uuid(), 'FIRST_TRANSACTION', 'Primeiro Passo', 'Registre sua primeira transação', '🎯', 50, 'TRANSACTIONS'),
  (gen_random_uuid(), 'TX_10', 'Organizad@', 'Registre 10 transações', '📊', 100, 'TRANSACTIONS'),
  (gen_random_uuid(), 'TX_50', 'Expert Financeiro', 'Registre 50 transações', '💼', 250, 'TRANSACTIONS'),
  (gen_random_uuid(), 'TX_100', 'Mestre das Finanças', 'Registre 100 transações', '👑', 500, 'TRANSACTIONS')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- STREAK ACHIEVEMENTS
-- ============================================

INSERT INTO achievements (id, key, name, description, icon, xp_reward, category)
VALUES
  (gen_random_uuid(), 'STREAK_3', 'Comprometido', 'Mantenha uma sequência de 3 dias', '🔥', 100, 'STREAK'),
  (gen_random_uuid(), 'STREAK_7', 'Determinado', 'Mantenha uma sequência de 7 dias', '💪', 200, 'STREAK'),
  (gen_random_uuid(), 'STREAK_14', 'Persistente', 'Mantenha uma sequência de 14 dias', '⚡', 400, 'STREAK'),
  (gen_random_uuid(), 'STREAK_30', 'Imparável', 'Mantenha uma sequência de 30 dias', '🏆', 800, 'STREAK'),
  (gen_random_uuid(), 'STREAK_100', 'Lendário', 'Mantenha uma sequência de 100 dias', '👾', 2000, 'STREAK')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- BUDGET ACHIEVEMENTS
-- ============================================

INSERT INTO achievements (id, key, name, description, icon, xp_reward, category)
VALUES
  (gen_random_uuid(), 'BUDGET_FIRST', 'No Controle', 'Fique dentro do orçamento pela primeira vez', '🎯', 150, 'BUDGET'),
  (gen_random_uuid(), 'BUDGET_3_MONTHS', 'Disciplinado', 'Fique dentro do orçamento por 3 meses seguidos', '🌟', 400, 'BUDGET'),
  (gen_random_uuid(), 'BUDGET_6_MONTHS', 'Equilibrado', 'Fique dentro do orçamento por 6 meses seguidos', '💎', 800, 'BUDGET'),
  (gen_random_uuid(), 'SAVINGS_FIRST', 'Poupador', 'Economize mais que o mês anterior pela primeira vez', '🐷', 150, 'BUDGET')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- LEVEL ACHIEVEMENTS
-- ============================================

INSERT INTO achievements (id, key, name, description, icon, xp_reward, category)
VALUES
  (gen_random_uuid(), 'LEVEL_5', 'Em Crescimento', 'Alcance o nível 5', '⬆️', 200, 'LEVEL'),
  (gen_random_uuid(), 'LEVEL_10', 'Evoluindo', 'Alcance o nível 10', '🚀', 500, 'LEVEL'),
  (gen_random_uuid(), 'LEVEL_20', 'Campeão', 'Alcance o nível 20', '🏅', 1000, 'LEVEL'),
  (gen_random_uuid(), 'LEVEL_50', 'Elite', 'Alcance o nível 50', '⭐', 3000, 'LEVEL')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- SAVINGS ACHIEVEMENTS
-- ============================================

INSERT INTO achievements (id, key, name, description, icon, xp_reward, category)
VALUES
  (gen_random_uuid(), 'SAVINGS_1K', 'Economizador Iniciante', 'Acumule R$ 1.000 em poupança', '💰', 200, 'SAVINGS'),
  (gen_random_uuid(), 'SAVINGS_5K', 'Poupador Pro', 'Acumule R$ 5.000 em poupança', '💵', 500, 'SAVINGS'),
  (gen_random_uuid(), 'SAVINGS_10K', 'Investidor', 'Acumule R$ 10.000 em poupança', '🏦', 1000, 'SAVINGS'),
  (gen_random_uuid(), 'SAVINGS_50K', 'Guru Financeiro', 'Acumule R$ 50.000 em poupança', '💎', 5000, 'SAVINGS')
ON CONFLICT (key) DO NOTHING;
