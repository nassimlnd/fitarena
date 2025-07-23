import TrainingSession from '#models/training_session'
import { DateTime } from 'luxon'

export default class TrainingSessionSeeder {
  public async run() {
    await TrainingSession.createMany([
      {
        userId: 1,
        challengeId: 1,
        date: DateTime.now().minus({ days: 2 }),
        duration: 45,
        caloriesBurned: 350,
        metrics: { reps: 100, sets: 5 },
      },
      {
        userId: 1,
        challengeId: 2,
        date: DateTime.now().minus({ days: 1 }),
        duration: 30,
        caloriesBurned: 220,
        metrics: { distance: 3, unit: 'km' },
      },
      {
        userId: 2,
        challengeId: 1,
        date: DateTime.now(),
        duration: 60,
        caloriesBurned: 500,
        metrics: { reps: 150, sets: 6 },
      },
      {
        userId: 2,
        challengeId: null,
        date: DateTime.now().minus({ days: 3 }),
        duration: 20,
        caloriesBurned: 120,
        metrics: { note: 'light stretching' },
      },
    ])
  }
}
