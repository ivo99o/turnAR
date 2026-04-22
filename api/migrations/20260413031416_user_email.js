const ids = [
  { id: 'ebaf8b21-16f4-4c31-94c6-43e31925456f', email: 'example2@example.com' },
  { id: '784838db-58e7-4142-9a4a-18b4076bfe7b', email: 'example1@example.com' },
  { id: 'c0b930eb-1085-4283-89fc-0d3f98a4a3ad', email: 'example3@example.com' },
];

export const up = async (knex) => {
  await knex.schema.alterTable('users', (table) => {
    table.string('email', 255);
    table.dropColumn('username');
  });

  for (const { id, email } of ids) {
    await knex('users').where({ id }).update({ email });
  }

  await knex.schema.alterTable('users', (table) => {
    table.string('email', 255).notNullable().unique().alter();
  });
};

export const down = async (knex) => {
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('email');
    table.string('username', 255);
  });
};
