import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'challenge_participations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('challenge_id').unsigned().references('challenges.id').onDelete('CASCADE')
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')

      table.enum('status', ['in_progress', 'completed', 'abandoned']).defaultTo('in_progress')
      table.timestamp('started_at').notNullable()
      table.timestamp('completed_at').nullable()
      table.integer('score').nullable()
      table.text('notes').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')

      // Ensure unique participation per user per challenge
      table.unique(['challenge_id', 'user_id'])

      // Indexes for common queries
      table.index(['user_id', 'status'])
      table.index(['challenge_id', 'status'])
      table.index(['completed_at'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
