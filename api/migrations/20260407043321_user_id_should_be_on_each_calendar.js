export const up = async (knex) => {
  await knex.schema.table('users', (table) => {
    table.dropColumn('google_calendar_integration_id');
  });

  await knex.schema.table('calendar_connections', (table) => {
    // TODO: add a foreign key constraint to users table
    table.uuid('user_id')// .notNullable();
  });
};

export const down = async (knex) => {
  await knex.schema.table('users', (table) => {
    table
      .uuid('google_calendar_integration_id')
      .nullable()
      .references('id')
      .inTable('calendar_connections')
      .onDelete('SET NULL');
  });

  await knex.schema.table('calendar_connections', (table) => {
    table.dropColumn('user_id');
  });
};
