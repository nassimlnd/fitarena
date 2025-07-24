import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'badges'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 100).notNullable()
      table.text('description').nullable()
      table.string('icon', 255).nullable()
      table.string('color', 7).defaultTo('#FFD700') // Gold color default
      table.enum('type', ['achievement', 'milestone', 'special']).defaultTo('achievement')
      table.json('criteria').notNullable() // Rules for automatic attribution
      table.integer('points').defaultTo(0) // Points value for the badge
      table.boolean('is_active').defaultTo(true)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
