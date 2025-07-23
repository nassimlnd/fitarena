import { BaseSchema } from '@adonisjs/lucid/schema'

export default class ChallengeInvitations extends BaseSchema {
  protected tableName = 'challenge_invitations'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('inviter_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('invitee_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table
        .integer('challenge_id')
        .unsigned()
        .references('id')
        .inTable('challenge_clients')
        .onDelete('CASCADE')
      table.enum('status', ['pending', 'accepted', 'declined']).defaultTo('pending')
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
