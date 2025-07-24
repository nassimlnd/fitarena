import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'gyms'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.string('name', 254).nullable()
      table.string('contact', 254).nullable()
      table.string('description', 254).notNullable()
      table.text('address').nullable()
      table.text('detailed_description').nullable()
      table.jsonb('facilities').nullable()
      table.jsonb('equipment').nullable()
      table.jsonb('activity_types').nullable()
      table.integer('total_score').defaultTo(0)
      table.integer('owner_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.enum('status', ['pending', 'approved', 'rejected']).defaultTo('pending')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
