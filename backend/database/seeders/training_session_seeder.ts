import TrainingSession from '#models/training_session'
import { DateTime } from 'luxon'

export default class TrainingSessionSeeder {
  public async run() {
    await TrainingSession.createMany([
      {
        user_id: 1,
        challenge_id: 1,
        date: DateTime.now().minus({ days: 2 }),
        duration: 45,
        calories_burned: 350,
        metrics: { reps: 100, sets: 5 },
      },
      {
        user_id: 1,
        challenge_id: 2,
        date: DateTime.now().minus({ days: 1 }),
        duration: 30,
        calories_burned: 220,
        metrics: { distance: 3, unit: 'km' },
      },
      {
        user_id: 2,
        challenge_id: 1,
        date: DateTime.now(),
        duration: 60,
        calories_burned: 500,
        metrics: { reps: 150, sets: 6 },
      },
      {
        user_id: 2,
        challenge_id: null,
        date: DateTime.now().minus({ days: 3 }),
        duration: 20,
        calories_burned: 120,
        metrics: { note: 'light stretching' },
      },
    ])
  }
}
