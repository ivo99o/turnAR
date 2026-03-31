export const up = async (knex) => {
  await knex.schema.createTable('calendar_connections', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

    // Workspace ID
    // TODO: por ahora no la voy a usar para nada pero esto nos permitira tener multiples usuarios con la misma DB
    table.uuid('workspace_id');

    // OAuth Tokens
    table.text('access_token').notNullable();
    table.text('refresh_token').notNullable();
    table.string('token_type', 50).notNullable().defaultTo('Bearer');
    table.text('scope').notNullable();
    table.timestamp('expiry_date', { useTz: true }).notNullable();

    // Google Account info
    table.string('google_account_id', 255).notNullable();
    table.string('email', 255).notNullable();
    table.string('calendar_id', 255).notNullable().defaultTo('primary');

    // Webhook / Push Notifications
    table.string('channel_id', 255).nullable();
    table.string('resource_id', 255).nullable();
    table.timestamp('webhook_expiry', { useTz: true }).nullable();

    // Sync Metadata
    table.text('sync_token').nullable();
    table.timestamp('last_synced_at', { useTz: true }).nullable();

    // Status & Timestamps
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamps({ useTimestamps: true, useCamelCase: false, defaultToNow: true });

    // Constraints
    table.unique(['workspace_id', 'google_account_id'], {
      indexName: 'uq_workspace_google_account',
    });
  });

  // Indexes
  await knex.schema.table('calendar_connections', (table) => {
    table.index('workspace_id', 'idx_gcal_workspace_id');
    table.index('google_account_id', 'idx_gcal_google_account_id');
  });

  // Auto-update trigger for updated_at
  await knex.raw(`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  await knex.raw(`
    CREATE TRIGGER trg_gcal_updated_at
    BEFORE UPDATE ON calendar_connections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  `);
};

export const down = async (knex) => {
  await knex.schema.dropTableIfExists('google_calendar_integrations');

  console.log('✅ Migration DOWN: google_calendar_integrations dropped');
};
