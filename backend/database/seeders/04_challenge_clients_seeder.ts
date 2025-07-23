import Challenge from '#models/challenge'

export default class ChallengeSeeder {
  public async run() {
    await Challenge.createMany([
      {
        name: '30-Day Pushup Challenge',
        description: 'Do pushups every day for 30 days.',
        objectives: 'Increase upper body strength.',
        recommendedExercises: JSON.stringify(['Pushup']),
        duration: 30,
        difficulty: 'medium',
        creatorId: 1,
        creatorType: 'user',
        isPublic: true,
        type: 'strength',
      },
      {
        name: 'Squat Endurance',
        description: 'Perform squats daily for two weeks.',
        objectives: 'Improve lower body endurance.',
        recommendedExercises: JSON.stringify(['Squat']),
        duration: 14,
        difficulty: 'easy',
        creatorId: 2,
        creatorType: 'user',
        isPublic: true,
        type: 'endurance',
      },
    ])
  }
}
