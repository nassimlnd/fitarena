import { BaseSchema } from '@adonisjs/lucid/schema'

export default class ChallengesClient extends BaseSchema {
  protected tableName = 'challenge_clients'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title').notNullable()
      table.text('description').notNullable()
      table.text('objectives').notNullable()
      table.text('recommended_exercises').notNullable()
      table.integer('duration').notNullable()
      table.enum('difficulty', ['easy', 'medium', 'hard']).notNullable()
      table.integer('creator_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.boolean('is_public').defaultTo(true)
      table.string('type').nullable()
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
