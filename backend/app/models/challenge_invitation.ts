import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import User from './user.js'
import Challenge from './challenge.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class ChallengeInvitation extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'inviter_id' })
  declare inviterId: number

  @column({ columnName: 'invitee_id' })
  declare inviteeId: number

  @column({ columnName: 'challenge_id' })
  declare challengeId: number

  @column()
  declare status: 'pending' | 'accepted' | 'declined'

  @belongsTo(() => User, { foreignKey: 'inviterId' })
  declare inviter: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'inviteeId' })
  declare invitee: BelongsTo<typeof User>

  @belongsTo(() => Challenge, { foreignKey: 'challengeId' })
  declare challenge: BelongsTo<typeof Challenge>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
