import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('total_points').defaultTo(0) // Total points earned
      table.integer('available_points').defaultTo(0) // Points available to spend
      table.integer('level').defaultTo(1) // User level
      table.integer('experience_points').defaultTo(0) // XP for level progression
      table.json('achievements_progress').nullable() // Progress tracking for achievements
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('total_points')
      table.dropColumn('available_points')
      table.dropColumn('level')
      table.dropColumn('experience_points')
      table.dropColumn('achievements_progress')
    })
  }
}
