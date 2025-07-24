import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasOne, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import type { HasOne, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Gym from './gym.js'
import Challenge from './challenge.js'
import TrainingSession from './training_session.js'
import Badge from './badge.js'
import Reward from './reward.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare role: 'admin' | 'gymOwner' | 'user'

  @column()
  declare isActive: boolean

  @column()
  declare totalPoints: number

  @column()
  declare availablePoints: number

  @column()
  declare level: number

  @column()
  declare experiencePoints: number

  @column({
    prepare: (value: any) => JSON.stringify(value),
    consume: (value: string | object) => {
      if (!value) return null
      if (typeof value === 'object') return value
      try {
        return JSON.parse(value)
      } catch (e) {
        return null
      }
    },
  })
  declare achievementsProgress: Record<string, any> | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // Relations
  @hasOne(() => Gym, {
    foreignKey: 'ownerId',
  })
  declare gym: HasOne<typeof Gym>

  @hasMany(() => Challenge, {
    foreignKey: 'creatorId',
  })
  declare createdChallenges: HasMany<typeof Challenge>

  @hasMany(() => TrainingSession, {
    foreignKey: 'userId',
  })
  declare trainingSessions: HasMany<typeof TrainingSession>

  @manyToMany(() => Badge, {
    pivotTable: 'user_badges',
    pivotTimestamps: true,
    pivotColumns: ['earned_at', 'context'],
  })
  declare badges: ManyToMany<typeof Badge>

  @manyToMany(() => Reward, {
    pivotTable: 'user_rewards',
    pivotTimestamps: true,
    pivotColumns: ['claimed_at', 'context', 'is_active'],
  })
  declare rewards: ManyToMany<typeof Reward>

  static accessTokens = DbAccessTokensProvider.forModel(User)
}
