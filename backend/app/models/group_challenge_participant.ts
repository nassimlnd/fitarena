import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import User from './user.js'
import GroupChallenge from './group_challenge.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class GroupChallengeParticipant extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'group_challenge_id' })
  declare groupChallengeId: number

  @column({ columnName: 'user_id' })
  declare userId: number

  @belongsTo(() => GroupChallenge, { foreignKey: 'groupChallengeId' })
  declare groupChallenge: BelongsTo<typeof GroupChallenge>

  @belongsTo(() => User, { foreignKey: 'userId' })
  declare user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true, columnName: 'joined_at' })
  declare joinedAt: DateTime
}
