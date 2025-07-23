import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ChallengeInvitation extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare inviterId: number

  @column()
  declare inviteeId: number

  @column()
  declare challengeId: number

  @column()
  declare status: 'pending' | 'accepted' | 'declined'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
