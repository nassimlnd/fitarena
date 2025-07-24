import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Gym extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare name: string

  @column()
  declare contact: string

  @column()
  declare description: string | null

  @column()
  declare address: string | null

  @column()
  declare detailedDescription: string | null

  @column({
    prepare: (value: string[]) => JSON.stringify(value),
  })
  declare facilities: string[]

  @column({
    prepare: (value: string[]) => JSON.stringify(value),
  })
  declare equipment: string[]

  @column({
    prepare: (value: string[]) => JSON.stringify(value),
  })
  declare activityTypes: string[]

  @column()
  declare totalScore: number

  @column()
  declare ownerId: number

  @column()
  declare status: 'pending' | 'approved' | 'rejected'

  @belongsTo(() => User, {
    foreignKey: 'ownerId',
  })
  declare owner: BelongsTo<typeof User>
}
