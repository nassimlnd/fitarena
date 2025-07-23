import { BaseSchema } from '@adonisjs/lucid/schema'

export default class GroupChallengeParticipants extends BaseSchema {
  protected tableName = 'group_challenge_participants'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('group_challengeId')
        .unsigned()
        .references('id')
        .inTable('group_challenges')
        .onDelete('CASCADE')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.timestamp('joined_at').defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
