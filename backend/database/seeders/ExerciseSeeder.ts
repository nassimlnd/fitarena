import Exercise from '#models/exercise'

export default class ExerciseSeeder {
  public async run() {
    await Exercise.createMany([
      {
        name: 'Pushup',
        description: 'A basic upper body exercise.',
        muscles: ['chest', 'triceps', 'shoulders'],
      },
      {
        name: 'Squat',
        description: 'A fundamental lower body exercise.',
        muscles: ['quadriceps', 'glutes', 'hamstrings'],
      },
    ])
  }
}
