import { BaseSchema } from '@adonisjs/lucid/schema'

export default class GroupChallenges extends BaseSchema {
  protected tableName = 'group_challenges'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('challenge_id')
        .unsigned()
        .references('id')
        .inTable('challenge_clients')
        .onDelete('CASCADE')
      table.string('group_name').notNullable()
      table.integer('created_by').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
