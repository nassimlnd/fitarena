import { BaseSchema } from '@adonisjs/lucid/schema'

export default class TrainingSessions extends BaseSchema {
  protected tableName = 'training_sessions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table
        .integer('challengeId')
        .unsigned()
        .references('id')
        .inTable('challenge_clients')
        .onDelete('SET NULL')
        .nullable()
      table.date('date').notNullable()
      table.integer('duration').notNullable()
      table.integer('caloriesBurned').notNullable()
      table.json('metrics').nullable()
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
