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
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
