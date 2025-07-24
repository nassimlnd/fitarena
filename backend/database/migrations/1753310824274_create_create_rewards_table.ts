import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'rewards'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 100).notNullable()
      table.text('description').nullable()
      table.string('icon', 255).nullable()
      table.enum('type', ['virtual_item', 'title', 'access', 'special']).defaultTo('virtual_item')
      table.json('conditions').notNullable() // Conditions to earn this reward
      table.integer('points_cost').defaultTo(0) // Cost in points to claim
      table.boolean('is_active').defaultTo(true)
      table.boolean('is_repeatable').defaultTo(false) // Can be earned multiple times

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
