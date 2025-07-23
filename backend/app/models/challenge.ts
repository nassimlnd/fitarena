import { DateTime } from 'luxon'
import { BaseModel, belongsTo, hasMany, column, beforeSave } from '@adonisjs/lucid/orm'
import Gym from './gym.js'
import User from './user.js'
import TrainingSession from './training_session.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

export default class Challenge extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare name: string

  @column()
  declare score: number | null

  @column()
  declare gymId: number | null

  @column()
  declare description: string | null

  @column()
  declare objectives: string | null

  @column({ columnName: 'recommended_exercises' })
  declare recommendedExercises: string | null

  @column()
  declare duration: number | null

  @column()
  declare difficulty: 'easy' | 'medium' | 'hard' | null

  @column({ columnName: 'creator_id' })
  declare creatorId: number | null

  @column({ columnName: 'is_public' })
  declare isPublic: boolean

  @column()
  declare type: string | null

  @column({ columnName: 'creator_type' })
  declare creatorType: 'user' | 'gym'

  @belongsTo(() => Gym, {
    foreignKey: 'gymId',
  })
  declare gym: BelongsTo<typeof Gym>

  @belongsTo(() => User, {
    foreignKey: 'creatorId',
  })
  declare creator: BelongsTo<typeof User>

  @hasMany(() => TrainingSession, {
    foreignKey: 'challengeId',
  })
  declare trainingSessions: HasMany<typeof TrainingSession>

  @beforeSave()
  static async validateCreatorConsistency(challenge: Challenge) {
    if (challenge.creatorType === 'gym') {
      if (!challenge.gymId) {
        throw new Error('Gym challenges must have a gymId')
      }
      challenge.creatorId = null
    } else if (challenge.creatorType === 'user') {
      if (!challenge.creatorId) {
        throw new Error('User challenges must have a creatorId')
      }
      challenge.gymId = null
    }
  }
}
