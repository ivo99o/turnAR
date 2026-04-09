export const up = async (knex) => {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

    // Identity
    table.string('username', 255).notNullable().unique();
    table.text('password_hash').notNullable();

    // Permissions
    table.boolean('is_workspace_admin').notNullable().defaultTo(false);

    // Timestamps
    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());

    // Constraints
    table.unique(['username'], {
      indexName: 'uq_users_username',
    });
  });

  await knex.schema.createTable('availability_period', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    // date field
    table.date('date').notNullable();
    // time fields
    table.time('start_time').notNullable();
    table.time('end_time').notNullable();

    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.table('users', (table) => {
    table.uuid('workspace_id').notNullable();
    // stores google calendar integration id for the user, can be null
    table
      .uuid('google_calendar_integration_id')
      .nullable()
      .references('id')
      .inTable('calendar_connections')
      .onDelete('SET NULL');
  });
};

export const down = async (knex) => {
  await knex.schema.dropTableIfExists('availability_period');

  await knex.schema.dropTableIfExists('users');
};
