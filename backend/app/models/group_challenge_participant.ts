import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class GroupChallengeParticipant extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare group_challenge_id: number

  @column()
  declare user_id: number

  @column.dateTime({ autoCreate: true })
  declare joined_at: DateTime
}
