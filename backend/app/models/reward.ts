import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class Reward extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare icon: string | null

  @column()
  declare type: 'virtual_item' | 'title' | 'access' | 'special'

  @column({
    prepare: (value: any) => JSON.stringify(value),
    consume: (value: string) => {
      if (typeof value === 'string') {
        return JSON.parse(value)
      }
      return value
    },
  })
  declare conditions: Record<string, any>

  @column({ columnName: 'points_cost' })
  declare pointsCost: number

  @column({ columnName: 'is_active' })
  declare isActive: boolean

  @column({ columnName: 'is_repeatable' })
  declare isRepeatable: boolean

  @manyToMany(() => User, {
    pivotTable: 'user_rewards',
    pivotTimestamps: true,
    pivotColumns: ['claimed_at', 'context', 'is_active'],
  })
  declare users: ManyToMany<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
