import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import User from './user.js'
import Challenge from './challenge.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class TrainingSession extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'user_id' })
  declare userId: number

  @column({ columnName: 'challenge_id' })
  declare challengeId: number | null

  @column.date()
  declare date: DateTime

  @column()
  declare duration: number

  @column({ columnName: 'calories_burned' })
  declare caloriesBurned: number

  @column({
    prepare: (value: any) => JSON.stringify(value),
    consume: (value: string | null) => {
      if (!value) return null
      if (typeof value === 'object') return value
      try {
        return JSON.parse(value)
      } catch (e) {
        return value
      }
    },
  })
  declare metrics: any

  @belongsTo(() => User, { foreignKey: 'userId' })
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Challenge, { foreignKey: 'challengeId' })
  declare challenge: BelongsTo<typeof Challenge>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
