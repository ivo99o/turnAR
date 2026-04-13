export const up = async (knex) => {
  await knex.schema.table('calendar_connections', (table) => {
    table
      .enum('status', ['active', 'pending', 'error', 'inactive'])
      .notNullable()
      .defaultTo('inactive');
    table.dropColumn('is_active');
  });
};

export const down = async (knex) => {
  await knex.schema.table('calendar_connections', (table) => {
    table.dropColumn('status');
    table.boolean('is_active').notNullable().defaultTo(true);
  });
};
