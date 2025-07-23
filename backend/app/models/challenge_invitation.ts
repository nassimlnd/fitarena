import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ChallengeInvitation extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare inviter_id: number

  @column()
  declare invitee_id: number

  @column()
  declare challenge_id: number

  @column()
  declare status: 'pending' | 'accepted' | 'declined'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
