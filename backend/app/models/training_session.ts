import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import User from './user.js'
import ChallengeClient from './challengeclient.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class TrainingSession extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user_id: number

  @column()
  declare challenge_id: number | null

  @column.date()
  declare date: DateTime

  @column()
  declare duration: number

  @column()
  declare calories_burned: number

  @column({
    prepare: (value: any) => JSON.stringify(value),
    consume: (value: string) => JSON.parse(value),
  })
  declare metrics: any

  @belongsTo(() => User, { foreignKey: 'user_id' })
  declare user: BelongsTo<typeof User>

  @belongsTo(() => ChallengeClient, { foreignKey: 'challenge_id' })
  declare challenge: BelongsTo<typeof ChallengeClient>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
