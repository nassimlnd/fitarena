import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class ChallengeClient extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare description: string

  @column()
  declare objectives: string

  @column()
  declare recommended_exercises: string

  @column()
  declare duration: number

  @column()
  declare difficulty: 'easy' | 'medium' | 'hard'

  @column()
  declare creator_id: number

  @column()
  declare is_public: boolean

  @column()
  declare type: string | null

  @belongsTo(() => User, {
    foreignKey: 'creator_id',
  })
  declare creator: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
