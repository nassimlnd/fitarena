import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

export const createTrainingSessionValidator = vine.compile(
  vine.object({
    challengeId: vine.number().positive(),
    date: vine.date().transform((value) => DateTime.fromJSDate(value)),
    duration: vine.number().min(1).max(1440), // 1 minute to 24 hours
    caloriesBurned: vine.number().min(0).max(10000).optional(),
    metrics: vine.object({}).optional(),
  })
)
