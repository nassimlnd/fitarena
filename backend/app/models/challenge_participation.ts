import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Challenge from './challenge.js'

export default class ChallengeParticipation extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare challengeId: number

  @column()
  declare userId: number

  @column()
  declare status: 'in_progress' | 'completed' | 'abandoned'

  @column.dateTime()
  declare startedAt: DateTime

  @column.dateTime()
  declare completedAt: DateTime | null

  @column()
  declare score: number | null

  @column()
  declare notes: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Challenge)
  declare challenge: BelongsTo<typeof Challenge>
}
