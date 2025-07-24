import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_rewards'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable()
      table.integer('reward_id').unsigned().notNullable()
      table.timestamp('claimed_at').notNullable()
      table.json('context').nullable() // Additional context about how the reward was claimed
      table.boolean('is_active').defaultTo(true) // Can be deactivated

      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.foreign('reward_id').references('id').inTable('rewards').onDelete('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
