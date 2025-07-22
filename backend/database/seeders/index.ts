import UserSeeder from './UserSeeder.js'
import GymSeeder from './GymSeeder.js'
import ExerciseSeeder from './ExerciseSeeder.js'
import ChallengeSeeder from './ChallengeSeeder.js'

export default class DatabaseSeeder {
  public async run() {
    await new UserSeeder().run()
    await new GymSeeder().run()
    await new ExerciseSeeder().run()
    await new ChallengeSeeder().run()
  }
}
