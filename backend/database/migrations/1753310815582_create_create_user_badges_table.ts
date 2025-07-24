import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_badges'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable()
      table.integer('badge_id').unsigned().notNullable()
      table.timestamp('earned_at').notNullable()
      table.json('context').nullable() // Additional context about how the badge was earned

      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.foreign('badge_id').references('id').inTable('badges').onDelete('CASCADE')
      table.unique(['user_id', 'badge_id']) // Prevent duplicate badges for same user

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
