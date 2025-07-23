import db from '@adonisjs/lucid/services/db'
import UserSeeder from './UserSeeder.js'
import GymSeeder from './GymSeeder.js'
import ExerciseSeeder from './ExerciseSeeder.js'
import ChallengeSeeder from './ChallengeSeeder.js'

export default class DatabaseSeeder {
  public async run() {
    // Truncate tables and disable foreign key checks
    await db.rawQuery('SET FOREIGN_KEY_CHECKS = 0;')
    await db.rawQuery('TRUNCATE TABLE challenge_clients;')
    await db.rawQuery('TRUNCATE TABLE gyms;')
    await db.rawQuery('TRUNCATE TABLE exercises;')
    await db.rawQuery('TRUNCATE TABLE users;')
    await db.rawQuery('SET FOREIGN_KEY_CHECKS = 1;')

    // Now run the seeders
    await new UserSeeder().run()
    await new GymSeeder().run()
    await new ExerciseSeeder().run()
    await new ChallengeSeeder().run()
  }
}
