export const up = async (knex) => {
  await knex.schema.alterTable('users', (table) => {
    table.string('name', 255);
  });

  await knex('users').whereNull('name').update({ name: 'your_default' });

  await knex.schema.alterTable('users', (table) => {
    table.string('name', 255).notNullable().alter();
  });
};

export const down = async (knex) => {
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('name');
  });
};
