import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class Badge extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare icon: string | null

  @column()
  declare color: string

  @column()
  declare type: 'achievement' | 'milestone' | 'special'

  @column({
    prepare: (value: any) => JSON.stringify(value),
    consume: (value: string | object) => {
      if (typeof value === 'string') {
        return JSON.parse(value)
      }
      return value
    },
  })
  declare criteria: Record<string, any>

  @column()
  declare points: number

  @column()
  declare isActive: boolean

  @manyToMany(() => User, {
    pivotTable: 'user_badges',
    pivotTimestamps: true,
    pivotColumns: ['earned_at', 'context'],
  })
  declare users: ManyToMany<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
