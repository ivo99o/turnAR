export const up = async (knex) => {
  await knex.schema.alterTable('users', (table) => {
    table.string('email', 255).notNullable().unique();
    table.dropColumn('username');
  });
};

export const down = async (knex) => {
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('email');
    table.string('username', 255).notNullable().unique();
  });
};
