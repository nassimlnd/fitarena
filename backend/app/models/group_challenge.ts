import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import User from './user.js'
import Challenge from './challenge.js'
import GroupChallengeParticipant from './group_challenge_participant.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

export default class GroupChallenge extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'challenge_id' })
  declare challengeId: number

  @column({ columnName: 'group_name' })
  declare groupName: string

  @column({ columnName: 'created_by' })
  declare createdBy: number

  @belongsTo(() => Challenge, { foreignKey: 'challengeId' })
  declare challenge: BelongsTo<typeof Challenge>

  @belongsTo(() => User, { foreignKey: 'createdBy' })
  declare creator: BelongsTo<typeof User>

  @hasMany(() => GroupChallengeParticipant, {
    foreignKey: 'groupChallengeId',
  })
  declare participants: HasMany<typeof GroupChallengeParticipant>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
