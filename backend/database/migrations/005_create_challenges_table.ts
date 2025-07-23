import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'challenges'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.string('name', 254).notNullable()
      table.integer('score').nullable()
      table
        .integer('gym_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('gyms')
        .onDelete('CASCADE')
      table.text('description').nullable()
      table.text('objectives').nullable()
      table.text('recommended_exercises').nullable()
      table.integer('duration').nullable()
      table.enum('difficulty', ['easy', 'medium', 'hard']).nullable()
      table
        .integer('creator_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.boolean('is_public').defaultTo(true)
      table.string('type').nullable()

      table.enum('creator_type', ['user', 'gym']).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
