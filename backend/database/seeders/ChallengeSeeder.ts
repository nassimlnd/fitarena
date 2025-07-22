import Challenge from '#models/challenge'

export default class ChallengeSeeder {
  public async run() {
    await Challenge.createMany([
      {
        title: '30-Day Pushup Challenge',
        description: 'Do pushups every day for 30 days.',
        objectives: 'Increase upper body strength.',
        recommended_exercises: JSON.stringify(['Pushup']),
        duration: 30,
        difficulty: 'medium',
        creator_id: 1,
        is_public: true,
        type: 'strength',
      },
      {
        title: 'Squat Endurance',
        description: 'Perform squats daily for two weeks.',
        objectives: 'Improve lower body endurance.',
        recommended_exercises: JSON.stringify(['Squat']),
        duration: 14,
        difficulty: 'easy',
        creator_id: 1,
        is_public: true,
        type: 'endurance',
      },
    ])
  }
}