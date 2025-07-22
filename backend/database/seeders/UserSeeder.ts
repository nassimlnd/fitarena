import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

export default class UserSeeder {
  public async run() {
    await User.createMany([
      {
        fullName: 'Admin User',
        email: 'admin@example.com',
        password: await hash.make('password'),
        role: 'admin',
      },
      {
        fullName: 'Owner User',
        email: 'owner@example.com',
        password: await hash.make('password'),
        role: 'owner',
      },
      {
        fullName: 'Regular User',
        email: 'user@example.com',
        password: await hash.make('password'),
        role: 'user',
      },
    ])
  }
}
