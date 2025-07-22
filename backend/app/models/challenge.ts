import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Challenge extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public objectives: string

  @column()
  public recommended_exercises: string

  @column()
  public duration: number

  @column()
  public difficulty: 'easy' | 'medium' | 'hard'

  @column()
  public creator_id: number

  @column()
  public is_public: boolean

  @column()
  public type: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
} 