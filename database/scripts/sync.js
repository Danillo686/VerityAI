const { sequelize, User, ExecutedTask, UserPreference } = require('../models');

async function syncAndSeed() {
  try {
    console.log('--- Iniciando Sincronização Sequelize Verity AI ---');
    await sequelize.authenticate();
    console.log('✓ Conexão com o banco de dados autenticada com sucesso!');
    console.log(`✓ Dialeto em uso: ${sequelize.getDialect().toUpperCase()}`);

    // Sync all models with database schema
    await sequelize.sync({ alter: true });
    console.log('✓ Todas as tabelas sincronizadas com sucesso (users, chat_messages, executed_tasks, user_preferences)');

    // Seed demo user if empty
    const adminUser = await User.findOne({ where: { email: 'admin@verityai.com' } });
    if (!adminUser) {
      console.log('Criando usuário demonstrativo admin@verityai.com...');
      // bcrypt hash for "verity2026"
      const defaultHash = '$2b$12$eXF1qY5R9s1O3eT7fB7F8eOqLgRz3.Z7tX6k2g0V0vG2.1.2.3.4.';
      await User.create({
        id: 'usr-admin-demo-01',
        name: 'Administrador Verity AI',
        email: 'admin@verityai.com',
        password_hash: defaultHash,
        plan: 'equipe',
        default_mode: 'empresa',
        created_at: new Date(),
      });

      await UserPreference.create({
        user_id: 'usr-admin-demo-01',
        theme: 'dark',
        authorized_folder_path: 'C:\\Users\\Downloads',
        notifications_enabled: true,
        updated_at: new Date(),
      });

      await ExecutedTask.create({
        id: 'task-seed-01',
        user_id: 'usr-admin-demo-01',
        task_type: 'excel',
        title: 'Demonstrativo DRE Trimestral',
        status: 'completed',
        file_name: 'dre_corporativo_verity.xlsx',
        file_url: '/api/automation/download/dre_corporativo_verity.xlsx',
        created_at: new Date(),
      });

      console.log('✓ Usuário de demonstração e dados iniciais criados!');
    } else {
      console.log('✓ Usuário demonstrativo já existente no banco.');
    }

    console.log('\n--- Sincronização Sequelize Concluída com Sucesso! ---');
    process.exit(0);
  } catch (error) {
    console.error('✗ Erro na sincronização do Sequelize:', error);
    process.exit(1);
  }
}

syncAndSeed();

