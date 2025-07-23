import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class GroupChallenge extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare challengeId: number

  @column()
  declare goupName: string

  @column()
  declare created_by: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
