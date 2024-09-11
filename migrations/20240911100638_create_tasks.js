/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("tasks", function (table) {
    table.increments("id").primary();
    table.integer("user_id").unsigned().references("id").inTable("users");
    table.string("name").notNullable();
    table.text("description");
    table.enum("status", ["pending", "done"]).defaultTo("pending");
    table.datetime("next_execute_date_time");
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("tasks");
};
